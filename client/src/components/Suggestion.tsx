import React, { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { GameState } from '../types';

interface SuggestionProps {
    socket: Socket;
    gameState: GameState;
}

export default function Suggestion({ socket, gameState }: SuggestionProps) {
    const [keywords, setKeywords] = useState<string[]>(['', '', '', '', '']);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { timer } = gameState;

    // Check if we already submitted (recover state)
    useEffect(() => {
        if (socket.id && gameState.readyStates[socket.id]) {
            setIsSubmitted(true);
        }
    }, [gameState.readyStates, socket.id]);

    const handleChange = (index: number, value: string) => {
        const newKeywords = [...keywords];
        newKeywords[index] = value;
        setKeywords(newKeywords);
    };

    const handleSubmit = () => {
        if (keywords.every(k => k.trim())) {
            socket.emit('submit_suggestion', keywords);
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
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
            <div className="w-full max-w-2xl bg-gray-800 p-8 rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-purple-400">Suggestion Phase</h2>
                    <div className={`text-xl font-mono ${timer.isBlinking ? 'animate-pulse text-red-500' : 'text-green-400'}`}>
                        Time: {Math.floor(timer.remaining / 60)}:{(timer.remaining % 60).toString().padStart(2, '0')}
                    </div>
                </div>

                <p className="mb-6 text-gray-300">
                    Enter 5 keywords or phrases that will be used as inspiration for the SCP reports.
                </p>

                {!isSubmitted ? (
                    <div className="space-y-4 mb-8">
                        {keywords.map((keyword, index) => (
                            <div key={index} className="flex items-center">
                                <span className="w-8 text-gray-500 font-bold">{index + 1}.</span>
                                <input
                                    type="text"
                                    value={keyword}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    placeholder={`Keyword ${index + 1}`}
                                    className="flex-1 p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-purple-500"
                                />
                            </div>
                        ))}
                        <button
                            onClick={handleSubmit}
                            disabled={keywords.some(k => !k.trim())}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded transition duration-200 disabled:opacity-50"
                        >
                            Submit Keywords
                        </button>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-green-500 text-xl mb-4">✓ Keywords Submitted</div>
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
                    </div>
                )}

                {isHost && allReady && (
                    <button
                        onClick={handleNextPhase}
                        className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded transition duration-200 animate-bounce"
                    >
                        Go to Next Phase
                    </button>
                )}
            </div>
        </div>
    );
}
