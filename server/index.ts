import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { GameManager } from './src/gameManager';
import { SessionManager } from './src/sessionManager';

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
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
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
