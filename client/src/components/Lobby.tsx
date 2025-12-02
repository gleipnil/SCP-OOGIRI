import React, { useState } from 'react';
import { Socket } from 'socket.io-client';
import { GameState } from '../types';
import { createClient } from '@/utils/supabase/client';
import SecurityCard from './SecurityCard';
import { calculateAchievements } from '@/utils/achievements';

interface LobbyProps {
    socket: Socket;
    gameState: GameState;
}

export default function Lobby({ socket, gameState }: LobbyProps) {
    const [error, setError] = useState('');
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState(false);

    const supabase = createClient();

    React.useEffect(() => {
        const onJoinError = (msg: string) => {
            setError(msg);
        };
        socket.on('join_error', onJoinError);
        return () => {
            socket.off('join_error', onJoinError);
        };
    }, [socket]);

    const handleStart = () => {
        socket.emit('start_game');
    };

    const handleUserClick = async (userId: string) => {
        setIsLoadingProfile(true);
        setSelectedUser(null);

        try {
            // Fetch profile from Supabase
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) throw error;

            // Calculate achievements
            const achievements = calculateAchievements({
                total_plays: profile.total_plays || 0,
                total_likes_received: profile.total_likes_received || 0,
                apollyon_wins: profile.apollyon_wins || 0,
                joined_at: profile.joined_at || new Date().toISOString()
            });

            setSelectedUser({
                user: {
                    name: profile.display_name || 'Unknown',
                    id: userId,
                    joinedAt: new Date(profile.joined_at || Date.now()).toLocaleDateString(),
                    comment: profile.comment || '[[DATA EXPUNGED]]',
                    avatarUrl: "/avatar_placeholder.png"
                },
                achievements
            });

        } catch (err) {
            console.error('Error fetching profile:', err);
            // Maybe show a toast or simplified error
        } finally {
            setIsLoadingProfile(false);
        }
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

                <div className="text-center">
                    <div className="mb-8 text-left">
                        <h2 className="text-xl font-bold mb-4 text-scp-green border-b border-scp-green/50 pb-2 uppercase">
                            Active Personnel
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {gameState.users.map((user) => (
                                <div
                                    key={user.id}
                                    onClick={() => handleUserClick(user.userId)}
                                    className="border border-scp-green/50 p-3 flex items-center justify-between bg-scp-green/5 cursor-pointer hover:bg-scp-green/20 transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 ${user.isHost ? 'bg-yellow-500' : 'bg-scp-green'} animate-pulse`}></div>
                                        <span className="text-scp-green uppercase group-hover:underline">{user.name}</span>
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
                                    window.location.reload();
                                }
                            }}
                            className="w-full border border-scp-green text-scp-green font-bold py-3 px-6 uppercase tracking-widest hover:bg-scp-green hover:text-black transition-colors duration-200"
                        >
                            Abort Protocol (Leave)
                        </button>
                    </div>
                </div>
            </div>
            <div className="mt-4 text-xs text-scp-green-dim uppercase tracking-widest">
                Secure. Contain. Protect.
            </div>

            {/* Profile Modal */}
            {(selectedUser || isLoadingProfile) && (
                <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4" onClick={() => !isLoadingProfile && setSelectedUser(null)}>
                    <div className="relative" onClick={e => e.stopPropagation()}>
                        {isLoadingProfile ? (
                            <div className="text-scp-green animate-pulse uppercase tracking-widest border border-scp-green p-8 bg-black">
                                Accessing Personnel File...
                            </div>
                        ) : (
                            <div className="transform scale-90 md:scale-100 transition-transform">
                                <SecurityCard user={selectedUser.user} achievements={selectedUser.achievements} />
                                <div className="mt-4 text-center">
                                    <button
                                        onClick={() => setSelectedUser(null)}
                                        className="text-scp-green hover:underline uppercase tracking-widest text-sm"
                                    >
                                        [Close File]
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
