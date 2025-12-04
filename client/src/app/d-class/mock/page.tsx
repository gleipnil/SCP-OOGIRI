"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Report {
    id: string;
    title: string;
    content: string;
    author_id: string;
    created_at: string;
}

const MOCK_REPORTS: Report[] = [
    {
        id: 'mock-1',
        title: 'SCP-TEST-001',
        content: 'This is a test report content. It is safe to view.',
        author_id: 'mock-author',
        created_at: new Date().toISOString()
    },
    {
        id: 'mock-2',
        title: 'SCP-TEST-002 (Empty Content)',
        content: '',
        author_id: 'mock-author',
        created_at: new Date().toISOString()
    },
    {
        id: 'mock-3',
        title: '',
        content: 'This report has no title.',
        author_id: 'mock-author',
        created_at: new Date().toISOString()
    }
];

export default function DClassMockLobby() {
    const [reports, setReports] = useState<Report[]>(MOCK_REPORTS);
    const [loading, setLoading] = useState(false);
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const router = useRouter();

    const handleStartSimulation = () => {
        if (!selectedReport) return;
        alert(`Starting simulation for ${selectedReport.id}`);
    };

    return (
        <div className="min-h-screen bg-black text-scp-green font-mono p-4 md:p-8 flex flex-col items-center">
            <h1 className="text-3xl font-bold mb-2 text-center uppercase tracking-widest text-scp-red">
                D-Class Assignment Terminal (MOCK)
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
                                        <span className="text-xs opacity-70">{new Date(report.created_at).toLocaleDateString()}</span>
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
                                {(selectedReport.content || '').substring(0, 500)}...
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
                <a href="/d-class" className="text-scp-green-dim hover:text-scp-green hover:underline uppercase tracking-widest text-sm">
                    &lt; Return to Real Lobby
                </a>
            </div>
        </div>
    );
}
