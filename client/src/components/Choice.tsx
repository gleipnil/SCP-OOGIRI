import React, { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { GameState } from '../types';

interface ChoiceProps {
    socket: Socket;
    gameState: GameState;
}

export default function Choice({ socket, gameState }: ChoiceProps) {
    const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { timer } = gameState;

    const myReport = gameState.reports.find(r => r.ownerId === socket.id);

    // Recover state
    useEffect(() => {
        if (socket.id && gameState.readyStates[socket.id]) {
            setIsSubmitted(true);
        }
    }, [gameState.readyStates, socket.id]);

    if (!myReport) {
        return <div className="text-scp-green font-mono p-8 animate-pulse">Accessing Database...</div>;
    }

    const toggleSelection = (index: number) => {
        if (isSubmitted) return;

        if (selectedIndices.includes(index)) {
            setSelectedIndices(selectedIndices.filter(i => i !== index));
        } else {
            if (selectedIndices.length < 3) {
                setSelectedIndices([...selectedIndices, index]);
            }
        }
    };

    const handleSubmit = () => {
        if (selectedIndices.length === 3) {
            const selectedKeywords = selectedIndices.map(i => myReport.selectedKeywords[i]);
            socket.emit('submit_choice', selectedKeywords);
            setIsSubmitted(true);
        }
    };

    const handleNextPhase = () => {
        socket.emit('next_phase');
    };

    const myUser = gameState.users.find(u => u.id === socket.id);
    const isHost = myUser?.isHost;
    const allReady = gameState.users.every(u => gameState.readyStates[u.id]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 font-mono">
            <div className="w-full max-w-5xl border-2 border-scp-green bg-black/90 p-8 relative shadow-[0_0_20px_rgba(0,255,65,0.1)]">
                <div className="flex justify-between items-end mb-8 border-b border-scp-green pb-4">
                    <h2 className="text-2xl font-bold text-scp-green uppercase tracking-widest">
                        Protocol: Constraint Selection
                    </h2>
                    <div className={`text-xl font-bold ${timer.isBlinking ? 'text-scp-red animate-pulse' : 'text-scp-green'}`}>
                        T-{Math.floor(timer.remaining / 60)}:{(timer.remaining % 60).toString().padStart(2, '0')}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Constraints Section */}
                    <div className="border border-scp-green/50 p-6 bg-scp-green/5 relative">
                        <div className="absolute top-0 left-0 bg-scp-green text-black text-xs px-2 py-1 font-bold uppercase">
                            Assigned Constraints
                        </div>
                        <h3 className="text-xl font-bold mb-6 text-scp-green mt-4 uppercase tracking-wider">
                            Directives
                        </h3>
                        <div className="mb-6">
                            <span className="block text-xs text-scp-green-dim uppercase tracking-widest mb-2 border-b border-scp-green/30 pb-1">
                                Public Classification
                            </span>
                            <ul className="space-y-3 text-sm">
                                {myReport.constraint.publicDescriptions.map((desc, i) => (
                                    <li key={i} className="flex flex-col">
                                        <span className="font-bold text-scp-green uppercase text-xs">
                                            {["Object Class", "Properties", "Observation", "Containment"][i]}
                                        </span>
                                        <span className="text-scp-text pl-2 border-l-2 border-scp-green/30">
                                            {desc}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="mb-4">
                            <span className="block text-xs text-scp-green-dim uppercase tracking-widest mb-2 border-b border-scp-green/30 pb-1">
                                Clearance Level 4 Only
                            </span>
                            <div className="border border-scp-red/50 bg-scp-red/10 p-3">
                                <p className="text-lg font-bold text-scp-red animate-pulse">{myReport.constraint.hiddenDescription}</p>
                                <p className="text-xs text-scp-red mt-2 uppercase tracking-widest">
                                    [EYES ONLY]
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Keywords Selection Section */}
                    <div>
                        <h3 className="text-xl font-bold mb-4 text-scp-green uppercase tracking-wider">
                            Select 3 Keywords
                        </h3>
                        <p className="text-scp-green-dim mb-6 text-sm uppercase">
                            Identify critical data points for report generation.
                        </p>
                        <div className="space-y-3">
                            {myReport.selectedKeywords.map((keyword, index) => (
                                <button
                                    key={index}
                                    onClick={() => toggleSelection(index)}
                                    disabled={isSubmitted}
                                    className={`w-full text-left p-4 border transition-all duration-200 flex justify-between items-center group ${selectedIndices.includes(index)
                                        ? 'bg-scp-green text-black border-scp-green font-bold shadow-[0_0_10px_rgba(0,255,65,0.3)]'
                                        : 'bg-black text-scp-green border-scp-green/30 hover:border-scp-green hover:bg-scp-green/10'
                                        } ${isSubmitted ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <span className="uppercase tracking-wider">{keyword}</span>
                                    {selectedIndices.includes(index) && <span className="font-bold">[SELECTED]</span>}
                                </button>
                            ))}
                        </div>
                        <div className="mt-4 text-right text-sm text-scp-green font-bold">
                            SELECTED: {selectedIndices.length}/3
                        </div>
                    </div>
                </div>

                {!isSubmitted ? (
                    <button
                        onClick={handleSubmit}
                        disabled={selectedIndices.length !== 3}
                        className="w-full bg-scp-green text-black font-bold py-4 px-6 uppercase tracking-widest hover:bg-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-transparent hover:border-scp-green"
                    >
                        Confirm Selection
                    </button>
                ) : (
                    <div className="text-center py-8 border border-scp-green/30 bg-scp-green/5">
                        <div className="text-scp-green text-xl mb-4 uppercase tracking-widest animate-pulse">
                            {">> Selection Confirmed <<"}
                        </div>
                        <p className="text-scp-green-dim uppercase text-sm mb-6">Awaiting team synchronization...</p>

                        <button
                            onClick={() => {
                                socket.emit('cancel_submission');
                                setIsSubmitted(false);
                            }}
                            className="bg-scp-green text-black font-bold py-2 px-6 uppercase tracking-widest hover:bg-white transition-colors duration-200 mb-6"
                        >
                            Modify Selection
                        </button>

                        <div className="flex justify-center space-x-2">
                            {gameState.users.map(u => (
                                <div
                                    key={u.id}
                                    className={`w-3 h-3 ${gameState.readyStates[u.id] ? 'bg-scp-green shadow-[0_0_5px_#00ff41]' : 'bg-scp-border'}`}
                                    title={u.name}
                                ></div>
                            ))}
                        </div>
                        {isHost && allReady && (
                            <button
                                onClick={handleNextPhase}
                                className="w-full mt-8 bg-scp-red text-black font-bold py-3 px-4 uppercase tracking-widest hover:bg-red-600 transition-colors duration-200"
                            >
                                Initiate Writing Phase
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
