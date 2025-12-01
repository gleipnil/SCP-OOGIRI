"use client";
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [gameCount, setGameCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [difficulty, setDifficulty] = useState<'A' | 'B' | 'C'>('C');
    const [isEditingDifficulty, setIsEditingDifficulty] = useState(false);

    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const fetchData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
                return;
            }
            setUser(user);

            // Fetch profile
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();
            setProfile(profile);
            setNewName(profile?.display_name || '');
            setDifficulty(profile?.difficulty_level || 'C');

            // Fetch game count logic:
            // Fetch all reports where user is an author, then count unique created_at timestamps (grouped by minute)
            const { data: reports } = await supabase
                .from('reports')
                .select('created_at')
                .contains('author_ids', [user.id]);

            if (reports) {
                const uniqueGames = new Set(reports.map(r => {
                    const date = new Date(r.created_at);
                    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
                }));
                setGameCount(uniqueGames.size);
            }

            setLoading(false);
        };
        fetchData();
    }, [router, supabase]);

    const handleUpdateName = async () => {
        if (!newName.trim()) return;

        const { error } = await supabase
            .from('profiles')
            .update({ display_name: newName, updated_at: new Date().toISOString() })
            .eq('id', user.id);

        if (error) {
            setMessage({ text: 'Failed to update name.', type: 'error' });
        } else {
            setProfile({ ...profile, display_name: newName });
            setIsEditingName(false);
            setMessage({ text: 'Codename updated successfully.', type: 'success' });
        }
    };

    const handleUpdateDifficulty = async (newLevel: 'A' | 'B' | 'C') => {
        const { error } = await supabase
            .from('profiles')
            .update({ difficulty_level: newLevel, updated_at: new Date().toISOString() })
            .eq('id', user.id);

        if (error) {
            setMessage({ text: 'Failed to update clearance level.', type: 'error' });
        } else {
            setDifficulty(newLevel);
            setIsEditingDifficulty(false);
            setMessage({ text: 'Clearance level updated successfully.', type: 'success' });
        }
    };

    const handleUpdatePassword = async () => {
        if (!newPassword.trim()) return;

        const { error } = await supabase.auth.updateUser({ password: newPassword });

        if (error) {
            setMessage({ text: error.message, type: 'error' });
        } else {
            setNewPassword('');
            setIsChangingPassword(false);
            setMessage({ text: 'Password updated successfully.', type: 'success' });
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    const handleDeleteAccount = async () => {
        // Logical deletion using user_metadata
        const { error } = await supabase.auth.updateUser({
            data: { deleted: true }
        });

        if (error) {
            setMessage({ text: 'Failed to delete account.', type: 'error' });
            setShowDeleteModal(false);
        } else {
            await supabase.auth.signOut();
            router.push('/login');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-scp-green font-mono flex items-center justify-center">
                <div className="animate-pulse uppercase tracking-widest">Loading Personnel File...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-scp-green font-mono p-4 md:p-8 flex flex-col items-center">
            <div className="max-w-3xl w-full border-2 border-scp-green bg-black/90 p-8 relative shadow-[0_0_20px_rgba(0,255,65,0.2)]">
                {/* Decorative corners */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-scp-green -mt-1 -ml-1"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-scp-green -mt-1 -mr-1"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-scp-green -mb-1 -ml-1"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-scp-green -mb-1 -mr-1"></div>

                <h1 className="text-3xl font-bold mb-8 text-center uppercase tracking-widest border-b border-scp-green pb-4">
                    Personnel File
                </h1>

                {message && (
                    <div className={`mb-6 p-3 border ${message.type === 'success' ? 'border-scp-green bg-scp-green/10 text-scp-green' : 'border-scp-red bg-scp-red/10 text-scp-red'} text-center uppercase tracking-widest text-sm`}>
                        {message.text}
                    </div>
                )}

                <div className="flex flex-col md:flex-row gap-8 mb-12 items-start">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                        <div className="w-20 h-20 border border-scp-green/50 bg-scp-green/5 flex items-center justify-center rounded-full overflow-hidden relative">
                            {/* Use generated placeholder image */}
                            <Image
                                src="/avatar_placeholder.png"
                                alt="Personnel Avatar"
                                width={80}
                                height={80}
                                className="object-cover opacity-80"
                            />
                            <div className="absolute inset-0 bg-scp-green/10 mix-blend-overlay"></div>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex-grow space-y-6">
                        <div>
                            <label className="block text-xs text-scp-green-dim uppercase tracking-wider mb-1">Codename</label>
                            <div className="flex items-center gap-4">
                                {isEditingName ? (
                                    <>
                                        <input
                                            type="text"
                                            value={newName}
                                            onChange={(e) => setNewName(e.target.value)}
                                            className="bg-black border border-scp-green text-scp-green px-3 py-1 focus:outline-none uppercase"
                                        />
                                        <button onClick={handleUpdateName} className="text-xs border border-scp-green px-2 py-1 hover:bg-scp-green hover:text-black transition-colors uppercase">
                                            Update
                                        </button>
                                        <button onClick={() => setIsEditingName(false)} className="text-xs text-scp-red hover:underline uppercase">
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-xl font-bold uppercase">{profile?.display_name}</span>
                                        <button onClick={() => setIsEditingName(true)} className="text-xs text-scp-green-dim hover:text-scp-green underline uppercase">
                                            [Edit]
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs text-scp-green-dim uppercase tracking-wider mb-1">Clearance Level / ID</label>
                            <div className="text-sm font-mono text-scp-green-dim">{user?.id}</div>
                        </div>

                        <div>
                            <label className="block text-xs text-scp-green-dim uppercase tracking-wider mb-1">Operations Participated</label>
                            <div className="text-xl font-bold">{gameCount}</div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-scp-green/30 pt-8 space-y-8">
                    {/* Assignment Protocol (Difficulty) */}
                    <section>
                        <h2 className="text-lg font-bold mb-4 uppercase text-scp-green-dim border-l-4 border-scp-green pl-3">Assignment Protocol</h2>
                        <div className="flex flex-col gap-4">
                            <label className="block text-xs text-scp-green-dim uppercase tracking-wider">Clearance Level (Difficulty)</label>

                            {isEditingDifficulty ? (
                                <div className="space-y-2">
                                    {[
                                        { level: 'C', label: 'Security Clearance 1 (Easy) - 初心者向け' },
                                        { level: 'B', label: 'Security Clearance 3 (Normal) - 慣れてきた人向け' },
                                        { level: 'A', label: 'Security Clearance 5 (Hard) - 全ての縛りが出現' }
                                    ].map((option) => (
                                        <label key={option.level} className="flex items-center space-x-3 cursor-pointer p-2 border border-scp-green/30 hover:bg-scp-green/10 transition-colors">
                                            <input
                                                type="radio"
                                                name="difficulty"
                                                value={option.level}
                                                checked={difficulty === option.level}
                                                onChange={() => handleUpdateDifficulty(option.level as 'A' | 'B' | 'C')}
                                                className="form-radio text-scp-green bg-black border-scp-green focus:ring-scp-green accent-scp-green"
                                            />
                                            <span className="text-sm text-scp-green">{option.label}</span>
                                        </label>
                                    ))}
                                    <button
                                        onClick={() => setIsEditingDifficulty(false)}
                                        className="text-xs text-scp-red hover:underline uppercase mt-2 pl-2"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-bold text-scp-green">
                                        {difficulty === 'C' && 'Security Clearance 1 (Easy)'}
                                        {difficulty === 'B' && 'Security Clearance 3 (Normal)'}
                                        {difficulty === 'A' && 'Security Clearance 5 (Hard)'}
                                    </span>
                                    <button
                                        onClick={() => setIsEditingDifficulty(true)}
                                        className="text-xs text-scp-green-dim hover:text-scp-green underline uppercase"
                                    >
                                        [Edit]
                                    </button>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Security Settings */}
                    <section>
                        <h2 className="text-lg font-bold mb-4 uppercase text-scp-green-dim border-l-4 border-scp-green pl-3">Security Settings</h2>
                        <div className="flex flex-col gap-4 max-w-md">
                            <label className="block text-xs text-scp-green-dim uppercase tracking-wider">Password Management</label>

                            {isChangingPassword ? (
                                <div className="flex gap-2">
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="New Password"
                                        className="flex-grow bg-black border border-scp-green/50 text-scp-green px-3 py-2 focus:outline-none focus:border-scp-green placeholder-scp-green-dim/50"
                                    />
                                    <button
                                        onClick={handleUpdatePassword}
                                        disabled={!newPassword}
                                        className="border border-scp-green text-scp-green px-4 py-2 hover:bg-scp-green hover:text-black transition-colors uppercase text-sm disabled:opacity-50"
                                    >
                                        Update
                                    </button>
                                    <button
                                        onClick={() => { setIsChangingPassword(false); setNewPassword(''); }}
                                        className="text-scp-red hover:underline uppercase text-xs self-center"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setIsChangingPassword(true)}
                                    className="w-fit border border-scp-green/50 text-scp-green-dim px-4 py-2 hover:bg-scp-green/10 hover:text-scp-green transition-colors uppercase text-sm"
                                >
                                    Change Password
                                </button>
                            )}
                        </div>
                    </section>

                    {/* Restricted Actions */}
                    <section className="border border-scp-red/30 p-4 bg-scp-red/5">
                        <h2 className="text-lg font-bold mb-4 uppercase text-scp-red border-l-4 border-scp-red pl-3">Restricted Protocols</h2>
                        <div className="flex gap-4">
                            <button
                                onClick={handleLogout}
                                className="border border-scp-red text-scp-red px-6 py-2 hover:bg-scp-red hover:text-black transition-colors uppercase tracking-widest text-sm"
                            >
                                Sign Out
                            </button>
                            <button
                                onClick={() => setShowDeleteModal(true)}
                                className="bg-scp-red/20 border border-scp-red text-scp-red px-6 py-2 hover:bg-scp-red hover:text-black transition-colors uppercase tracking-widest text-sm"
                            >
                                Delete Account
                            </button>
                        </div>
                    </section>
                </div>

                <div className="mt-12 text-center">
                    <Link href="/" className="inline-block text-scp-green-dim hover:text-scp-green hover:underline uppercase tracking-widest text-sm">
                        &lt; Return to Terminal
                    </Link>
                </div>
            </div>

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
                    <div className="max-w-md w-full border-2 border-scp-red bg-black p-8 shadow-[0_0_30px_rgba(255,0,0,0.3)] text-center">
                        <h3 className="text-2xl font-bold text-scp-red mb-4 uppercase tracking-widest">Warning: Irreversible Action</h3>
                        <p className="text-scp-red/80 mb-8">
                            You are about to terminate your personnel file. This action is logically irreversible and will revoke all access privileges.
                            <br /><br />
                            Are you sure you want to proceed?
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="border border-scp-green text-scp-green px-6 py-2 hover:bg-scp-green hover:text-black transition-colors uppercase tracking-widest"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                className="bg-scp-red text-black font-bold px-6 py-2 hover:bg-red-600 transition-colors uppercase tracking-widest"
                            >
                                Confirm Deletion
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
