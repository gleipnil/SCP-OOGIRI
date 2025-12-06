import { Server, Socket } from 'socket.io';
import { GameState, User, Report, Constraint, GamePhase } from './types';

import { RULESETS } from './constraintsData';
import { supabaseAdmin } from '../utils/supabaseAdmin';

// ... (keep imports)

export class GameManager {
    private io: Server;
    private state: GameState;
    private timerInterval: NodeJS.Timeout | null = null;
    public sessionId: string;

    constructor(io: Server, sessionId: string) {
        this.io = io;
        this.sessionId = sessionId;
        this.state = {
            phase: 'LOBBY',
            users: [],
            keywordsPool: [],
            reports: [],
            timer: {
                remaining: 0,
                isActive: false,
                isBlinking: false,
            },
            readyStates: {},
            votes: {
                bestReportVotes: {},
                constraintChecks: {},
            },
            currentPresentationIndex: 0,
        };
    }

    public getState(): GameState {
        return this.state;
    }

    public async addUser(socketId: string, name: string, userId: string) {
        const existingUser = this.state.users.find(u => u.userId === userId);
        if (existingUser) {
            // User exists, update socket ID and connection status
            existingUser.id = socketId;
            existingUser.isConnected = true;
            existingUser.name = name; // Update name if changed
            this.broadcastState();
            return;
        }

        if (this.state.phase !== 'LOBBY') {
            this.io.to(socketId).emit('join_error', 'Protocol Active: Access Denied. Operation in progress.');
            return;
        }

        if (this.state.users.length >= 4) {
            this.io.to(socketId).emit('join_error', 'Capacity Reached: Team Full. Access Denied.');
            return;
        }

        // Fetch user difficulty from Supabase
        let difficulty_level: 'A' | 'B' | 'C' = 'C';
        try {
            const { data, error } = await supabaseAdmin
                .from('profiles')
                .select('difficulty_level')
                .eq('id', userId)
                .single();

            if (data && data.difficulty_level) {
                difficulty_level = data.difficulty_level as 'A' | 'B' | 'C';
            }
        } catch (err) {
            console.error('Error fetching user difficulty:', err);
        }

        const newUser: User = {
            id: socketId,
            userId,
            name,
            isHost: this.state.users.length === 0,
            score: 0,
            isConnected: true,
            difficulty_level
        };
        this.state.users.push(newUser);

        // Join the socket to the session room
        const socket = this.io.sockets.sockets.get(socketId);
        if (socket) {
            socket.join(this.sessionId);
        }

        this.broadcastState();
    }

    public rejoinGame(socketId: string, userId: string) {
        const existingUser = this.state.users.find(u => u.userId === userId);
        if (existingUser) {
            const oldSocketId = existingUser.id;

            // 1. Update User Socket ID
            existingUser.id = socketId;
            existingUser.isConnected = true;

            // Re-join the socket to the session room
            const socket = this.io.sockets.sockets.get(socketId);
            if (socket) {
                socket.join(this.sessionId);
            }

            // 2. Migrate Reports (Owner & Authors)
            this.state.reports.forEach(report => {
                if (report.ownerId === oldSocketId) {
                    report.ownerId = socketId;
                }
                if (report.authors.procedures === oldSocketId) {
                    report.authors.procedures = socketId;
                }
                if (report.authors.descEarly === oldSocketId) {
                    report.authors.descEarly = socketId;
                }
                if (report.authors.descLate === oldSocketId) {
                    report.authors.descLate = socketId;
                }
            });

            // 3. Migrate Ready States
            if (this.state.readyStates[oldSocketId]) {
                this.state.readyStates[socketId] = this.state.readyStates[oldSocketId];
                delete this.state.readyStates[oldSocketId];
            }

            // 4. Migrate Votes (Constraint Checks)
            // bestReportVotes are keyed by reportId, so they don't need migration unless we track *who* voted there (we don't seem to track voter ID for best report, just count?)
            // Wait, looking at submitVote: this.state.votes.bestReportVotes[bestReportId]++; 
            // It seems we don't track WHO voted for best report, just the count. So that's fine.

            // Constraint Checks: { [reportId: string]: { [voterId: string]: boolean } }
            Object.keys(this.state.votes.constraintChecks).forEach(reportId => {
                const checks = this.state.votes.constraintChecks[reportId];
                if (checks && checks[oldSocketId] !== undefined) {
                    checks[socketId] = checks[oldSocketId];
                    delete checks[oldSocketId];
                }
            });

            this.broadcastState();
        }
    }

    public removeUser(socketId: string) {
        const user = this.state.users.find(u => u.id === socketId);
        if (user) {
            user.isConnected = false;
            // We don't remove the user from the list to allow reconnection
            // But if they are in LOBBY and not started, maybe we should?
            // For now, let's keep them to support reload in lobby too.
        }
        this.broadcastState();
    }

    public leaveGame(socketId: string) {
        const userIndex = this.state.users.findIndex(u => u.id === socketId);
        if (userIndex !== -1) {
            const wasHost = this.state.users[userIndex].isHost;
            this.state.users.splice(userIndex, 1);

            // Reassign host if needed
            if (wasHost && this.state.users.length > 0) {
                this.state.users[0].isHost = true;
            }

            // If game was in progress and users drop below 3, maybe reset?
            // For now, just broadcast. The game might break if users drop mid-game, 
            // but this is primarily for Lobby/Result.

            this.broadcastState();
        }
    }

    public startGame() {
        if (this.state.phase !== 'LOBBY') return;
        if (this.state.users.length < 3 || this.state.users.length > 4) return;
        this.changePhase('SUGGESTION');
        this.startTimer(180); // 3 minutes for suggestion
    }

    public submitSuggestion(socketId: string, keywords: string[]) {
        if (this.state.phase !== 'SUGGESTION') return;

        // Store keywords temporarily or just add to pool? 
        // We need to track who submitted to know when everyone is done.
        // For simplicity, we assume client sends all 5 at once.
        this.state.readyStates[socketId] = true;
        this.state.keywordsPool.push(...keywords);

        this.broadcastState();
    }

    public submitChoice(socketId: string, selectedKeywords: string[]) {
        if (this.state.phase !== 'CHOICE') return;

        const report = this.state.reports.find(r => r.ownerId === socketId);
        if (report) {
            report.selectedKeywords = selectedKeywords;
            this.state.readyStates[socketId] = true;
            this.broadcastState();
        }
    }

    public submitScript(socketId: string, content: string) {
        const phase = this.state.phase;
        if (!['SCRIPTING_1', 'SCRIPTING_2', 'SCRIPTING_3', 'SCRIPTING_4'].includes(phase)) return;

        // Find which report this user is currently writing
        const userIndex = this.state.users.findIndex(u => u.id === socketId);
        if (userIndex === -1) return;

        const reportIndex = this.getAssignedReportIndex(userIndex, phase);
        const report = this.state.reports[reportIndex];

        if (report) {
            if (phase === 'SCRIPTING_1') {
                report.containmentProcedures = content;
                report.authors.procedures = socketId;
            } else if (phase === 'SCRIPTING_2') {
                report.descriptionEarly = content;
                report.authors.descEarly = socketId;
            } else if (phase === 'SCRIPTING_3') {
                report.descriptionLate = content;
                report.authors.descLate = socketId;
            } else if (phase === 'SCRIPTING_4') {
                // In phase 4, content might be JSON or separated strings for title and conclusion
                // For simplicity, let's assume client sends JSON string or we handle it differently.
                // Let's assume content is just conclusion for now, and title is sent separately or we parse it.
                // Or better, change signature to accept object? For now, let's assume content is JSON stringified {title, conclusion}
                try {
                    const data = JSON.parse(content);
                    report.title = data.title;
                    report.conclusion = data.conclusion;
                } catch (e) {
                    report.conclusion = content; // Fallback
                }
            }
            this.state.readyStates[socketId] = true;
            this.broadcastState();
        }
    }

    public cancelSubmission(socketId: string) {
        if (this.state.readyStates[socketId]) {
            this.state.readyStates[socketId] = false;
            this.broadcastState();
        }
    }

    public nextPhase() {
        switch (this.state.phase) {
            case 'SUGGESTION':
                this.distributeKeywordsAndConstraints();
                this.changePhase('CHOICE');
                this.startTimer(60);
                break;
            case 'CHOICE':
                this.changePhase('SCRIPTING_1');
                this.startTimer(300);
                break;
            case 'SCRIPTING_1':
                this.changePhase('SCRIPTING_2');
                this.startTimer(300);
                break;
            case 'SCRIPTING_2':
                if (this.state.users.length === 3) {
                    this.changePhase('SCRIPTING_4');
                    this.startTimer(900); // 15 minutes
                } else {
                    this.changePhase('SCRIPTING_3');
                    this.startTimer(300);
                }
                break;
            case 'SCRIPTING_3':
                this.changePhase('SCRIPTING_4');
                this.startTimer(900); // 15 minutes
                break;
            case 'SCRIPTING_4':
                this.changePhase('PRESENTATION');
                this.state.currentPresentationIndex = 0;
                this.stopTimer();
                break;
            case 'PRESENTATION':
                if (this.state.currentPresentationIndex < this.state.users.length - 1) {
                    this.state.currentPresentationIndex++;
                } else {
                    this.changePhase('VOTING');
                }
                this.broadcastState();
                break;
            case 'VOTING':
                this.calculateScores();
                this.changePhase('RESULT');
                break;
            case 'RESULT':
                // Save reports to Supabase
                this.saveReportsToSupabase();

                this.resetGame(); // Or just go back to lobby
                this.changePhase('LOBBY');
                break;
        }
    }

    private async saveReportsToSupabase() {
        try {
            const reportsToInsert = this.state.reports.map(report => {
                // Map socket IDs to Supabase User IDs
                const owner = this.state.users.find(u => u.id === report.ownerId);
                const procedureAuthor = this.state.users.find(u => u.id === report.authors.procedures);
                const descEarlyAuthor = this.state.users.find(u => u.id === report.authors.descEarly);
                const descLateAuthor = this.state.users.find(u => u.id === report.authors.descLate);

                // Collect all unique author IDs (including owner)
                const authorIds = new Set<string>();
                if (owner?.userId) authorIds.add(owner.userId);
                if (procedureAuthor?.userId) authorIds.add(procedureAuthor.userId);
                if (descEarlyAuthor?.userId) authorIds.add(descEarlyAuthor.userId);
                if (descLateAuthor?.userId) authorIds.add(descLateAuthor.userId);

                return {
                    title: report.title || 'Untitled Report',
                    content: {
                        containmentProcedures: report.containmentProcedures,
                        descriptionEarly: report.descriptionEarly,
                        descriptionLate: report.descriptionLate,
                        conclusion: report.conclusion,
                        constraint: report.constraint,
                        selectedKeywords: report.selectedKeywords
                    },
                    author_ids: Array.from(authorIds)
                };
            });

            if (reportsToInsert.length > 0) {
                const { error } = await supabaseAdmin
                    .from('reports')
                    .insert(reportsToInsert);

                if (error) {
                    console.error('Error saving reports to Supabase:', error);
                } else {
                    console.log('Reports saved successfully.');
                }
            }

            // Update User Stats (Total Plays & Apollyon Wins)
            // Apollyon Win Condition: Everyone survived? Or just participating in an Apollyon game?
            // "Apollyon Wins" implies winning a hard mode game.
            // Let's assume if difficulty was 'A' (Hard) and they completed the game (reached RESULT), it counts.
            // Or maybe we need a specific win condition?
            // For now, let's count it if they are in the game at RESULT phase.

            for (const user of this.state.users) {
                if (!user.userId) continue;

                try {
                    // Increment total_plays
                    const { error: playError } = await supabaseAdmin.rpc('increment_total_plays', { user_id: user.userId });
                    if (playError) throw playError;

                    // Increment apollyon_wins if difficulty was A (Hard)
                    if (user.difficulty_level === 'A') {
                        const { error: winError } = await supabaseAdmin.rpc('increment_apollyon_wins', { user_id: user.userId });
                        if (winError) throw winError;
                    }
                } catch (err) {
                    console.error(`Error updating stats for user ${user.userId}:`, err);
                }
            }

        } catch (err) {
            console.error('Unexpected error saving reports:', err);
        }
    }

    public submitVote(voterId: string, bestReportId: string, constraintChecks: { [reportId: string]: boolean }) {
        if (this.state.phase !== 'VOTING') return;

        // Record best report vote
        if (!this.state.votes.bestReportVotes[bestReportId]) {
            this.state.votes.bestReportVotes[bestReportId] = 0;
        }
        this.state.votes.bestReportVotes[bestReportId]++;

        // Record constraint checks
        Object.entries(constraintChecks).forEach(([reportId, isSuccess]) => {
            if (!this.state.votes.constraintChecks[reportId]) {
                this.state.votes.constraintChecks[reportId] = {};
            }
            this.state.votes.constraintChecks[reportId][voterId] = isSuccess;
        });

        this.state.readyStates[voterId] = true;
        this.broadcastState();
    }

    private changePhase(newPhase: GamePhase) {
        this.state.phase = newPhase;
        this.state.readyStates = {};
        this.broadcastState();
    }

    private startTimer(seconds: number) {
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.state.timer.remaining = seconds;
        this.state.timer.isActive = true;
        this.state.timer.isBlinking = false;
        this.broadcastState();

        this.timerInterval = setInterval(() => {
            if (this.state.timer.remaining > 0) {
                this.state.timer.remaining--;
            } else {
                this.state.timer.isActive = false;
                this.state.timer.isBlinking = true;
                // We don't auto transition, just blink
            }
            this.broadcastState(); // Maybe optimize to not broadcast every second if performance is issue, but for 4 users it's fine
        }, 1000);
    }

    private stopTimer() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.state.timer.isActive = false;
        this.state.timer.isBlinking = false;
        this.broadcastState();
    }

    private distributeKeywordsAndConstraints() {
        // Shuffle keywords
        const shuffledKeywords = [...this.state.keywordsPool].sort(() => 0.5 - Math.random());

        // Initialize reports
        this.state.reports = this.state.users.map((user, index) => {
            // Give 5 keywords to each user
            const userKeywords = shuffledKeywords.slice(index * 5, (index + 1) * 5);

            // Filter RULESETS based on user difficulty
            // C: tier 'C' only
            // B: tier 'C', 'B'
            // A: all ('A', 'B', 'C')
            const userDifficulty = user.difficulty_level || 'C';
            const allowedDifficulties = userDifficulty === 'A' ? ['A', 'B', 'C'] : userDifficulty === 'B' ? ['B', 'C'] : ['C'];

            const availableRulesets = RULESETS.filter(r => allowedDifficulties.includes(r.difficulty));

            // Fallback if no rulesets found (should not happen with current data)
            const targetRulesets = availableRulesets.length > 0 ? availableRulesets : RULESETS;

            // Assign random constraint from filtered RULESETS
            const randomRuleset = targetRulesets[Math.floor(Math.random() * targetRulesets.length)];

            // Pick one from each front_rule category
            const publicDescriptions = [
                randomRuleset.front_rules.object_class[Math.floor(Math.random() * randomRuleset.front_rules.object_class.length)],
                randomRuleset.front_rules.scp_nature[Math.floor(Math.random() * randomRuleset.front_rules.scp_nature.length)],
                randomRuleset.front_rules.observation_feature[Math.floor(Math.random() * randomRuleset.front_rules.observation_feature.length)],
                randomRuleset.front_rules.foundation_response[Math.floor(Math.random() * randomRuleset.front_rules.foundation_response.length)]
            ];

            // Pick one from back_rules
            const hiddenDescription = randomRuleset.back_rules[Math.floor(Math.random() * randomRuleset.back_rules.length)];

            return {
                id: `report-${user.id}`,
                ownerId: user.id,
                selectedKeywords: userKeywords,
                constraint: {
                    id: `constraint-${Math.random()}`,
                    publicDescriptions,
                    hiddenDescription
                },
                title: '',
                containmentProcedures: '',
                descriptionEarly: '',
                descriptionLate: '',
                conclusion: '',
                authors: {
                    procedures: '',
                    descEarly: '',
                    descLate: '',
                }
            };
        });
    }

    // ... (keep other methods)
    private getAssignedReportIndex(userIndex: number, phase: GamePhase): number {
        const userCount = this.state.users.length;
        let offset = 0;
        if (phase === 'SCRIPTING_1') offset = 1;
        if (phase === 'SCRIPTING_2') offset = 2;
        if (phase === 'SCRIPTING_3') offset = 3;
        if (phase === 'SCRIPTING_4') offset = 0;

        // For 3 players, we skip phase 3, so offset logic remains consistent for 1, 2, and 4 (0).
        // Phase 1 (Offset 1): i writes for i-1.
        // Phase 2 (Offset 2): i writes for i-2.
        // Phase 4 (Offset 0): i writes for i.

        // Logic: User I writes for Report (I - offset)
        // Example: User 1 (Index 1) in Scripting 1 (Offset 1) writes for Report 0.
        // (1 - 1) = 0. Correct.
        // Formula: (userIndex - offset + userCount) % userCount
        return (userIndex - offset + userCount) % userCount;
    }

    private calculateScores() {
        // Reset scores
        this.state.users.forEach(u => u.score = 0);

        // Best Report Score (+10 per vote)
        Object.entries(this.state.votes.bestReportVotes).forEach(([reportId, count]) => {
            const report = this.state.reports.find(r => r.id === reportId);
            if (report) {
                const owner = this.state.users.find(u => u.id === report.ownerId);
                if (owner) {
                    owner.score += count * 10;
                }
            }
        });

        // Constraint Check Score
        this.state.reports.forEach(report => {
            const checks = this.state.votes.constraintChecks[report.id] || {};
            const totalVotes = Object.keys(checks).length;
            const successVotes = Object.values(checks).filter(v => v).length;

            // If majority says success
            if (totalVotes > 0 && successVotes > totalVotes / 2) {
                // Owner +20
                const owner = this.state.users.find(u => u.id === report.ownerId);
                if (owner) owner.score += 20;

                // Contributors +5
                [report.authors.procedures, report.authors.descEarly, report.authors.descLate].forEach(authorId => {
                    const author = this.state.users.find(u => u.id === authorId);
                    if (author) author.score += 5;
                });
            }
        });
    }

    private resetGame() {
        this.state.phase = 'LOBBY';
        this.state.keywordsPool = [];
        this.state.reports = [];
        this.state.votes = { bestReportVotes: {}, constraintChecks: {} };
        this.state.readyStates = {};
        this.stopTimer();
        this.state.users.forEach(u => u.score = 0);
    }

    public isEmpty(): boolean {
        return this.state.users.length === 0;
    }

    private broadcastState() {
        this.io.to(this.sessionId).emit('game_state_update', this.state);
    }
}
