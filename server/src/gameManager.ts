import { Server, Socket } from 'socket.io';
import { GameState, User, Report, Constraint, GamePhase } from './types';

import { RULESETS } from './constraintsData';

// ... (keep imports)

export class GameManager {
    private io: Server;
    private state: GameState;
    private timerInterval: NodeJS.Timeout | null = null;

    constructor(io: Server) {
        this.io = io;
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

    public addUser(socketId: string, name: string, userId: string) {
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

        const newUser: User = {
            id: socketId,
            userId,
            name,
            isHost: this.state.users.length === 0,
            score: 0,
            isConnected: true,
        };
        this.state.users.push(newUser);
        this.broadcastState();
    }

    public rejoinGame(socketId: string, userId: string) {
        const existingUser = this.state.users.find(u => u.userId === userId);
        if (existingUser) {
            existingUser.id = socketId;
            existingUser.isConnected = true;
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

    public startGame() {
        if (this.state.phase !== 'LOBBY') return;
        if (this.state.users.length !== 4) return;
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
                this.changePhase('SCRIPTING_3');
                this.startTimer(300);
                break;
            case 'SCRIPTING_3':
                this.changePhase('SCRIPTING_4');
                this.startTimer(300);
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
                this.resetGame(); // Or just go back to lobby
                this.changePhase('LOBBY');
                break;
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

            // Assign random constraint from RULESETS
            const randomRuleset = RULESETS[Math.floor(Math.random() * RULESETS.length)];

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

    private broadcastState() {
        this.io.emit('game_state_update', this.state);
    }
}
