import React from 'react';

export default function InstructionsPage() {
    return (
        <div className="min-h-screen bg-black text-scp-green font-mono p-8 relative overflow-hidden">
            {/* Scanline effect is global, but we can add extra atmosphere if needed */}
            <div className="max-w-4xl mx-auto border-2 border-scp-green p-8 bg-black/90 shadow-[0_0_20px_rgba(0,255,65,0.1)] relative">
                {/* Decorative corners */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-scp-green -mt-1 -ml-1"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-scp-green -mt-1 -mr-1"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-scp-green -mb-1 -ml-1"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-scp-green -mb-1 -mr-1"></div>

                <h1 className="text-4xl font-bold mb-8 text-center text-scp-green uppercase tracking-widest border-b-2 border-scp-green pb-4">
                    SCP Report Generation Protocol
                    <span className="block text-sm mt-2 text-scp-green-dim">Operational Manual v1.0</span>
                </h1>

                <div className="space-y-8 text-scp-text">
                    <section>
                        <h2 className="text-2xl font-bold text-scp-green mb-4 uppercase tracking-wider border-l-4 border-scp-green pl-4">
                            1. Operational Context
                        </h2>
                        <p className="leading-relaxed">
                            You are a junior researcher at the SCP Foundation. You have been ordered to file a new SCP report, but your data is fragmented. Fortunately, your colleagues possess the missing pieces. Collaborate to reconstruct the containment procedures and description for this anomaly.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-scp-green mb-4 uppercase tracking-wider border-l-4 border-scp-green pl-4">
                            2. Objective
                        </h2>
                        <p className="leading-relaxed">
                            Construct a complete SCP report based on assigned keywords and clearance-level directives. The most accurate and cohesive report will receive the highest commendation.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-scp-green mb-4 uppercase tracking-wider border-l-4 border-scp-green pl-4">
                            3. Protocol Sequence
                        </h2>

                        <div className="space-y-6">
                            <div className="border border-scp-green/30 p-4 bg-scp-green/5">
                                <h3 className="text-xl font-bold text-scp-green mb-2">Phase 1: Lobby</h3>
                                <p>Initialize terminal connection. Await personnel synchronization.</p>
                            </div>

                            <div className="border border-scp-green/30 p-4 bg-scp-green/5">
                                <h3 className="text-xl font-bold text-scp-green mb-2">Phase 2: Data Seeding (Suggestion)</h3>
                                <p>Input 5 keywords to seed the database. These terms will form the vocabulary pool for the session.</p>
                            </div>

                            <div className="border border-scp-green/30 p-4 bg-scp-green/5">
                                <h3 className="text-xl font-bold text-scp-green mb-2">Phase 3: Directive Selection (Choice)</h3>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>Select 3 keywords from the provided pool.</li>
                                    <li>Review your <strong>Public Classification</strong> (Object Class, Properties).</li>
                                    <li>Memorize your <strong>Hidden Directive</strong> (Secret rule known only to you).</li>
                                </ul>
                            </div>

                            <div className="border border-scp-green/30 p-4 bg-scp-green/5">
                                <h3 className="text-xl font-bold text-scp-green mb-2">Phase 4: Collaborative Writing (Scripting)</h3>
                                <p className="mb-2">Execute the writing protocol in 4 rotating stages:</p>
                                <ol className="list-decimal list-inside space-y-1 ml-4 text-scp-green-dim">
                                    <li><strong className="text-scp-green">Containment Procedures:</strong> How to contain the anomaly.</li>
                                    <li><strong className="text-scp-green">Description (Initial):</strong> Appearance and basic properties.</li>
                                    <li><strong className="text-scp-green">Description (Analysis):</strong> Experiments and detailed anomalies.</li>
                                    <li><strong className="text-scp-green">Conclusion & Designation:</strong> Addenda and final naming.</li>
                                </ol>
                            </div>

                            <div className="border border-scp-green/30 p-4 bg-scp-green/5">
                                <h3 className="text-xl font-bold text-scp-green mb-2">Phase 5 & 6: Review & Evaluation</h3>
                                <p>Present findings. Vote for the most cohesive report. Verify if colleagues adhered to their Hidden Directives.</p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-scp-green mb-4 uppercase tracking-wider border-l-4 border-scp-green pl-4">
                            4. Scoring Metrics
                        </h2>
                        <ul className="list-none space-y-2">
                            <li className="flex justify-between border-b border-scp-green/30 pb-1">
                                <span>Best Report Commendation</span>
                                <span className="font-bold text-scp-green">10 pts / vote</span>
                            </li>
                            <li className="flex justify-between border-b border-scp-green/30 pb-1">
                                <span>Hidden Directive Success (Owner)</span>
                                <span className="font-bold text-scp-green">20 pts</span>
                            </li>
                            <li className="flex justify-between border-b border-scp-green/30 pb-1">
                                <span>Hidden Directive Success (Contributor)</span>
                                <span className="font-bold text-scp-green">5 pts</span>
                            </li>
                        </ul>
                    </section>
                </div>

                <div className="mt-12 text-center">
                    <p className="text-xs text-scp-green-dim uppercase tracking-widest mb-4">
                        SECURE. CONTAIN. PROTECT.
                    </p>
                    <div className="inline-block border border-scp-red text-scp-red px-4 py-1 text-sm font-bold uppercase animate-pulse">
                        Clearance Verified
                    </div>
                </div>
            </div>
        </div>
    );
}
