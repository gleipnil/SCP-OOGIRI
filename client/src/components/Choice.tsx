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
            // If we had a way to know which ones were selected from server, we would set them here
            // But for now, we just show submitted state
        }
    }, [gameState.readyStates, socket.id]);

    if (!myReport) {
        return <div className="text-white">Loading your data...</div>;
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
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
            <div className="w-full max-w-4xl bg-gray-800 p-8 rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-purple-400">選択フェーズ</h2>
                    <div className={`text-xl font-mono ${timer.isBlinking ? 'animate-pulse text-red-500' : 'text-green-400'}`}>
                        Time: {Math.floor(timer.remaining / 60)}:{(timer.remaining % 60).toString().padStart(2, '0')}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Constraints Section */}
                    <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
                        <h3 className="text-xl font-bold mb-4 text-yellow-400">あなたの制約</h3>
                        <div className="mb-4">
                            <span className="block text-sm text-gray-400 uppercase tracking-wider">公開制約</span>
                            <ul className="list-disc list-inside text-lg font-medium">
                                {myReport.constraint.publicDescriptions.map((desc, i) => (
                                    <li key={i}>
                                        <span className="font-bold text-yellow-200">
                                            {["Object class", "SCPの性質", "観測時の特徴", "財団による対応"][i]}:
                                        </span> {desc}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="mb-4">
                            <span className="block text-sm text-gray-400 uppercase tracking-wider">非公開制約</span>
                            <p className="text-lg font-medium text-pink-400">{myReport.constraint.hiddenDescription}</p>
                            <p className="text-xs text-gray-500 mt-1">あなただけが見ることができます！</p>
                        </div>
                    </div>

                    {/* Keywords Selection Section */}
                    <div>
                        <h3 className="text-xl font-bold mb-4 text-blue-400">キーワードを3つ選択</h3>
                        <p className="text-gray-300 mb-4">
                            以下のリストから、レポートに使用するキーワードを3つ選んでください。
                        </p>
                        <div className="space-y-2">
                            {myReport.selectedKeywords.map((keyword, index) => (
                                <button
                                    key={index}
                                    onClick={() => toggleSelection(index)}
                                    disabled={isSubmitted}
                                    className={`w-full text-left p-3 rounded transition duration-200 flex justify-between items-center ${selectedIndices.includes(index)
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                                        } ${isSubmitted ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <span>{keyword}</span>
                                    {selectedIndices.includes(index) && <span>✓</span>}
                                </button>
                            ))}
                        </div>
                        <div className="mt-2 text-right text-sm text-gray-400">
                            選択済み: {selectedIndices.length}/3
                        </div>
                    </div>
                </div>

                {!isSubmitted ? (
                    <button
                        onClick={handleSubmit}
                        disabled={selectedIndices.length !== 3}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded transition duration-200 disabled:opacity-50"
                    >
                        選択を確定
                    </button>
                ) : (
                    <div className="text-center py-4">
                        <div className="text-green-500 text-xl mb-2">✓ 選択を確定しました</div>
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
                        className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded transition duration-200 animate-bounce"
                    >
                        執筆開始
                    </button>
                )}
            </div>
        </div>
    );
}
