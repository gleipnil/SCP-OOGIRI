"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { socket } from '@/socket';
import Link from 'next/link';
import { User } from '@supabase/supabase-js';

interface SessionInfo {
    id: string;
    hostName: string;
    playerCount: number;
    phase: string;
    users: string[];
}

interface Report {
    id: string;
    title: string;
    created_at: string;
    owner_id: string;
    is_hidden?: boolean;
}

interface Profile {
    id: string;
    display_name: string;
    is_admin: boolean;
    is_banned: boolean;
    created_at: string;
}

export default function AdminPage() {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [activeTab, setActiveTab] = useState<'dashboard' | 'rooms' | 'reports' | 'users'>('dashboard');
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    // Data States
    const [sessions, setSessions] = useState<SessionInfo[]>([]);
    const [reports, setReports] = useState<Report[]>([]);
    const [users, setUsers] = useState<Profile[]>([]);
    const [userSearch, setUserSearch] = useState('');
    const [stats, setStats] = useState({ activeSessions: 0, totalReports: 0, totalUsers: 0 });

    useEffect(() => {
        const checkAdmin = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/');
                return;
            }

            const { data: profile } = await supabase
                .from('profiles')
                .select('is_admin')
                .eq('id', user.id)
                .single();

            if (!profile?.is_admin) {
                router.push('/');
                return;
            }

            setUser(user);
            setLoading(false);
            fetchInitialData();
        };

        checkAdmin();

        // Socket Listeners
        const onSessionListUpdate = (list: SessionInfo[]) => {
            setSessions(list);
            setStats(prev => ({ ...prev, activeSessions: list.length }));
        };

        const onAdminActionSuccess = (msg: string) => {
            setMessage({ text: msg, type: 'success' });
            fetchInitialData(); // Refresh data
        };

        const onAdminError = (msg: string) => {
            setMessage({ text: msg, type: 'error' });
        };

        socket.on('session_list_update', onSessionListUpdate);
        socket.on('admin_action_success', onAdminActionSuccess);
        socket.on('admin_error', onAdminError);

        return () => {
            socket.off('session_list_update', onSessionListUpdate);
            socket.off('admin_action_success', onAdminActionSuccess);
            socket.off('admin_error', onAdminError);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router, supabase]);

    const fetchInitialData = async () => {
        socket.emit('get_sessions');
        fetchReports();
        fetchStats();
    };

    const fetchStats = async () => {
        const { count: reportsCount } = await supabase.from('reports').select('*', { count: 'exact', head: true });
        const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
        setStats(prev => ({
            ...prev,
            totalReports: reportsCount || 0,
            totalUsers: usersCount || 0
        }));
    };

    const fetchReports = async () => {
        const { data, error } = await supabase
            .from('reports')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(50);

        if (error) console.error(error);
        if (data) setReports(data);
    };

    const searchUsers = async () => {
        if (!userSearch.trim()) return;
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .ilike('display_name', `%${userSearch}%`)
            .limit(20);

        if (error) console.error(error);
        if (data) setUsers(data);
    };

    // Actions
    const handleForceClose = (sessionId: string) => {
        if (user && confirm('WARNING: This will immediately terminate the protocol. Proceed?')) {
            socket.emit('admin_force_close_session', { sessionId, userId: user.id });
        }
    };

    const handleHideReport = async (reportId: string) => {
        if (confirm('Are you sure you want to expunge this record?')) {
            const { error } = await supabase
                .from('reports')
                .update({ is_hidden: true })
                .eq('id', reportId);

            if (error) {
                console.error(error);
                setMessage({ text: 'Failed to expunge record. Column "is_hidden" might be missing.', type: 'error' });
            } else {
                setMessage({ text: 'Record expunged.', type: 'success' });
                fetchReports();
            }
        }
    };

    const handleBanUser = async (targetId: string, currentStatus: boolean) => {
        if (confirm(`Are you sure you want to ${currentStatus ? 'UNBAN' : 'BAN'} this personnel?`)) {
            const { error } = await supabase
                .from('profiles')
                .update({ is_banned: !currentStatus })
                .eq('id', targetId);

            if (error) {
                setMessage({ text: 'Failed to update personnel status.', type: 'error' });
            } else {
                setMessage({ text: `Personnel status updated.`, type: 'success' });
                searchUsers(); // Refresh list
            }
        }
    };

    if (loading) return <div className="bg-black min-h-screen text-red-600 font-mono p-10">AUTHENTICATING O5 CREDENTIALS...</div>;

    return (
        <div className="min-h-screen bg-black text-red-600 font-mono p-4">
            <header className="mb-8 border-b-2 border-red-600 pb-4 flex justify-between items-center">
                <h1 className="text-3xl font-bold uppercase tracking-widest">O5 Council Terminal</h1>
                <div className="flex gap-4">
                    <span className="text-sm border border-red-600 px-2 py-1">ADMIN: {user?.email}</span>
                    <Link href="/" className="text-sm border border-red-600 px-2 py-1 hover:bg-red-600 hover:text-black transition-colors">EXIT</Link>
                </div>
            </header>

            {message && (
                <div className={`mb-4 p-2 border ${message.type === 'success' ? 'border-green-500 text-green-500' : 'border-red-500 text-red-500'} uppercase text-center`}>
                    {message.text}
                </div>
            )}

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-red-900">
                {['dashboard', 'rooms', 'reports', 'users'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as 'dashboard' | 'rooms' | 'reports' | 'users')}
                        className={`px-4 py-2 uppercase tracking-wider transition-colors ${activeTab === tab
                                ? 'bg-red-600 text-black font-bold'
                                : 'bg-black text-red-800 hover:text-red-500'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="border border-red-900/50 p-6 bg-red-950/5 min-h-[500px]">

                {/* DASHBOARD */}
                {activeTab === 'dashboard' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="border border-red-600 p-6 text-center">
                            <h3 className="text-sm text-red-400 uppercase mb-2">System Status</h3>
                            <div className="text-4xl font-bold text-green-500 animate-pulse">ONLINE</div>
                        </div>
                        <div className="border border-red-600 p-6 text-center">
                            <h3 className="text-sm text-red-400 uppercase mb-2">Active Protocols</h3>
                            <div className="text-4xl font-bold">{stats.activeSessions}</div>
                        </div>
                        <div className="border border-red-600 p-6 text-center">
                            <h3 className="text-sm text-red-400 uppercase mb-2">Total Personnel</h3>
                            <div className="text-4xl font-bold">{stats.totalUsers}</div>
                        </div>
                        <div className="border border-red-600 p-6 text-center">
                            <h3 className="text-sm text-red-400 uppercase mb-2">Archived Records</h3>
                            <div className="text-4xl font-bold">{stats.totalReports}</div>
                        </div>
                    </div>
                )}

                {/* ROOMS */}
                {activeTab === 'rooms' && (
                    <div>
                        <div className="flex justify-between mb-4">
                            <h2 className="text-xl font-bold uppercase">Active Containment Protocols</h2>
                            <button onClick={() => socket.emit('get_sessions')} className="text-xs border border-red-600 px-2 hover:bg-red-600 hover:text-black">REFRESH</button>
                        </div>
                        <div className="grid gap-4">
                            {sessions.length === 0 ? (
                                <div className="text-center text-red-900 py-8">NO ACTIVE PROTOCOLS</div>
                            ) : (
                                sessions.map(session => (
                                    <div key={session.id} className="border border-red-600/50 p-4 flex justify-between items-center bg-black/50">
                                        <div>
                                            <div className="font-bold text-lg">{session.id}</div>
                                            <div className="text-sm text-red-400">Host: {session.hostName} | Phase: {session.phase} | Users: {session.playerCount}/4</div>
                                            <div className="text-xs text-red-800 mt-1">{session.users.join(', ')}</div>
                                        </div>
                                        <button
                                            onClick={() => handleForceClose(session.id)}
                                            className="bg-red-900/20 border border-red-600 text-red-600 px-4 py-2 hover:bg-red-600 hover:text-black transition-colors uppercase text-sm font-bold"
                                        >
                                            TERMINATE
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* REPORTS */}
                {activeTab === 'reports' && (
                    <div>
                        <div className="flex justify-between mb-4">
                            <h2 className="text-xl font-bold uppercase">Latest Records</h2>
                            <button onClick={fetchReports} className="text-xs border border-red-600 px-2 hover:bg-red-600 hover:text-black">REFRESH</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-red-600 text-red-400 text-sm uppercase">
                                        <th className="p-2">ID</th>
                                        <th className="p-2">Title</th>
                                        <th className="p-2">Date</th>
                                        <th className="p-2">Status</th>
                                        <th className="p-2">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reports.map(report => (
                                        <tr key={report.id} className="border-b border-red-900/30 hover:bg-red-900/10">
                                            <td className="p-2 font-mono text-xs">{report.id.substring(0, 8)}...</td>
                                            <td className="p-2">{report.title}</td>
                                            <td className="p-2 text-xs">{new Date(report.created_at).toLocaleDateString()}</td>
                                            <td className="p-2 text-xs">{report.is_hidden ? 'EXPUNGED' : 'ACTIVE'}</td>
                                            <td className="p-2">
                                                {!report.is_hidden && (
                                                    <button
                                                        onClick={() => handleHideReport(report.id)}
                                                        className="text-xs border border-red-600 px-2 py-1 hover:bg-red-600 hover:text-black uppercase"
                                                    >
                                                        EXPUNGE
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* USERS */}
                {activeTab === 'users' && (
                    <div>
                        <div className="mb-6 flex gap-4">
                            <input
                                type="text"
                                value={userSearch}
                                onChange={(e) => setUserSearch(e.target.value)}
                                placeholder="SEARCH PERSONNEL BY NAME..."
                                className="bg-black border border-red-600 text-red-600 p-2 flex-grow focus:outline-none focus:ring-1 focus:ring-red-600 uppercase"
                                onKeyDown={(e) => e.key === 'Enter' && searchUsers()}
                            />
                            <button
                                onClick={searchUsers}
                                className="bg-red-600 text-black font-bold px-6 py-2 hover:bg-white hover:text-black uppercase"
                            >
                                SEARCH
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-red-600 text-red-400 text-sm uppercase">
                                        <th className="p-2">ID</th>
                                        <th className="p-2">Codename</th>
                                        <th className="p-2">Clearance</th>
                                        <th className="p-2">Status</th>
                                        <th className="p-2">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(profile => (
                                        <tr key={profile.id} className="border-b border-red-900/30 hover:bg-red-900/10">
                                            <td className="p-2 font-mono text-xs">{profile.id}</td>
                                            <td className="p-2 font-bold">{profile.display_name}</td>
                                            <td className="p-2 text-xs">{profile.is_admin ? 'O5 COUNCIL' : 'STANDARD'}</td>
                                            <td className="p-2 text-xs">{profile.is_banned ? 'REVOKED' : 'ACTIVE'}</td>
                                            <td className="p-2">
                                                <button
                                                    onClick={() => handleBanUser(profile.id, profile.is_banned)}
                                                    className={`text-xs border px-2 py-1 uppercase ${profile.is_banned
                                                            ? 'border-green-600 text-green-600 hover:bg-green-600 hover:text-black'
                                                            : 'border-red-600 text-red-600 hover:bg-red-600 hover:text-black'
                                                        }`}
                                                >
                                                    {profile.is_banned ? 'RESTORE' : 'REVOKE'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {users.length === 0 && userSearch && (
                                <div className="text-center text-red-900 py-8">NO PERSONNEL FOUND</div>
                            )}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
