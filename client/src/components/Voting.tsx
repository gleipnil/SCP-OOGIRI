import React, { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { GameState } from '../types';

interface VotingProps {
    socket: Socket;
    gameState: GameState;
}

export default function Voting({ socket, gameState }: VotingProps) {
    const [bestReportId, setBestReportId] = useState<string>('');
    const [constraintChecks, setConstraintChecks] = useState<{ [reportId: string]: boolean }>({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { reports, users } = gameState;

    // Recover state
    useEffect(() => {
        if (socket.id && gameState.readyStates[socket.id]) {
            setTimeout(() => setIsSubmitted(true), 0);
        }
    }, [gameState.readyStates, socket.id]);

    const handleConstraintCheckChange = (reportId: string, checked: boolean) => {
        setConstraintChecks(prev => ({
            ...prev,
            [reportId]: checked
        }));
    };

    const handleSubmit = () => {
        if (bestReportId) {
            socket.emit('submit_vote', { bestReportId, constraintChecks });
            setIsSubmitted(true);
        }
    };

    const myUser = gameState.users.find(u => u.id === socket.id);
    const isHost = myUser?.isHost;
    const allReady = gameState.users.every(u => gameState.readyStates[u.id]);

    const handleNextPhase = () => {
        socket.emit('next_phase');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 font-mono">
            <div className="w-full max-w-6xl border-2 border-scp-green bg-black/95 p-8 relative shadow-[0_0_20px_rgba(0,255,65,0.1)]">
                <h2 className="text-3xl font-bold text-scp-green mb-2 text-center uppercase tracking-widest border-b border-scp-green pb-4">
                    Voting Protocol
                </h2>
                <p className="text-scp-green-dim text-center mb-8 uppercase tracking-wider text-sm">
                    Evaluate files and verify hidden directive compliance.
                </p>

                <div className="space-y-8 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar mb-8">
                    {reports.map((report) => {
                        const owner = users.find(u => u.id === report.ownerId);
                        const isMyReport = report.ownerId === socket.id;
                        const isSelected = bestReportId === report.id;

                        return (
                            <div key={report.id} className={`border ${isSelected ? 'border-scp-green bg-scp-green/10' : 'border-scp-green/30 bg-black'} p-6 transition-all duration-200`}>
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-xl font-bold text-scp-green uppercase tracking-wider">
                                            {report.title || "Untitled"}
                                        </h3>
                                        <p className="text-xs text-scp-green-dim uppercase tracking-widest">Author: {owner?.name}</p>
                                    </div>
                                    {!isMyReport && !isSubmitted && (
                                        <label className={`flex items-center space-x-3 cursor-pointer p-3 border ${isSelected ? 'border-scp-green bg-scp-green text-black' : 'border-scp-green text-scp-green hover:bg-scp-green/20'} transition-all duration-200`}>
                                            <input
                                                type="radio"
                                                name="bestReport"
                                                value={report.id}
                                                checked={bestReportId === report.id}
                                                onChange={() => setBestReportId(report.id)}
                                                className="hidden"
                                            />
                                            <span className="font-bold uppercase tracking-wider text-sm">
                                                {isSelected ? '>> VOTE REGISTERED <<' : 'VOTE FOR FILE'}
                                            </span>
                                        </label>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-scp-green/5 p-4 border border-scp-green/20">
                                    <div>
                                        <span className="text-xs text-scp-green-dim uppercase tracking-widest block mb-2">Public Classification</span>
                                        <ul className="space-y-1 text-sm">
                                            {report.constraint.publicDescriptions.map((desc, i) => (
                                                <li key={i} className="flex flex-col">
                                                    <span className="font-bold text-scp-green uppercase text-xs">
                                                        {["Object Class", "Properties", "Observation", "Containment"][i]}
                                                    </span>
                                                    <span className="text-scp-text pl-2 border-l border-scp-green/30 text-xs">
                                                        {desc}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <span className="text-xs text-scp-green-dim uppercase tracking-widest block mb-2">Hidden Directive</span>
                                        <p className="text-sm text-scp-red font-bold border border-scp-red/30 p-2 bg-scp-red/5">
                                            {report.constraint.hiddenDescription}
                                        </p>
                                    </div>
                                </div>

                                {!isMyReport && !isSubmitted && (
                                    <div className="flex items-center space-x-3 bg-black p-3 border border-scp-green/30">
                                        <input
                                            type="checkbox"
                                            id={`check-${report.id}`}
                                            checked={constraintChecks[report.id] || false}
                                            onChange={(e) => handleConstraintCheckChange(report.id, e.target.checked)}
                                            className="form-checkbox text-scp-green h-5 w-5 rounded bg-black border-scp-green focus:ring-scp-green"
                                        />
                                        <label htmlFor={`check-${report.id}`} className="text-sm cursor-pointer select-none text-scp-green uppercase tracking-wider">
                                            Directive Compliant? (Check if Yes)
                                        </label>
                                    </div>
                                )}
                                {isMyReport && (
                                    <div className="text-xs text-scp-green-dim italic text-center uppercase tracking-widest border border-scp-green/10 p-2">
                                        [Self-Voting Prohibited]
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {!isSubmitted ? (
                    <button
                        onClick={handleSubmit}
                        disabled={!bestReportId}
                        className="w-full bg-scp-green text-black font-bold py-4 px-6 uppercase tracking-widest hover:bg-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Submit Evaluation
                    </button>
                ) : (
                    <div className="mt-8 text-center border border-scp-green/30 bg-scp-green/5 p-6">
                        <div className="text-scp-green text-xl mb-4 uppercase tracking-widest animate-pulse">
                            {">> Evaluation Submitted <<"}
                        </div>
                        <p className="text-scp-green-dim uppercase text-sm">Awaiting consensus...</p>
                        <div className="mt-4 flex justify-center gap-2">
                            {gameState.users.filter(u => u.id !== socket.id).map(u => {
                                const isReady = gameState.readyStates[u.id];
                                return (
                                    <div
                                        key={u.id}
                                        className={`px-3 py-1 border transition-all duration-300 ${isReady
                                            ? 'bg-scp-green text-black border-scp-green font-bold shadow-[0_0_10px_rgba(0,255,65,0.4)]'
                                            : 'bg-scp-green/5 text-scp-green-dim border-scp-green/30'
                                            }`}
                                    >
                                        <span className="text-xs uppercase tracking-wider">
                                            {u.name}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                        {isHost && allReady && (
                            <button
                                onClick={handleNextPhase}
                                className="w-full mt-6 bg-scp-red text-black font-bold py-4 px-6 uppercase tracking-widest hover:bg-red-600 transition-colors duration-200"
                            >
                                Display Final Results
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
