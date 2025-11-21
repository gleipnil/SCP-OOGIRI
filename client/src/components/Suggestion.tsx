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
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
            <div className="w-full max-w-2xl bg-gray-800 p-8 rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-purple-400">お題フェーズ</h2>
                    <div className={`text-xl font-mono ${timer.isBlinking ? 'animate-pulse text-red-500' : 'text-green-400'}`}>
                        Time: {Math.floor(timer.remaining / 60)}:{(timer.remaining % 60).toString().padStart(2, '0')}
                    </div>
                </div>

                {!isSubmitted ? (
                    <div>
                        <p className="text-gray-300 mb-4">お題となるキーワードを5個提案してください。</p>

                        <div className="flex gap-2 mb-4">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                                placeholder="キーワードを入力"
                                className="flex-1 p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-purple-500"
                            />
                            <button
                                onClick={handleAdd}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
                            >
                                追加
                            </button>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-sm font-bold text-gray-400 mb-2">あなたのお題 ({suggestions.length}/5)</h3>
                            <div className="flex flex-wrap gap-2">
                                {suggestions.map((s, i) => (
                                    <div key={i} className="bg-gray-700 px-3 py-1 rounded flex items-center gap-2">
                                        <span>{s}</span>
                                        <button onClick={() => removeSuggestion(i)} className="text-red-400 hover:text-red-300">×</button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={suggestions.length < 3}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded transition duration-200 disabled:opacity-50"
                        >
                            お題を送信
                        </button>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <div className="text-green-500 text-xl mb-4">✓ お題を送信しました</div>
                        <p className="text-gray-400">他のプレイヤーを待っています...</p>
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
                        次のフェーズへ
                    </button>
                )}
            </div>
        </div>
    );
}
