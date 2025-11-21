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
        return <div className="text-white">Loading presentation...</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
            <div className="w-full max-w-4xl bg-gray-800 p-8 rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-purple-400">発表フェーズ</h2>
                    <div className="text-gray-400">
                        レポート {currentPresentationIndex + 1} / {reports.length}
                    </div>
                </div>

                <div className="bg-black p-8 rounded border border-gray-700 font-mono text-gray-300 space-y-6 max-h-[70vh] overflow-y-auto">
                    <div className="border-b border-gray-700 pb-4">
                        <h1 className="text-3xl font-bold text-white mb-2">SCP-XXXX: {currentReport.title || "Untitled"}</h1>
                        <p className="text-sm text-gray-500">執筆者: {owner?.name || "Unknown"}</p>
                    </div>

                    {/* Constraints Info (Revealed now) */}
                    <div className="bg-gray-900 p-4 rounded border border-gray-800">
                        <h3 className="text-sm font-bold text-yellow-500 mb-2 uppercase tracking-wider">機密解除情報</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <span className="text-xs text-gray-500 uppercase">公開制約</span>
                                <ul className="list-disc list-inside text-white text-sm">
                                    {currentReport.constraint.publicDescriptions.map((desc, i) => (
                                        <li key={i}>
                                            <span className="font-bold text-yellow-200">
                                                {["Object class", "SCPの性質", "観測時の特徴", "財団による対応"][i]}:
                                            </span> {desc}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <span className="text-xs text-gray-500 uppercase">非公開制約</span>
                                <p className="text-pink-400">{currentReport.constraint.hiddenDescription}</p>
                            </div>
                            <div className="col-span-full">
                                <span className="text-xs text-gray-500 uppercase">キーワード</span>
                                <div className="mt-1 text-sm text-blue-200 font-medium">
                                    {currentReport.selectedKeywords.join(', ')}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-bold text-white uppercase">特別収容プロトコル</h3>
                            <p className="whitespace-pre-wrap">{currentReport.containmentProcedures}</p>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-white uppercase">説明</h3>
                            <p className="whitespace-pre-wrap mb-4">{currentReport.descriptionEarly}</p>
                            <p className="whitespace-pre-wrap">{currentReport.descriptionLate}</p>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-white uppercase">補遺 / 結論</h3>
                            <p className="whitespace-pre-wrap">{currentReport.conclusion}</p>
                        </div>
                    </div>
                </div>

                {isHost && (
                    <button
                        onClick={handleNext}
                        className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded transition duration-200"
                    >
                        {currentPresentationIndex < reports.length - 1 ? "次のレポート" : "投票へ進む"}
                    </button>
                )}
            </div>
        </div>
    );
}
