import React, { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';

interface SessionInfo {
    id: string;
    hostName: string;
    playerCount: number;
    phase: string;
    users: string[];
}

interface EntranceProps {
    socket: Socket;
    userName: string;
    userId: string;
    difficultyLevel?: 'A' | 'B' | 'C';
}

export default function Entrance({ socket, userName, userId, difficultyLevel = 'C' }: EntranceProps) {
    const [sessions, setSessions] = useState<SessionInfo[]>([]);
    const [error, setError] = useState('');
    const [isCheckingSession, setIsCheckingSession] = useState(true);
    const [rejoiningSessionId, setRejoiningSessionId] = useState<string | null>(null);

    useEffect(() => {
        // Check for active session first
        socket.emit('check_active_session', userId);

        // Request initial session list
        socket.emit('get_sessions');

        const onSessionListUpdate = (list: SessionInfo[]) => {
            setSessions(list);
        };

        const onJoinError = (msg: string) => {
            setError(msg);
            setIsCheckingSession(false); // Stop checking on error
            setRejoiningSessionId(null);
        };

        const onActiveSessionFound = (sessionId: string) => {
            setRejoiningSessionId(sessionId);
            // Auto-rejoin
            socket.emit('join_session', { sessionId, name: userName, userId });
        };

        const onNoActiveSession = () => {
            setIsCheckingSession(false);
        };

        socket.on('session_list_update', onSessionListUpdate);
        socket.on('join_error', onJoinError);
        socket.on('active_session_found', onActiveSessionFound);
        socket.on('no_active_session', onNoActiveSession);

        return () => {
            socket.off('session_list_update', onSessionListUpdate);
            socket.off('join_error', onJoinError);
            socket.off('active_session_found', onActiveSessionFound);
            socket.off('no_active_session', onNoActiveSession);
        };
    }, [socket, userId, userName]);

    const handleCreateSession = () => {
        if (isCheckingSession || rejoiningSessionId) return;
        socket.emit('create_session', { hostName: userName, hostUserId: userId });
    };

    const handleJoinSession = (sessionId: string) => {
        if (isCheckingSession || rejoiningSessionId) return;
        socket.emit('join_session', { sessionId, name: userName, userId });
    };

    if (isCheckingSession || rejoiningSessionId) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 font-mono bg-black text-scp-green">
                <div className="animate-pulse text-center">
                    <h2 className="text-2xl font-bold mb-4 uppercase tracking-widest">
                        {rejoiningSessionId ? 'Restoring Secure Connection...' : 'Verifying Personnel Status...'}
                    </h2>
                    <p className="text-sm text-scp-green-dim uppercase">
                        Please wait while we retrieve your assignment.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 font-mono">
            <div className="w-full max-w-4xl border-2 border-scp-green bg-black/80 p-8 relative shadow-[0_0_20px_rgba(0,255,65,0.2)]">
                <h1 className="text-4xl font-bold mb-8 text-center text-scp-green tracking-widest uppercase border-b border-scp-green pb-4">
                    Secure Access Terminal
                </h1>

                <div className="mb-6 text-center">
                    <p className="text-scp-green-dim uppercase tracking-wider text-sm flex items-center justify-center gap-4">
                        <span>
                            {difficultyLevel === 'C' && 'Class D Personnel'}
                            {difficultyLevel === 'B' && 'Field Agent'}
                            {difficultyLevel === 'A' && 'O5 Council'}
                            : <span className="text-scp-green font-bold">{userName}</span>
                        </span>
                        <a href="/profile" className="text-[10px] border border-scp-green/30 px-1 hover:bg-scp-green hover:text-black transition-colors" title="Manage Profile">
                            [EDIT]
                        </a>
                    </p>
                </div>

                {error && (
                    <div className="mb-6 text-scp-red border border-scp-red p-3 bg-scp-red/10 text-sm uppercase tracking-widest animate-pulse text-center">
                        ! {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Active Sessions List */}
                    <div className="border border-scp-green/30 p-4 bg-scp-green/5">
                        <h2 className="text-xl font-bold mb-4 text-scp-green border-b border-scp-green/30 pb-2 uppercase">
                            Active Protocols
                        </h2>

                        {sessions.length === 0 ? (
                            <div className="text-scp-green-dim text-sm text-center py-8 uppercase tracking-widest">
                                No active protocols detected.
                            </div>
                        ) : (
                            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {sessions.map((session) => (
                                    <div key={session.id} className="border border-scp-green/50 p-4 bg-black/50 hover:bg-scp-green/10 transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <div className="text-scp-green font-bold uppercase tracking-wider text-sm">
                                                    Host: {session.hostName}
                                                </div>
                                                <div className="text-xs text-scp-green-dim mt-1">
                                                    Status: {session.phase}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-scp-green font-bold">
                                                    {session.playerCount}/4
                                                </div>
                                                <div className="text-xs text-scp-green-dim">
                                                    Personnel
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-xs text-scp-green-dim mb-3 border-t border-scp-green/20 pt-2">
                                            Users: {session.users.join(', ')}
                                        </div>

                                        {session.phase === 'LOBBY' && session.playerCount < 4 ? (
                                            <button
                                                onClick={() => handleJoinSession(session.id)}
                                                className="w-full bg-scp-green/20 border border-scp-green text-scp-green hover:bg-scp-green hover:text-black font-bold py-2 px-4 uppercase tracking-widest text-sm transition-all duration-200"
                                            >
                                                Join Protocol
                                            </button>
                                        ) : (
                                            <div className="w-full text-center border border-gray-700 text-gray-500 py-2 px-4 uppercase tracking-widest text-sm cursor-not-allowed">
                                                {session.phase !== 'LOBBY' ? 'In Progress' : 'Full'}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col justify-center gap-6 border-l border-scp-green/30 pl-8">
                        <div className="text-center">
                            <h2 className="text-xl font-bold mb-4 text-scp-green uppercase">
                                Initiate New Protocol
                            </h2>
                            <p className="text-scp-green-dim text-xs mb-6 uppercase tracking-wider">
                                Establish a new secure channel for containment procedures.
                                <br />
                                <span className="text-yellow-500/70 mt-2 block">
                                    (Max 4 concurrent protocols allowed)
                                </span>
                            </p>

                            <button
                                onClick={handleCreateSession}
                                disabled={sessions.length >= 4}
                                className="w-full bg-scp-green text-black font-bold py-4 px-6 uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-transparent hover:border-scp-green shadow-[0_0_15px_rgba(0,255,65,0.3)]"
                            >
                                Create Session
                            </button>

                            {sessions.length >= 4 && (
                                <p className="text-red-500 text-xs mt-2 uppercase tracking-widest animate-pulse">
                                    System Capacity Reached
                                </p>
                            )}
                        </div>

                        <div className="mt-auto pt-8 border-t border-scp-green/30">
                            <div className="text-center mb-6">
                                <h2 className="text-xl font-bold mb-4 text-scp-red uppercase">
                                    D-Class Assignment
                                </h2>
                                <p className="text-scp-red-dim text-xs mb-6 uppercase tracking-wider">
                                    Single-player exploration simulation.
                                    <br />
                                    <span className="text-red-500/70 mt-2 block">
                                        (High Mortality Rate)
                                    </span>
                                </p>
                                <a
                                    href="/d-class"
                                    className="block w-full bg-scp-red/20 border border-scp-red text-scp-red font-bold py-3 px-6 uppercase tracking-widest hover:bg-scp-red hover:text-black transition-colors duration-200 shadow-[0_0_15px_rgba(255,0,0,0.2)]"
                                >
                                    Enter Testing Area
                                </a>
                            </div>
                            <div className="text-xs text-scp-green-dim text-center uppercase tracking-widest pt-4 border-t border-scp-green/30">
                                Secure. Contain. Protect.
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 text-center flex flex-col gap-2 opacity-50 hover:opacity-100 transition-opacity duration-300">
                <a href="/instructions/jp" className="text-xs text-scp-green-dim uppercase tracking-widest hover:text-scp-green border-b border-transparent hover:border-scp-green pb-0.5 inline-block">
                    :: Field Manual (JP) ::
                </a>
                <a href="/records" className="text-xs text-scp-green-dim uppercase tracking-widest hover:text-scp-green border-b border-transparent hover:border-scp-green pb-0.5 inline-block">
                    :: Access Archives ::
                </a>
                <a href="/credits" className="text-xs text-scp-green-dim uppercase tracking-widest hover:text-scp-green border-b border-transparent hover:border-scp-green pb-0.5 inline-block">
                    :: System Credits & Legal ::
                </a>
            </div>
        </div>
    );
}
