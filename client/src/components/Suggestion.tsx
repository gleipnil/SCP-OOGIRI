import React, { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { GameState } from '../types';

interface SuggestionProps {
    socket: Socket;
    gameState: GameState;
}

export default function Suggestion({ socket, gameState }: SuggestionProps) {
    const [input, setInput] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { timer } = gameState;

    // Check if we already submitted (recover state)
    useEffect(() => {
        if (socket.id && gameState.readyStates[socket.id]) {
            setIsSubmitted(true);
        }
    }, [gameState.readyStates, socket.id]);

    const handleAdd = () => {
        if (input.trim() && suggestions.length < 5) {
            setSuggestions([...suggestions, input.trim()]);
            setInput('');
        }
    };

    const removeSuggestion = (index: number) => {
        setSuggestions(suggestions.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        if (suggestions.length >= 3) {
            socket.emit('submit_suggestion', suggestions);
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
            <div className="w-full max-w-2xl border-2 border-scp-green bg-black/90 p-8 relative shadow-[0_0_20px_rgba(0,255,65,0.1)]">
                <div className="flex justify-between items-end mb-8 border-b border-scp-green pb-4">
                    <h2 className="text-2xl font-bold text-scp-green uppercase tracking-widest">
                        Protocol: Keyword Entry
                    </h2>
                    <div className={`text-xl font-bold ${timer.isBlinking ? 'text-scp-red animate-pulse' : 'text-scp-green'}`}>
                        T-{Math.floor(timer.remaining / 60)}:{(timer.remaining % 60).toString().padStart(2, '0')}
                    </div>
                </div>

                {!isSubmitted ? (
                    <div>
                        <p className="text-scp-green-dim mb-4 uppercase tracking-wider text-sm">
                            Input 5 keywords for database seeding.
                        </p>

                        <div className="flex gap-0 mb-6">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                                placeholder="INPUT DATA..."
                                className="flex-1 p-3 bg-black border border-scp-green text-scp-green placeholder-scp-green-dim focus:outline-none focus:bg-scp-green/10 uppercase"
                            />
                            <button
                                onClick={handleAdd}
                                className="bg-scp-green text-black font-bold py-2 px-6 hover:bg-white transition-colors duration-200 uppercase tracking-wider"
                            >
                                Add
                            </button>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-xs font-bold text-scp-green mb-2 uppercase tracking-widest border-b border-scp-green/30 pb-1">
                                Buffer Content ({suggestions.length}/5)
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {suggestions.map((s, i) => (
                                    <div key={i} className="border border-scp-green/50 px-3 py-1 flex items-center gap-2 bg-scp-green/5">
                                        <span className="text-scp-green uppercase">{s}</span>
                                        <button onClick={() => removeSuggestion(i)} className="text-scp-red hover:text-red-400 font-bold px-1">×</button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={suggestions.length < 3}
                            className="w-full bg-scp-green text-black font-bold py-3 px-4 uppercase tracking-widest hover:bg-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Upload Data
                        </button>
                    </div>
                ) : (
                    <div className="text-center py-8 border border-scp-green/30 bg-scp-green/5">
                        <div className="text-scp-green text-xl mb-4 uppercase tracking-widest animate-pulse">
                            {">> Data Upload Complete <<"}
                        </div>
                        <p className="text-scp-green-dim uppercase text-sm">Awaiting synchronization...</p>
                        <div className="mt-6 flex justify-center space-x-2">
                            {gameState.users.map(u => (
                                <div
                                    key={u.id}
                                    className={`w-3 h-3 ${gameState.readyStates[u.id] ? 'bg-scp-green shadow-[0_0_5px_#00ff41]' : 'bg-scp-border'}`}
                                    title={u.name}
                                ></div>
                            ))}
                        </div>
                    </div>
                )}

                {isHost && allReady && (
                    <button
                        onClick={handleNextPhase}
                        className="w-full mt-6 bg-scp-red text-black font-bold py-3 px-4 uppercase tracking-widest hover:bg-red-600 transition-colors duration-200"
                    >
                        Initiate Next Phase
                    </button>
                )}
            </div>
        </div>
    );
}
