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
            setIsSubmitted(true);
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
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
            <div className="w-full max-w-5xl bg-gray-800 p-8 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-purple-400 mb-6 text-center">Voting Phase</h2>
                <p className="text-gray-300 text-center mb-8">
                    Vote for the best SCP report and verify if the hidden constraints were met.
                </p>

                <div className="space-y-8 max-h-[60vh] overflow-y-auto pr-2">
                    {reports.map((report) => {
                        const owner = users.find(u => u.id === report.ownerId);
                        const isMyReport = report.ownerId === socket.id;

                        return (
                            <div key={report.id} className="bg-gray-700 p-6 rounded border border-gray-600">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{report.title || "Untitled"}</h3>
                                        <p className="text-sm text-gray-400">Author: {owner?.name}</p>
                                    </div>
                                    {!isMyReport && !isSubmitted && (
                                        <label className="flex items-center space-x-2 cursor-pointer bg-purple-900 p-2 rounded hover:bg-purple-800 transition">
                                            <input
                                                type="radio"
                                                name="bestReport"
                                                value={report.id}
                                                checked={bestReportId === report.id}
                                                onChange={() => setBestReportId(report.id)}
                                                className="form-radio text-purple-500 h-5 w-5"
                                            />
                                            <span className="font-bold text-purple-200">Vote for Best Report</span>
                                        </label>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 bg-gray-800 p-3 rounded">
                                    <div>
                                        <span className="text-xs text-gray-500 uppercase">Public Constraints</span>
                                        <ul className="list-disc list-inside text-sm">
                                            {report.constraint.publicDescriptions.map((desc, i) => (
                                                <li key={i}>
                                                    <span className="font-bold text-yellow-200">
                                                        {["Object class", "SCPの性質", "観測時の特徴", "財団による対応"][i]}:
                                                    </span> {desc}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <span className="text-xs text-gray-500 uppercase">Hidden Constraint</span>
                                        <p className="text-sm text-pink-400">{report.constraint.hiddenDescription}</p>
                                    </div>
                                </div>

                                {!isMyReport && !isSubmitted && (
                                    <div className="flex items-center space-x-3 bg-gray-800 p-3 rounded border border-gray-600">
                                        <input
                                            type="checkbox"
                                            id={`check-${report.id}`}
                                            checked={constraintChecks[report.id] || false}
                                            onChange={(e) => handleConstraintCheckChange(report.id, e.target.checked)}
                                            className="form-checkbox text-green-500 h-5 w-5 rounded"
                                        />
                                        <label htmlFor={`check-${report.id}`} className="text-sm cursor-pointer select-none">
                                            Hidden Constraint Achieved? (Check if Yes)
                                        </label>
                                    </div>
                                )}
                                {isMyReport && (
                                    <div className="text-sm text-gray-500 italic text-center">
                                        You cannot vote for your own report.
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
                        className="w-full mt-8 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded transition duration-200 disabled:opacity-50"
                    >
                        Submit Votes
                    </button>
                ) : (
                    <div className="mt-8 text-center">
                        <div className="text-green-500 text-xl mb-4">✓ Votes Submitted</div>
                        <p className="text-gray-400">Waiting for other players...</p>
                        <div className="mt-4 flex justify-center space-x-2">
                            {gameState.users.map(u => (
                                <div
                                    key={u.id}
                                    className={`w-3 h-3 rounded-full ${gameState.readyStates[u.id] ? 'bg-green-500' : 'bg-gray-600'}`}
                                    title={u.name}
                                ></div>
                            ))}
                        </div>
                        {isHost && allReady && (
                            <button
                                onClick={handleNextPhase}
                                className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded transition duration-200 animate-bounce"
                            >
                                Show Results
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
