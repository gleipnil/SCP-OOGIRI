import { GameManager } from './gameManager';
import { Server } from 'socket.io';

export interface SessionInfo {
    id: string;
    hostName: string;
    playerCount: number;
    phase: string;
    users: string[]; // List of user names
}

export class SessionManager {
    private sessions: Map<string, GameManager> = new Map();
    private io: Server;
    private socketSessionMap: Map<string, string> = new Map(); // socketId -> sessionId

    constructor(io: Server) {
        this.io = io;
    }

    public createSession(hostId: string, hostName: string, hostUserId: string): string {
        if (this.sessions.size >= 4) {
            throw new Error('Maximum number of active sessions reached (4).');
        }

        const sessionId = `session-${crypto.randomUUID().substring(0, 8)}`;
        const newGame = new GameManager(this.io, sessionId);

        // Add host immediately
        newGame.addUser(hostId, hostName, hostUserId);

        this.sessions.set(sessionId, newGame);
        this.socketSessionMap.set(hostId, sessionId);

        return sessionId;
    }

    public getSession(sessionId: string): GameManager | undefined {
        return this.sessions.get(sessionId);
    }

    public getSessionBySocket(socketId: string): GameManager | undefined {
        const sessionId = this.socketSessionMap.get(socketId);
        if (sessionId) {
            return this.sessions.get(sessionId);
        }
        return undefined;
    }

    public joinSession(sessionId: string, socketId: string, name: string, userId: string) {
        const session = this.sessions.get(sessionId);
        if (!session) {
            throw new Error('Session not found.');
        }

        session.addUser(socketId, name, userId);
        this.socketSessionMap.set(socketId, sessionId);
    }

    public removeUser(socketId: string) {
        const sessionId = this.socketSessionMap.get(socketId);
        if (sessionId) {
            const session = this.sessions.get(sessionId);
            if (session) {
                session.removeUser(socketId); // This marks as disconnected
                // If we want to fully remove from session on "leave", we use leaveGame
            }
            // We don't remove from map immediately on disconnect to allow reconnect?
            // But for "leave_game" explicit action, we do.
        }
    }

    public leaveSession(socketId: string) {
        const sessionId = this.socketSessionMap.get(socketId);
        if (sessionId) {
            const session = this.sessions.get(sessionId);
            if (session) {
                session.leaveGame(socketId);
                if (session.isEmpty()) {
                    this.sessions.delete(sessionId);
                }
            }
            this.socketSessionMap.delete(socketId);
        }
    }

    public getAllSessions(): SessionInfo[] {
        const infos: SessionInfo[] = [];
        this.sessions.forEach((game, id) => {
            const state = game.getState();
            // Find host name
            const host = state.users.find(u => u.isHost);
            infos.push({
                id,
                hostName: host ? host.name : 'Unknown',
                playerCount: state.users.length,
                phase: state.phase,
                users: state.users.map(u => u.name)
            });
        });
        return infos;
    }

    public findSessionByUserId(userId: string): string | undefined {
        for (const [sessionId, game] of this.sessions.entries()) {
            const state = game.getState();
            if (state.users.some(u => u.userId === userId)) {
                return sessionId;
            }
        }
        return undefined;
    }
}
