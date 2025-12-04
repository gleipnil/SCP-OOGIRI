"use client";

import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Report {
    id: string;
    title: string;
    content: any; // Can be string or object depending on DB/Supabase
    author_id: string;
    created_at: string;
}

export default function DClassLobby() {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const fetchReports = async () => {
            const { data, error } = await supabase
                .from('reports')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching reports:', error);
            } else {
                setReports(data || []);
            }
            setLoading(false);
        };

        fetchReports();
    }, [supabase]);

    const handleStartSimulation = () => {
        if (!selectedReport) return;
        router.push(`/d-class/game?reportId=${selectedReport.id}`);
    };

    const getReportPreview = (content: any) => {
        if (!content) return '';
        try {
            // If content is already an object, use it directly. If string, parse it.
            const parsed = typeof content === 'string' ? JSON.parse(content) : content;

            if (parsed && typeof parsed === 'object') {
                if (parsed.descriptionEarly || parsed.descriptionLate) {
                    return parsed.descriptionEarly || parsed.descriptionLate;
                }
            }
            return typeof parsed === 'string' ? parsed : JSON.stringify(parsed);
        } catch (e) {
            // If parsing fails, return as string if possible, or stringify
            return typeof content === 'string' ? content : JSON.stringify(content);
        }
    };

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString();
        } catch (e) {
            return 'Unknown Date';
        }
    };

    return (
        <div className="min-h-screen bg-black text-scp-green font-mono p-4 md:p-8 flex flex-col items-center">
            <h1 className="text-3xl font-bold mb-2 text-center uppercase tracking-widest text-scp-red">
                D-Class Assignment Terminal
            </h1>
            <p className="text-scp-red-dim text-sm mb-8 uppercase tracking-wider">
                Select a file to initiate exploration protocol.
            </p>

            <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 flex-grow">
                {/* Report List */}
                <div className="border border-scp-green/30 bg-scp-green/5 p-4 flex flex-col">
                    <h2 className="text-xl font-bold mb-4 border-b border-scp-green/30 pb-2 uppercase">
                        Available Files
                    </h2>
                    {loading ? (
                        <div className="text-center py-8 animate-pulse">Accessing Database...</div>
                    ) : (
                        <div className="overflow-y-auto custom-scrollbar flex-grow max-h-[60vh] md:max-h-[600px] space-y-2">
                            {reports.map((report) => (
                                <div
                                    key={report.id}
                                    onClick={() => setSelectedReport(report)}
                                    className={`p-3 border cursor-pointer transition-colors uppercase tracking-wider text-sm ${selectedReport?.id === report.id
                                        ? 'bg-scp-red text-black border-scp-red font-bold'
                                        : 'border-scp-green/30 hover:bg-scp-green/10 text-scp-green'
                                        }`}
                                >
                                    <div className="flex justify-between">
                                        <span>{report.title || 'Untitled'}</span>
                                        <span className="text-xs opacity-70">{formatDate(report.created_at)}</span>
                                    </div>
                                </div>
                            ))}
                            {reports.length === 0 && (
                                <div className="text-center text-scp-green-dim py-4">No reports found.</div>
                            )}
                        </div>
                    )}
                </div>

                {/* Selected Report Details */}
                <div className="border border-scp-green/30 bg-black p-6 flex flex-col relative">
                    {selectedReport ? (
                        <>
                            <div className="absolute top-0 right-0 p-2 text-xs text-scp-red border-b border-l border-scp-red/50 uppercase tracking-widest">
                                Classified
                            </div>
                            <h2 className="text-2xl font-bold mb-4 text-scp-green uppercase tracking-widest border-b border-scp-green/50 pb-2">
                                {selectedReport.title || 'Untitled Report'}
                            </h2>
                            <div className="flex-grow overflow-y-auto custom-scrollbar mb-6 font-typewriter text-sm text-scp-green-dim whitespace-pre-wrap">
                                {(getReportPreview(selectedReport.content) || '').substring(0, 500)}...
                                <br />
                                <br />
                                <span className="text-scp-red">[REMAINDER OF FILE ENCRYPTED UNTIL DEPLOYMENT]</span>
                            </div>
                            <button
                                onClick={handleStartSimulation}
                                className="w-full bg-scp-red text-black font-bold py-4 uppercase tracking-widest hover:bg-red-600 transition-colors shadow-[0_0_20px_rgba(255,0,0,0.3)]"
                            >
                                Initiate Protocol
                            </button>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full text-scp-green-dim uppercase tracking-widest text-sm">
                            &lt; Select a file to view details &gt;
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-8">
                <a href="/" className="text-scp-green-dim hover:text-scp-green hover:underline uppercase tracking-widest text-sm">
                    &lt; Return to Entrance
                </a>
            </div>
        </div>
    );
}
