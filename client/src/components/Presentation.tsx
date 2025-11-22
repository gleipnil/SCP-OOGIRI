import React from 'react';
import { Socket } from 'socket.io-client';
import { GameState } from '../types';

interface PresentationProps {
    socket: Socket;
    gameState: GameState;
}

export default function Presentation({ socket, gameState }: PresentationProps) {
    const { currentPresentationIndex, reports, users } = gameState;
    const currentReport = reports[currentPresentationIndex];
    const owner = users.find(u => u.id === currentReport.ownerId);

    const handleNext = () => {
        socket.emit('next_phase');
    };

    const myUser = gameState.users.find(u => u.id === socket.id);
    const isHost = myUser?.isHost;

    if (!currentReport) {
        return <div className="text-scp-green font-mono p-8 animate-pulse">Loading File...</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 font-mono">
            <div className="w-full max-w-5xl border-2 border-scp-green bg-black/95 p-8 relative shadow-[0_0_20px_rgba(0,255,65,0.1)]">
                <div className="flex justify-between items-end mb-8 border-b border-scp-green pb-4">
                    <h2 className="text-2xl font-bold text-scp-green uppercase tracking-widest">
                        File Access: Read Only
                    </h2>
                    <div className="text-scp-green-dim uppercase tracking-widest text-sm">
                        File {currentPresentationIndex + 1} of {reports.length}
                    </div>
                </div>

                <div className="bg-black p-8 border border-scp-green/30 font-mono text-scp-text space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar relative">
                    {/* Watermark */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-scp-green/5 text-9xl font-bold rotate-[-45deg] pointer-events-none select-none whitespace-nowrap">
                        CONFIDENTIAL
                    </div>

                    <div className="border-b border-scp-green/30 pb-6 relative z-10">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-4xl font-bold text-scp-green mb-2 uppercase tracking-wider">
                                    SCP-XXXX: {currentReport.title || "Untitled"}
                                </h1>
                                <p className="text-sm text-scp-green-dim uppercase tracking-widest">
                                    Author: {owner?.name || "Unknown"}
                                </p>
                            </div>
                            <div className="border border-scp-red text-scp-red px-3 py-1 text-xs font-bold uppercase tracking-widest animate-pulse">
                                Clearance Level 3
                            </div>
                        </div>
                    </div>

                    {/* Constraints Info (Revealed now) */}
                    <div className="bg-scp-green/5 p-6 border border-scp-green/30 relative z-10">
                        <h3 className="text-xs font-bold text-scp-green mb-4 uppercase tracking-widest border-b border-scp-green/30 pb-2">
                            Declassified Directives
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <span className="text-xs text-scp-green-dim uppercase tracking-widest block mb-2">Public Classification</span>
                                <ul className="space-y-2 text-sm">
                                    {currentReport.constraint.publicDescriptions.map((desc, i) => (
                                        <li key={i} className="flex flex-col">
                                            <span className="font-bold text-scp-green uppercase text-xs">
                                                {["Object Class", "Properties", "Observation", "Containment"][i]}
                                            </span>
                                            <span className="text-scp-text pl-2 border-l border-scp-green/30">
                                                {desc}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <span className="text-xs text-scp-green-dim uppercase tracking-widest block mb-2">Clearance Level 4 (Revealed)</span>
                                <div className="border border-scp-red/30 bg-scp-red/5 p-3">
                                    <p className="text-scp-red font-bold">{currentReport.constraint.hiddenDescription}</p>
                                </div>
                            </div>
                            <div className="col-span-full">
                                <span className="text-xs text-scp-green-dim uppercase tracking-widest block mb-2">Keywords</span>
                                <div className="text-sm text-scp-green font-bold border border-scp-green/30 p-2 bg-black inline-block">
                                    {currentReport.selectedKeywords.join(' // ')}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8 relative z-10">
                        <div>
                            <h3 className="text-lg font-bold text-scp-green uppercase mb-2 border-b border-scp-green/30 inline-block pr-4">
                                Special Containment Procedures
                            </h3>
                            <p className="whitespace-pre-wrap leading-relaxed">{currentReport.containmentProcedures}</p>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-scp-green uppercase mb-2 border-b border-scp-green/30 inline-block pr-4">
                                Description
                            </h3>
                            <p className="whitespace-pre-wrap mb-4 leading-relaxed">{currentReport.descriptionEarly}</p>
                            <p className="whitespace-pre-wrap leading-relaxed">{currentReport.descriptionLate}</p>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-scp-green uppercase mb-2 border-b border-scp-green/30 inline-block pr-4">
                                Addendum / Conclusion
                            </h3>
                            <p className="whitespace-pre-wrap leading-relaxed">{currentReport.conclusion}</p>
                        </div>
                    </div>
                </div>

                {isHost && (
                    <button
                        onClick={handleNext}
                        className="w-full mt-6 bg-scp-green text-black font-bold py-4 px-6 uppercase tracking-widest hover:bg-white transition-colors duration-200"
                    >
                        {currentPresentationIndex < reports.length - 1 ? "Access Next File" : "Proceed to Voting Protocol"}
                    </button>
                )}
            </div>
        </div>
    );
}
