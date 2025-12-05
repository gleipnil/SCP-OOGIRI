
"use client";
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import SecurityCard from '@/components/SecurityCard';
import { calculateAchievements } from '@/utils/achievements';
import { User } from '@supabase/supabase-js';

interface Profile {
    display_name: string;
    comment: string;
    difficulty_level: 'A' | 'B' | 'C';
    total_plays: number;
    total_likes_received: number;
    apollyon_wins: number;
    joined_at: string;
}

export default function ProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    // Editing States
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState('');
    const [editComment, setEditComment] = useState('');
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    // Security Settings
    const [newPassword, setNewPassword] = useState('');
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Difficulty
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
            setEditName(profile?.display_name || '');
            setEditComment(profile?.comment || '[[DATA EXPUNGED]]');
            setDifficulty(profile?.difficulty_level || 'C');
            setLoading(false);
        };
        fetchData();
    }, [router, supabase]);

    const handleUpdateProfile = async () => {
        if (!editName.trim() || !user || !profile) return;

        const { error } = await supabase
            .from('profiles')
            .update({
                display_name: editName,
                comment: editComment,
                updated_at: new Date().toISOString()
            })
            .eq('id', user.id);

        if (error) {
            setMessage({ text: 'Failed to update profile.', type: 'error' });
        } else {
            setProfile({ ...profile, display_name: editName, comment: editComment });
            setIsEditing(false);
            setMessage({ text: 'Personnel file updated successfully.', type: 'success' });
        }
    };

    const handleUpdateDifficulty = async (newLevel: 'A' | 'B' | 'C') => {
        if (!user) return;
        const { error } = await supabase
            .from('profiles')
            .update({ difficulty_level: newLevel, updated_at: new Date().toISOString() })
            .eq('id', user.id);

        if (error) {
            setMessage({ text: 'Failed to update clearance level.', type: 'error' });
        } else {
            if (profile) {
                setProfile({ ...profile, difficulty_level: newLevel });
            }
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
        const { error } = await supabase.auth.updateUser({ data: { deleted: true } });
        if (error) {
            setMessage({ text: 'Failed to delete account.', type: 'error' });
            setShowDeleteModal(false);
        } else {
            await supabase.auth.signOut();
            router.push('/login');
        }
    };

    // Calculate Achievements
    const achievements = useMemo(() => calculateAchievements({
        total_plays: profile?.total_plays || 0,
        total_likes_received: profile?.total_likes_received || 0,
        apollyon_wins: profile?.apollyon_wins || 0,
        joined_at: profile?.joined_at || new Date().toISOString()
    }), [profile]);

    // Prepare User Data for Card
    const cardUser = useMemo(() => ({
        name: isEditing ? editName : (profile?.display_name || 'Unknown'),
        id: user?.id || 'Unknown',
        joinedAt: new Date(profile?.joined_at || Date.now()).toLocaleDateString(),
        comment: isEditing ? editComment : (profile?.comment || '[[DATA EXPUNGED]]'),
        avatarUrl: "/avatar_placeholder.png"
    }), [isEditing, editName, profile, editComment, user]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-scp-green font-mono flex items-center justify-center">
                <div className="animate-pulse uppercase tracking-widest">Loading Personnel File...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-scp-green font-mono p-4 md:p-8 flex flex-col items-center">

            <h1 className="text-3xl font-bold mb-8 text-center uppercase tracking-widest border-b border-scp-green pb-4 w-full max-w-4xl">
                Personnel File Management
            </h1>

            {message && (
                <div className={`mb-6 p-3 border ${message.type === 'success' ? 'border-scp-green bg-scp-green/10 text-scp-green' : 'border-scp-red bg-scp-red/10 text-scp-red'} text-center uppercase tracking-widest text-sm w-full max-w-md`}>
                    {message.text}
                </div>
            )}

            {/* Security Card Display */}
            <div className="mb-12 w-full flex justify-center">
                <SecurityCard
                    user={cardUser}
                    achievements={achievements}
                    difficulty={profile?.difficulty_level || 'C'}
                />
            </div>

            {/* Edit Controls */}
            <div className="w-full max-w-3xl space-y-12">

                {/* Personal Information Edit */}
                <section className="border-t border-scp-green/30 pt-8">
                    <h2 className="text-lg font-bold mb-4 uppercase text-scp-green-dim border-l-4 border-scp-green pl-3">
                        Personal Information
                    </h2>

                    {isEditing ? (
                        <div className="bg-scp-green/5 p-6 border border-scp-green/30 space-y-4">
                            <div>
                                <label className="block text-xs text-scp-green-dim uppercase tracking-wider mb-1">Codename</label>
                                <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="w-full bg-black border border-scp-green text-scp-green px-3 py-2 focus:outline-none uppercase"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-scp-green-dim uppercase tracking-wider mb-1">Comment</label>
                                <textarea
                                    value={editComment}
                                    onChange={(e) => setEditComment(e.target.value)}
                                    maxLength={50}
                                    className="w-full bg-black border border-scp-green text-scp-green px-3 py-2 focus:outline-none font-typewriter h-24 resize-none"
                                    placeholder="Enter a brief comment (Max 50 chars)"
                                />
                                <div className="text-right text-xs text-scp-green-dim">{editComment.length}/50</div>
                            </div>
                            <div className="flex gap-4 pt-2">
                                <button onClick={handleUpdateProfile} className="bg-scp-green text-black font-bold px-4 py-2 hover:bg-green-400 transition-colors uppercase text-sm">
                                    Save Changes
                                </button>
                                <button onClick={() => { setIsEditing(false); setEditName(profile?.display_name || ''); setEditComment(profile?.comment || ''); }} className="text-scp-red hover:underline uppercase text-sm self-center">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="border border-scp-green text-scp-green px-6 py-3 hover:bg-scp-green hover:text-black transition-colors uppercase tracking-widest text-sm"
                        >
                            Edit Personnel Info
                        </button>
                    )}
                </section>

                {/* Assignment Protocol (Difficulty) */}
                <section className="border-t border-scp-green/30 pt-8">
                    <h2 className="text-lg font-bold mb-4 uppercase text-scp-green-dim border-l-4 border-scp-green pl-3">Assignment Protocol</h2>
                    <div className="flex flex-col gap-4">
                        <label className="block text-xs text-scp-green-dim uppercase tracking-wider">Clearance Level (Difficulty)</label>

                        {isEditingDifficulty ? (
                            <div className="space-y-2 bg-scp-green/5 p-4 border border-scp-green/30">
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
                                <span className="text-lg font-bold text-scp-green border border-scp-green/50 px-4 py-2">
                                    {difficulty === 'C' && 'Security Clearance 1 (Easy)'}
                                    {difficulty === 'B' && 'Security Clearance 3 (Normal)'}
                                    {difficulty === 'A' && 'Security Clearance 5 (Hard)'}
                                </span>
                                <button
                                    onClick={() => setIsEditingDifficulty(true)}
                                    className="text-sm text-scp-green-dim hover:text-scp-green underline uppercase"
                                >
                                    [Change Clearance]
                                </button>
                            </div>
                        )}
                    </div>
                </section>

                {/* Security Settings */}
                <section className="border-t border-scp-green/30 pt-8">
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
                <section className="border border-scp-red/30 p-6 bg-scp-red/5 mt-8">
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

            <div className="mt-12 text-center pb-8">
                <Link href="/" className="inline-block text-scp-green-dim hover:text-scp-green hover:underline uppercase tracking-widest text-sm">
                    &lt; Return to Terminal
                </Link>
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
