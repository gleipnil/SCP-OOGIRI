import React, { useState } from 'react';
import { Socket } from 'socket.io-client';
import { GameState } from '../types';

interface LobbyProps {
    socket: Socket;
    gameState: GameState;
}

export default function Lobby({ socket, gameState }: LobbyProps) {
    const [name, setName] = useState('');
    const [isJoined, setIsJoined] = useState(false);

    const handleJoin = () => {
        if (name.trim()) {
            socket.emit('join_game', name);
            setIsJoined(true);
        }
    };

    const handleStart = () => {
        socket.emit('start_game');
    };

    const myUser = gameState.users.find(u => u.id === socket.id);
    const isHost = myUser?.isHost;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 font-mono">
            <div className="w-full max-w-2xl border-2 border-scp-green bg-black/80 p-8 relative shadow-[0_0_20px_rgba(0,255,65,0.2)]">
                {/* Decorative corner markers */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-scp-green -mt-1 -ml-1"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-scp-green -mt-1 -mr-1"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-scp-green -mb-1 -ml-1"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-scp-green -mb-1 -mr-1"></div>

                <h1 className="text-4xl font-bold mb-8 text-center text-scp-green tracking-widest uppercase border-b border-scp-green pb-4">
                    SCP Database Access
                </h1>

                {!isJoined ? (
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-scp-green text-sm uppercase tracking-wider">Identify Personnel</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="ENTER CODENAME..."
                                className="p-4 bg-black border border-scp-green text-scp-green placeholder-scp-green-dim focus:outline-none focus:ring-1 focus:ring-scp-green w-full uppercase"
                                onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
                            />
                        </div>
                        <button
                            onClick={handleJoin}
                            disabled={!name.trim()}
                            className="bg-scp-green text-black font-bold py-4 px-6 uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-transparent hover:border-scp-green"
                        >
                            Initialize Connection
                        </button>
                        <div className="text-center mt-6">
                            <a
                                href="/instructions"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group inline-flex items-center gap-2 px-4 py-2 border border-scp-green/30 text-scp-green-dim text-xs uppercase tracking-widest hover:bg-scp-green/10 hover:text-scp-green hover:border-scp-green transition-all duration-300"
                            >
                                <span className="group-hover:animate-pulse">▶</span>
                                Access Operational Manual
                            </a>
                        </div>
                    </div>
                ) : (
                    <div className="text-center">
                        <div className="mb-8 text-left">
                            <h2 className="text-xl font-bold mb-4 text-scp-green border-b border-scp-green/50 pb-2 uppercase">
                                Active Personnel
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {gameState.users.map((user) => (
                                    <div key={user.id} className="border border-scp-green/50 p-3 flex items-center justify-between bg-scp-green/5">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 ${user.isHost ? 'bg-yellow-500' : 'bg-scp-green'} animate-pulse`}></div>
                                            <span className="text-scp-green uppercase">{user.name}</span>
                                        </div>
                                        {user.isHost && <span className="text-xs text-yellow-500 border border-yellow-500 px-2 py-0.5">ADMIN</span>}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {isHost ? (
                            <button
                                onClick={handleStart}
                                disabled={gameState.users.length < 2}
                                className="w-full bg-scp-red text-black font-bold py-4 px-6 uppercase tracking-widest hover:bg-red-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Execute Protocol
                            </button>
                        ) : (
                            <div className="border border-scp-green/30 p-4 bg-scp-green/5">
                                <p className="text-scp-green animate-pulse uppercase tracking-widest">
                                    Waiting for Admin Authorization...
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <div className="mt-4 text-xs text-scp-green-dim uppercase tracking-widest">
                Secure. Contain. Protect.
            </div>
        </div>
    );
}
