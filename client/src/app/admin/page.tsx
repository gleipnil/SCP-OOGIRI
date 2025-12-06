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



function ManualEntryForm({ user, supabase }: { user: User | null, supabase: any }) {
    const [formData, setFormData] = useState({
        title: '',
        created_at: '',
        owner_id: '',
        keywords: '',
        constraints: {
            public: ['', '', '', ''],
            hidden: ''
        },
        content: {
            procedures: { author_id: '', text: '' },
            desc_early: { author_id: '', text: '' },
            desc_late: { author_id: '', text: '' },
            conclusion: { author_id: '', text: '' }
        }
    });
    const [status, setStatus] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    const handleSubmit = () => {
        if (!formData.title || !formData.owner_id) {
            setStatus({ text: 'Title and Owner are required.', type: 'error' });
            return;
        }

        const payload = {
            userId: user?.id,
            title: formData.title,
            created_at: formData.created_at || undefined,
            owner_id: formData.owner_id,
            keywords: formData.keywords.split(',').map(k => k.trim()).filter(k => k),
            constraints: {
                public: formData.constraints.public,
                hidden: formData.constraints.hidden
            },
            content: {
                procedures: formData.content.procedures,
                desc_early: formData.content.desc_early,
                desc_late: formData.content.desc_late,
                conclusion: formData.content.conclusion
            }
        };

        socket.emit('admin_create_report', payload);
    };

    useEffect(() => {
        const onSuccess = (msg: string) => setStatus({ text: msg, type: 'success' });
        const onError = (msg: string) => setStatus({ text: msg, type: 'error' });

        socket.on('admin_action_success', onSuccess);
        socket.on('admin_error', onError);

        return () => {
            socket.off('admin_action_success', onSuccess);
            socket.off('admin_error', onError);
        };
    }, []);

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold uppercase mb-4">Manual Report Entry</h2>

            {status && (
                <div className={`p-2 border ${status.type === 'success' ? 'border-green-500 text-green-500' : 'border-red-500 text-red-500'} uppercase text-center`}>
                    {status.text}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* General Info */}
                <div className="border border-red-600/30 p-4">
                    <h3 className="text-red-400 uppercase mb-4 border-b border-red-600/30 pb-2">General Info</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs text-red-500 uppercase mb-1">Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                className="w-full bg-black border border-red-800 p-2 text-red-500 focus:border-red-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-red-500 uppercase mb-1">Created At (Optional)</label>
                            <input
                                type="datetime-local"
                                value={formData.created_at}
                                onChange={e => setFormData({ ...formData, created_at: e.target.value })}
                                className="w-full bg-black border border-red-800 p-2 text-red-500 focus:border-red-500 outline-none scheme-dark"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-red-500 uppercase mb-1">Owner (Host)</label>
                            <UserSelector
                                supabase={supabase}
                                value={formData.owner_id}
                                onChange={id => setFormData({ ...formData, owner_id: id })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-red-500 uppercase mb-1">Keywords (Comma separated)</label>
                            <input
                                type="text"
                                value={formData.keywords}
                                onChange={e => setFormData({ ...formData, keywords: e.target.value })}
                                className="w-full bg-black border border-red-800 p-2 text-red-500 focus:border-red-500 outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Constraints */}
                <div className="border border-red-600/30 p-4">
                    <h3 className="text-red-400 uppercase mb-4 border-b border-red-600/30 pb-2">Constraints</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs text-red-500 uppercase mb-1">Public Constraints (4 Parts)</label>
                            {formData.constraints.public.map((c, i) => (
                                <input
                                    key={i}
                                    type="text"
                                    value={c}
                                    onChange={e => {
                                        const newPublic = [...formData.constraints.public];
                                        newPublic[i] = e.target.value;
                                        setFormData({ ...formData, constraints: { ...formData.constraints, public: newPublic } });
                                    }}
                                    placeholder={`Part ${i + 1}`}
                                    className="w-full bg-black border border-red-800 p-2 text-red-500 focus:border-red-500 outline-none mb-2"
                                />
                            ))}
                        </div>
                        <div>
                            <label className="block text-xs text-red-500 uppercase mb-1">Hidden Constraint</label>
                            <input
                                type="text"
                                value={formData.constraints.hidden}
                                onChange={e => setFormData({ ...formData, constraints: { ...formData.constraints, hidden: e.target.value } })}
                                className="w-full bg-black border border-red-800 p-2 text-red-500 focus:border-red-500 outline-none"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Sections */}
            <div className="border border-red-600/30 p-4">
                <h3 className="text-red-400 uppercase mb-4 border-b border-red-600/30 pb-2">Report Content</h3>
                <div className="space-y-6">
                    <ContentSection
                        label="Containment Procedures"
                        supabase={supabase}
                        data={formData.content.procedures}
                        onChange={val => setFormData({ ...formData, content: { ...formData.content, procedures: val } })}
                    />
                    <ContentSection
                        label="Description (Early)"
                        supabase={supabase}
                        data={formData.content.desc_early}
                        onChange={val => setFormData({ ...formData, content: { ...formData.content, desc_early: val } })}
                    />
                    <ContentSection
                        label="Description (Late)"
                        supabase={supabase}
                        data={formData.content.desc_late}
                        onChange={val => setFormData({ ...formData, content: { ...formData.content, desc_late: val } })}
                        note="May be empty for 3-player games"
                    />
                    <ContentSection
                        label="Conclusion"
                        supabase={supabase}
                        data={formData.content.conclusion}
                        onChange={val => setFormData({ ...formData, content: { ...formData.content, conclusion: val } })}
                    />
                </div>
            </div>

            <button
                onClick={handleSubmit}
                className="w-full bg-red-600 text-black font-bold py-4 hover:bg-white transition-colors uppercase tracking-widest"
            >
                Save Report
            </button>
        </div>
    );
}

function ContentSection({ label, supabase, data, onChange, note }: {
    label: string,
    supabase: any,
    data: { author_id: string, text: string },
    onChange: (val: { author_id: string, text: string }) => void,
    note?: string
}) {
    return (
        <div className="border-l-2 border-red-900 pl-4">
            <div className="flex justify-between items-baseline mb-2">
                <label className="text-sm font-bold text-red-500 uppercase">{label}</label>
                {note && <span className="text-xs text-red-700 italic">{note}</span>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-4">
                <div>
                    <label className="block text-xs text-red-800 uppercase mb-1">Author</label>
                    <UserSelector
                        supabase={supabase}
                        value={data.author_id}
                        onChange={id => onChange({ ...data, author_id: id })}
                    />
                </div>
                <div>
                    <label className="block text-xs text-red-800 uppercase mb-1">Content</label>
                    <textarea
                        value={data.text}
                        onChange={e => onChange({ ...data, text: e.target.value })}
                        rows={3}
                        className="w-full bg-black border border-red-800 p-2 text-red-500 focus:border-red-500 outline-none font-mono text-sm"
                    />
                </div>
            </div>
        </div>
    );
}

function UserSelector({ supabase, value, onChange }: { supabase: any, value: string, onChange: (id: string) => void }) {
    const [search, setSearch] = useState('');
    const [results, setResults] = useState<Profile[]>([]);
    const [selectedName, setSelectedName] = useState('');

    useEffect(() => {
        if (value) {
            // Fetch name if value exists (initial load or set)
            supabase.from('profiles').select('display_name').eq('id', value).single()
                .then(({ data }: any) => {
                    if (data) setSelectedName(data.display_name);
                });
        }
    }, [value, supabase]);

    const handleSearch = async () => {
        if (!search.trim()) return;
        const { data } = await supabase
            .from('profiles')
            .select('*')
            .ilike('display_name', `%${search}%`)
            .limit(5);
        if (data) setResults(data);
    };

    return (
        <div className="relative">
            {value ? (
                <div className="flex justify-between items-center bg-red-900/20 border border-red-600 p-2">
                    <span className="text-sm font-bold">{selectedName || value}</span>
                    <button onClick={() => onChange('')} className="text-xs text-red-400 hover:text-white">CHANGE</button>
                </div>
            ) : (
                <div>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSearch()}
                            placeholder="Search User..."
                            className="w-full bg-black border border-red-800 p-2 text-xs text-red-500 focus:border-red-500 outline-none"
                        />
                        <button onClick={handleSearch} className="bg-red-900/30 border border-red-800 px-2 text-xs hover:bg-red-600 hover:text-black">GO</button>
                    </div>
                    {results.length > 0 && (
                        <div className="absolute z-10 w-full bg-black border border-red-600 mt-1 max-h-40 overflow-y-auto">
                            {results.map(r => (
                                <div
                                    key={r.id}
                                    onClick={() => {
                                        onChange(r.id);
                                        setSelectedName(r.display_name);
                                        setResults([]);
                                        setSearch('');
                                    }}
                                    className="p-2 hover:bg-red-900/50 cursor-pointer text-xs border-b border-red-900/30"
                                >
                                    {r.display_name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function MaintenancePanel({ user }: { user: User | null }) {
    const [loading, setLoading] = useState(false);

    const handleRecalculate = () => {
        if (!user) return;
        if (confirm('CAUTION: This will overwrite "Total Plays" for all users based on existing report data. Proceed?')) {
            setLoading(true);
            socket.emit('admin_recalculate_stats', { userId: user.id });
            setTimeout(() => setLoading(false), 2000);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold uppercase mb-4 text-red-500">System Maintenance Protocols</h2>

            <div className="border border-red-600/30 p-6 bg-red-950/20">
                <h3 className="text-lg font-bold uppercase mb-2 text-red-500">Play Count Repair</h3>
                <p className="text-sm text-red-400 mb-6">
                    Analyze all archived reports to reconstruct personnel service records (Total Plays only).
                    <br />
                    <span className="text-yellow-500">WARNING: This process overwrites "Total Plays" based on found report sessions. "Apollyon Wins" are NOT affected.</span>
                </p>

                <button
                    onClick={handleRecalculate}
                    disabled={loading}
                    className={`bg-transparent border-2 border-red-600 text-red-600 font-bold py-3 px-8 uppercase tracking-widest hover:bg-red-600 hover:text-black transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {loading ? 'PROCESSING...' : 'RECALCULATE TOTAL PLAYS'}
                </button>
            </div>
        </div>
    );
}

export default function AdminPage() {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [activeTab, setActiveTab] = useState<'dashboard' | 'rooms' | 'reports' | 'users' | 'manual' | 'maintenance'>('dashboard');
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
            <div className="flex gap-2 mb-6 border-b border-red-900 overflow-x-auto">
                {['dashboard', 'rooms', 'reports', 'users', 'manual', 'maintenance'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as 'dashboard' | 'rooms' | 'reports' | 'users' | 'manual' | 'maintenance')}
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

                {/* MANUAL ENTRY */}
                {activeTab === 'manual' && (
                    <ManualEntryForm user={user} supabase={supabase} />
                )}

                {/* MAINTENANCE */}
                {activeTab === 'maintenance' && (
                    <MaintenancePanel user={user} />
                )}

            </div>
        </div>
    );
}
