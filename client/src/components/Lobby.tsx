import React, { useState } from 'react';
import { Socket } from 'socket.io-client';
import { GameState } from '../types';

interface LobbyProps {
    socket: Socket;
    gameState: GameState;
}

import { createClient } from '../utils/supabase/client';

export default function Lobby({ socket, gameState }: LobbyProps) {
    const [name, setName] = useState('');
    const [isJoined, setIsJoined] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);

    const [error, setError] = useState('');
    const supabase = createClient();

    React.useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserId(user.id);
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('display_name')
                    .eq('id', user.id)
                    .single();

                if (profile?.display_name) {
                    setName(profile.display_name);
                }
            }
            setIsLoading(false);
        };
        fetchProfile();

        const onJoinError = (msg: string) => {
            setError(msg);
            setIsJoined(false);
        };
        socket.on('join_error', onJoinError);
        return () => {
            socket.off('join_error', onJoinError);
        };
    }, [socket]);

    const handleJoin = async () => {
        if (name.trim() && userId) {
            setError(''); // Clear previous errors

            // Update profile in Supabase
            await supabase.from('profiles').upsert({
                id: userId,
                display_name: name,
                updated_at: new Date().toISOString(),
            });

            socket.emit('join_game', { name, userId });
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
                            {error && (
                                <div className="text-scp-red border border-scp-red p-3 bg-scp-red/10 text-sm uppercase tracking-widest animate-pulse mb-2">
                                    ! {error}
                                </div>
                            )}
                            <label className="text-scp-green text-sm uppercase tracking-wider">Identify Personnel</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="ENTER CODENAME..."
                                className="p-4 bg-black border border-scp-green text-scp-green placeholder-scp-green-dim focus:outline-none focus:ring-1 focus:ring-scp-green w-full min-w-0 box-border uppercase"
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

                        <div className="flex flex-col gap-4">
                            {isHost ? (
                                <button
                                    onClick={handleStart}
                                    disabled={gameState.users.length < 3 || gameState.users.length > 4}
                                    className="w-full bg-scp-red text-black font-bold py-4 px-6 uppercase tracking-widest hover:bg-red-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_10px_rgba(255,0,0,0.3)]"
                                >
                                    Execute Protocol (Start)
                                </button>
                            ) : (
                                <div className="border border-scp-green/30 p-4 bg-scp-green/5">
                                    <p className="text-scp-green animate-pulse uppercase tracking-widest">
                                        {gameState.users.length < 3
                                            ? `Waiting for ${3 - gameState.users.length} more personnel (Min 3 required)...`
                                            : "Waiting for Admin Authorization..."}
                                    </p>
                                </div>
                            )}
                            <button
                                onClick={() => {
                                    if (confirm('Are you sure you want to abort the protocol?')) {
                                        socket.emit('leave_game');
                                        // localStorage.removeItem('scp_user_id'); // No longer needed
                                        window.location.reload();
                                    }
                                }}
                                className="w-full border border-scp-green text-scp-green font-bold py-3 px-6 uppercase tracking-widest hover:bg-scp-green hover:text-black transition-colors duration-200"
                            >
                                Abort Protocol (Leave)
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <div className="mt-4 text-xs text-scp-green-dim uppercase tracking-widest">
                Secure. Contain. Protect.
            </div>
        </div>
    );
}
