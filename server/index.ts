import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { GameManager } from './src/gameManager';

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

const gameManager = new GameManager(io);

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Send current state to new user
    socket.emit('game_state_update', gameManager.getState());

    socket.on('join_game', (name: string) => {
        gameManager.addUser(socket.id, name);
    });

    socket.on('start_game', () => {
        gameManager.startGame();
    });

    socket.on('submit_suggestion', (keywords: string[]) => {
        gameManager.submitSuggestion(socket.id, keywords);
    });

    socket.on('submit_choice', (selectedKeywords: string[]) => {
        gameManager.submitChoice(socket.id, selectedKeywords);
    });

    socket.on('submit_script', (content: string) => {
        gameManager.submitScript(socket.id, content);
    });

    socket.on('next_phase', () => {
        gameManager.nextPhase();
    });

    socket.on('submit_vote', (data: { bestReportId: string, constraintChecks: { [reportId: string]: boolean } }) => {
        gameManager.submitVote(socket.id, data.bestReportId, data.constraintChecks);
    });

    socket.on('restart_game', () => {
        // gameManager.resetGame(); // Exposed via removeUser or we can add explicit method
        // For now, let's just reload page or something, but we might need explicit restart
        // GameManager.resetGame is private, let's just rely on nextPhase from RESULT to LOBBY
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        gameManager.removeUser(socket.id);
    });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
