import React from 'react';
import { Socket } from 'socket.io-client';
import { GameState } from '../types';
import { generateGameLogMarkdown } from '../utils/markdownGenerator';

interface ResultProps {
    socket: Socket;
    gameState: GameState;
}

export default function Result({ socket, gameState }: ResultProps) {
    const sortedUsers = [...gameState.users].sort((a, b) => b.score - a.score);
    const winner = sortedUsers[0];

    const handleDownloadLog = () => {
        const markdown = generateGameLogMarkdown(gameState);
        const blob = new Blob([markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `scp-game-log-${new Date().getTime()}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleBackToTitle = () => {
        socket.emit('next_phase'); // Server handles transition to LOBBY
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
            <div className="w-full max-w-4xl bg-gray-800 p-8 rounded-lg shadow-lg text-center">
                <h1 className="text-4xl font-bold text-yellow-400 mb-2">Game Over</h1>
                <p className="text-gray-400 mb-8">The results are in!</p>

                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">Final Ranking</h2>
                    <div className="space-y-4">
                        {sortedUsers.map((user, index) => (
                            <div
                                key={user.id}
                                className={`flex items-center justify-between p-4 rounded ${index === 0 ? 'bg-yellow-900 border border-yellow-600' : 'bg-gray-700'
                                    }`}
                            >
                                <div className="flex items-center">
                                    <span className={`font-bold text-xl w-8 ${index === 0 ? 'text-yellow-400' : 'text-gray-400'}`}>
                                        #{index + 1}
                                    </span>
                                    <span className="text-lg font-bold">{user.name}</span>
                                    {index === 0 && <span className="ml-2 text-yellow-400">👑 Winner!</span>}
                                </div>
                                <div className="text-2xl font-bold text-purple-400">
                                    {user.score} pts
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 justify-center">
                    <button
                        onClick={handleDownloadLog}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded transition duration-200 flex items-center justify-center gap-2"
                    >
                        <span>📥</span> Download Game Log (.md)
                    </button>

                    <button
                        onClick={handleBackToTitle}
                        className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded transition duration-200"
                    >
                        Back to Title
                    </button>
                </div>
            </div>
        </div>
    );
}
