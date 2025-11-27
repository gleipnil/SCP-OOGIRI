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
        <div className="flex flex-col items-center justify-center min-h-screen p-4 font-mono">
            <div className="w-full max-w-4xl border-2 border-scp-green bg-black/95 p-8 relative shadow-[0_0_20px_rgba(0,255,65,0.1)] text-center">
                <h1 className="text-4xl font-bold text-scp-green mb-2 uppercase tracking-widest border-b border-scp-green pb-4">
                    Mission Complete
                </h1>
                <p className="text-scp-green-dim mb-8 uppercase tracking-wider text-sm">
                    Final Evaluation Report
                </p>

                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-scp-green uppercase tracking-wider">Rankings</h2>
                    <div className="space-y-4">
                        {sortedUsers.map((user, index) => (
                            <div
                                key={user.id}
                                className={`flex items-center justify-between p-4 border ${index === 0 ? 'border-yellow-500 bg-yellow-500/10 shadow-[0_0_15px_rgba(234,179,8,0.2)]' : 'border-scp-green/30 bg-black'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <span className={`font-bold text-xl w-12 text-left ${index === 0 ? 'text-yellow-500' : 'text-scp-green-dim'}`}>
                                        #{index + 1}
                                    </span>
                                    <span className={`text-lg font-bold uppercase tracking-wider ${index === 0 ? 'text-yellow-500' : 'text-scp-green'}`}>
                                        {user.name}
                                    </span>
                                    {index === 0 && <span className="ml-2 text-yellow-500 text-xs border border-yellow-500 px-2 py-0.5 uppercase">Top Clearance</span>}
                                </div>
                                <div className="text-2xl font-bold text-scp-green">
                                    {user.score} <span className="text-xs text-scp-green-dim">PTS</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 justify-center">
                    <button
                        onClick={handleDownloadLog}
                        className="bg-scp-green text-black font-bold py-3 px-6 uppercase tracking-widest hover:bg-white transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                        <span>📥</span> Export Mission Log
                    </button>

                    <button
                        onClick={handleBackToTitle}
                        className="bg-transparent border border-scp-green text-scp-green font-bold py-3 px-6 uppercase tracking-widest hover:bg-scp-green hover:text-black transition-colors duration-200"
                    >
                        Return to Terminal
                    </button>
                </div>
            </div>
        </div>
    );
}
