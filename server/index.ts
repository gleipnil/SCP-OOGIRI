import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { GameManager } from './src/gameManager';
import { SessionManager } from './src/sessionManager';
import { supabaseAdmin } from './utils/supabaseAdmin';

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: [
            "http://localhost:3000",
            "https://scp-oogiri.vercel.app",
            "https://scp-oogiri.com",
            "https://www.scp-oogiri.com",
            process.env.CLIENT_URL || ""
        ].filter(Boolean),
        methods: ["GET", "POST"]
    }
});

const sessionManager = new SessionManager(io);

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Session Management Events
    socket.on('get_sessions', () => {
        socket.emit('session_list_update', sessionManager.getAllSessions());
    });

    socket.on('create_session', (data: { hostName: string, hostUserId: string }) => {
        try {
            const sessionId = sessionManager.createSession(socket.id, data.hostName, data.hostUserId);
            const game = sessionManager.getSession(sessionId);
            if (game) {
                socket.emit('session_created', sessionId);
                socket.emit('game_state_update', game.getState());
                io.emit('session_list_update', sessionManager.getAllSessions()); // Broadcast list update
            }
        } catch (e: any) {
            socket.emit('join_error', e.message);
        }
    });

    socket.on('join_session', (data: { sessionId: string, name: string, userId: string }) => {
        try {
            sessionManager.joinSession(data.sessionId, socket.id, data.name, data.userId);
            const game = sessionManager.getSession(data.sessionId);
            if (game) {
                socket.emit('session_joined', data.sessionId);
                // game_state_update is broadcasted by joinSession -> addUser -> broadcastState
                io.emit('session_list_update', sessionManager.getAllSessions());
            }
        } catch (e: any) {
            socket.emit('join_error', e.message);
        }
    });

    socket.on('check_active_session', (userId: string) => {
        const sessionId = sessionManager.findSessionByUserId(userId);
        if (sessionId) {
            socket.emit('active_session_found', sessionId);
        } else {
            socket.emit('no_active_session');
        }
    });

    // Game Events - Route to correct session
    const getGame = () => sessionManager.getSessionBySocket(socket.id);

    socket.on('rejoin_game', (userId: string) => {
        // For rejoin, we might need to search all sessions for the user?
        // Or client sends sessionId?
        // Current logic: Client sends userId. We need to find which session they were in.
        // SessionManager doesn't track userId -> session map globally yet, but we can iterate.
        // Optimization: For now, iterate all sessions.
        let found = false;
        const sessions = sessionManager.getAllSessions(); // This returns info, not objects.
        // We need internal access or a method.
        // Let's add a method to SessionManager to find session by userId if needed, 
        // OR just rely on client storing sessionId in localStorage too.
        // For backward compatibility/robustness, let's try to find them.

        // Actually, let's implement a simple search in SessionManager or just iterate here if we expose sessions.
        // Since sessions is private, let's assume for now we can't easily find them without sessionId.
        // BUT, we can ask the client to send sessionId if they have it.
        // If not, we might fail to rejoin.
        // Let's update client to store sessionId.

        // For now, let's try to find them in active sessions (max 4).
        // We can't access private sessions map.
        // Let's skip deep rejoin logic for a moment and assume client will join via "Join" button or we add `findSessionByUserId` to SessionManager.
        // Let's add `findSessionByUserId` to SessionManager later if needed.
        // For now, let's just handle game events if they are already connected.
    });

    socket.on('start_game', () => {
        getGame()?.startGame();
        io.emit('session_list_update', sessionManager.getAllSessions());
    });

    socket.on('submit_suggestion', (keywords: string[]) => {
        getGame()?.submitSuggestion(socket.id, keywords);
    });

    socket.on('submit_choice', (selectedKeywords: string[]) => {
        getGame()?.submitChoice(socket.id, selectedKeywords);
    });

    socket.on('submit_script', (content: string) => {
        getGame()?.submitScript(socket.id, content);
    });

    socket.on('cancel_submission', () => {
        getGame()?.cancelSubmission(socket.id);
    });

    socket.on('next_phase', () => {
        getGame()?.nextPhase();
        io.emit('session_list_update', sessionManager.getAllSessions());
    });

    socket.on('submit_vote', (data: { bestReportId: string, constraintChecks: { [reportId: string]: boolean } }) => {
        getGame()?.submitVote(socket.id, data.bestReportId, data.constraintChecks);
    });

    socket.on('leave_game', () => {
        console.log('User left game:', socket.id);
        sessionManager.leaveSession(socket.id);
        io.emit('session_list_update', sessionManager.getAllSessions());
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        sessionManager.removeUser(socket.id);
        io.emit('session_list_update', sessionManager.getAllSessions());
    });

    // Admin Events
    socket.on('admin_force_close_session', async (data: { sessionId: string, userId: string }) => {
        try {
            // Verify admin
            const { data: profile, error } = await supabaseAdmin
                .from('profiles')
                .select('is_admin')
                .eq('id', data.userId)
                .single();

            if (error || !profile?.is_admin) {
                socket.emit('admin_error', 'Unauthorized access.');
                return;
            }

            sessionManager.forceCloseSession(data.sessionId);
            io.emit('session_list_update', sessionManager.getAllSessions());
            socket.emit('admin_action_success', 'Protocol terminated successfully.');
        } catch (e: any) {
            console.error('Admin action failed:', e);
            socket.emit('admin_error', 'Action failed.');
        }
    });

    socket.on('admin_create_report', async (data: {
        userId: string;
        title: string;
        created_at?: string;
        owner_id: string;
        keywords: string[];
        constraints: {
            public: string[];
            hidden: string;
        };
        content: {
            procedures: { author_id: string, text: string };
            desc_early: { author_id: string, text: string };
            desc_late: { author_id: string, text: string };
            conclusion: { author_id: string, text: string };
        }
    }) => {
        try {
            // Verify admin
            const { data: profile, error } = await supabaseAdmin
                .from('profiles')
                .select('is_admin')
                .eq('id', data.userId)
                .single();

            if (error || !profile?.is_admin) {
                socket.emit('admin_error', 'Unauthorized access.');
                return;
            }

            // Collect unique author IDs
            const authorIds = new Set<string>();
            if (data.owner_id) authorIds.add(data.owner_id);
            if (data.content.procedures.author_id) authorIds.add(data.content.procedures.author_id);
            if (data.content.desc_early.author_id) authorIds.add(data.content.desc_early.author_id);
            if (data.content.desc_late.author_id) authorIds.add(data.content.desc_late.author_id);
            if (data.content.conclusion.author_id) authorIds.add(data.content.conclusion.author_id);

            const reportToInsert = {
                title: data.title,
                created_at: data.created_at || new Date().toISOString(),
                content: {
                    containmentProcedures: data.content.procedures.text,
                    descriptionEarly: data.content.desc_early.text,
                    descriptionLate: data.content.desc_late.text,
                    conclusion: data.content.conclusion.text,
                    constraint: {
                        publicDescriptions: data.constraints.public,
                        hiddenDescription: data.constraints.hidden
                    },
                    selectedKeywords: data.keywords
                },
                author_ids: Array.from(authorIds)
            };

            const { error: insertError } = await supabaseAdmin
                .from('reports')
                .insert([reportToInsert]);

            if (insertError) {
                console.error('Error creating report:', insertError);
                socket.emit('admin_error', 'Failed to create report: ' + insertError.message);
            } else {
                socket.emit('admin_action_success', 'Report created successfully.');
            }

        } catch (e: any) {
            console.error('Admin create report failed:', e);
            socket.emit('admin_error', 'Action failed: ' + e.message);
        }
    });

    socket.on('admin_recalculate_stats', async (data: { userId: string }) => {
        try {
            // Verify admin
            const { data: profile, error } = await supabaseAdmin
                .from('profiles')
                .select('is_admin')
                .eq('id', data.userId)
                .single();

            if (error || !profile?.is_admin) {
                socket.emit('admin_error', 'Unauthorized access.');
                return;
            }

            console.log('Starting stats recalculation...');

            // 1. Fetch all reports
            const { data: reports, error: fetchError } = await supabaseAdmin
                .from('reports')
                .select('id, created_at, author_ids');

            if (fetchError || !reports) {
                throw new Error('Failed to fetch reports: ' + fetchError?.message);
            }

            // Fetch all likes
            const { data: likes, error: likesError } = await supabaseAdmin
                .from('likes')
                .select('report_id');

            if (likesError) {
                console.error('Failed to fetch likes:', likesError);
            }

            // 2. Calculate Plays and Likes
            interface SessionData {
                participants: Set<string>;
            }
            const sessions: { [timeKey: string]: SessionData } = {};
            const reportLikeCounts: { [reportId: string]: number } = {};

            // Count likes per report
            if (likes) {
                likes.forEach((like: any) => {
                    reportLikeCounts[like.report_id] = (reportLikeCounts[like.report_id] || 0) + 1;
                });
            }

            // Process Reports
            const finalUserCounts: { [userId: string]: { plays: number, likes: number } } = {};

            reports.forEach((report: any) => {
                const date = new Date(report.created_at);
                date.setSeconds(0, 0); // Group by minute
                const timeKey = date.toISOString();

                if (!sessions[timeKey]) {
                    sessions[timeKey] = { participants: new Set() };
                }

                const likesForThisReport = reportLikeCounts[report.id] || 0;

                // Add participants and distribute likes
                if (Array.isArray(report.author_ids)) {
                    report.author_ids.forEach((uid: string) => {
                        sessions[timeKey].participants.add(uid);

                        if (!finalUserCounts[uid]) finalUserCounts[uid] = { plays: 0, likes: 0 };
                        finalUserCounts[uid].likes += likesForThisReport;
                    });
                }
            });

            // Aggregate Play Counts from Sessions
            Object.values(sessions).forEach(session => {
                session.participants.forEach(uid => {
                    if (!finalUserCounts[uid]) finalUserCounts[uid] = { plays: 0, likes: 0 };
                    finalUserCounts[uid].plays++;
                });
            });

            console.log('Calculated Stats:', finalUserCounts);

            // 3. Update profiles
            let successCount = 0;
            let failCount = 0;

            for (const [uid, stats] of Object.entries(finalUserCounts)) {
                const { error: updateError } = await supabaseAdmin
                    .from('profiles')
                    .update({
                        total_plays: stats.plays,
                        total_likes_received: stats.likes
                    })
                    .eq('id', uid);

                if (updateError) {
                    console.error(`Failed to update ${uid}:`, updateError);
                    failCount++;
                } else {
                    successCount++;
                }
            }

            socket.emit('admin_action_success', `Recalculation Complete. Users Updated: ${successCount}, Failed: ${failCount}`);

        } catch (e: any) {
            console.error('Recalculate stats failed:', e);
            socket.emit('admin_error', 'Action failed: ' + e.message);
        }
    });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
