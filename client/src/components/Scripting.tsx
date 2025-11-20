import React, { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { GameState, GamePhase } from '../types';

interface ScriptingProps {
    socket: Socket;
    gameState: GameState;
}

export default function Scripting({ socket, gameState }: ScriptingProps) {
    const [content, setContent] = useState('');
    const [title, setTitle] = useState(''); // Only for phase 4
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { timer, phase } = gameState;

    // Determine which report I am assigned to
    const myUserIndex = gameState.users.findIndex(u => u.id === socket.id);
    const userCount = gameState.users.length;

    let offset = 0;
    if (phase === 'SCRIPTING_1') offset = 1;
    if (phase === 'SCRIPTING_2') offset = 2;
    if (phase === 'SCRIPTING_3') offset = 3;
    if (phase === 'SCRIPTING_4') offset = 0;

    const assignedReportIndex = (myUserIndex - offset + userCount) % userCount;
    const assignedReport = gameState.reports[assignedReportIndex];

    // Reset state on phase change
    useEffect(() => {
        setIsSubmitted(false);
        setContent('');
        setTitle('');
    }, [phase]);

    // Recover submitted state
    useEffect(() => {
        if (socket.id && gameState.readyStates[socket.id]) {
            setIsSubmitted(true);
        }
    }, [gameState.readyStates, socket.id]);

    if (!assignedReport) {
        return <div className="text-white">Loading assignment...</div>;
    }

    const handleSubmit = () => {
        if (phase === 'SCRIPTING_4') {
            if (content.trim() && title.trim()) {
                socket.emit('submit_script', JSON.stringify({ title, conclusion: content }));
                setIsSubmitted(true);
            }
        } else {
            if (content.trim()) {
                socket.emit('submit_script', content);
                setIsSubmitted(true);
            }
        }
    };

    const handleNextPhase = () => {
        socket.emit('next_phase');
    };

    const myUser = gameState.users.find(u => u.id === socket.id);
    const isHost = myUser?.isHost;
    const allReady = gameState.users.every(u => gameState.readyStates[u.id]);

    const getPhaseTitle = () => {
        switch (phase) {
            case 'SCRIPTING_1': return 'Phase 1: Containment Procedures';
            case 'SCRIPTING_2': return 'Phase 2: Description (Early)';
            case 'SCRIPTING_3': return 'Phase 3: Description (Late)';
            case 'SCRIPTING_4': return 'Phase 4: Conclusion & Title';
            default: return 'Scripting Phase';
        }
    };

    const getInstruction = () => {
        switch (phase) {
            case 'SCRIPTING_1': return 'Write the Special Containment Procedures for this object.';
            case 'SCRIPTING_2': return 'Write the first part of the Description (Appearance, basic properties).';
            case 'SCRIPTING_3': return 'Write the second part of the Description (Anomalous effects, experiments).';
            case 'SCRIPTING_4': return 'Write the Conclusion/Addendum and give the object a Title.';
            default: return '';
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
            <div className="w-full max-w-6xl bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col md:flex-row gap-6">

                {/* Left Panel: Context (Constraints & Previous Parts) */}
                <div className="w-full md:w-1/3 space-y-6 overflow-y-auto max-h-[80vh] pr-2">
                    <div className="bg-gray-700 p-4 rounded border border-gray-600">
                        <h3 className="text-lg font-bold text-yellow-400 mb-2">Constraints</h3>
                        <div className="mb-2">
                            <span className="text-xs text-gray-400 uppercase">Keywords</span>
                            <div className="mt-1 text-sm text-blue-200 font-medium">
                                {assignedReport.selectedKeywords.join(', ')}
                            </div>
                        </div>
                        <div className="mb-2">
                            <span className="text-xs text-gray-400 uppercase">Public Constraints</span>
                            <ul className="list-disc list-inside font-medium text-sm">
                                {assignedReport.constraint.publicDescriptions.map((desc, i) => (
                                    <li key={i}>
                                        <span className="font-bold text-yellow-200">
                                            {["Object class", "SCPの性質", "観測時の特徴", "財団による対応"][i]}:
                                        </span> {desc}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {phase === 'SCRIPTING_4' && (
                            <div>
                                <span className="text-xs text-gray-400 uppercase">Hidden Constraint</span>
                                <p className="font-medium text-pink-400">{assignedReport.constraint.hiddenDescription}</p>
                            </div>
                        )}
                    </div>

                    <div className="bg-gray-700 p-4 rounded border border-gray-600 space-y-4">
                        <h3 className="text-lg font-bold text-blue-400">Current Report</h3>

                        {phase !== 'SCRIPTING_1' && (
                            <div>
                                <h4 className="text-sm font-bold text-gray-400">Special Containment Procedures</h4>
                                <p className="text-sm bg-gray-800 p-2 rounded mt-1 whitespace-pre-wrap">{assignedReport.containmentProcedures}</p>
                            </div>
                        )}

                        {(phase === 'SCRIPTING_3' || phase === 'SCRIPTING_4') && (
                            <div>
                                <h4 className="text-sm font-bold text-gray-400">Description (Part 1)</h4>
                                <p className="text-sm bg-gray-800 p-2 rounded mt-1 whitespace-pre-wrap">{assignedReport.descriptionEarly}</p>
                            </div>
                        )}

                        {phase === 'SCRIPTING_4' && (
                            <div>
                                <h4 className="text-sm font-bold text-gray-400">Description (Part 2)</h4>
                                <p className="text-sm bg-gray-800 p-2 rounded mt-1 whitespace-pre-wrap">{assignedReport.descriptionLate}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel: Writing Area */}
                <div className="w-full md:w-2/3 flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-purple-400">{getPhaseTitle()}</h2>
                        <div className={`text-xl font-mono ${timer.isBlinking ? 'animate-pulse text-red-500' : 'text-green-400'}`}>
                            {Math.floor(timer.remaining / 60)}:{(timer.remaining % 60).toString().padStart(2, '0')}
                        </div>
                    </div>

                    <p className="text-gray-300 mb-4">{getInstruction()}</p>

                    {!isSubmitted ? (
                        <div className="flex-1 flex flex-col gap-4">
                            {phase === 'SCRIPTING_4' && (
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">SCP Title (e.g. "The Weeping Angel")</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-purple-500"
                                        placeholder="Enter Title"
                                    />
                                </div>
                            )}
                            <div className="flex-1">
                                <label className="block text-sm text-gray-400 mb-1">Content</label>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="w-full h-64 p-4 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-purple-500 resize-none font-mono"
                                    placeholder="Write here..."
                                />
                            </div>
                            <button
                                onClick={handleSubmit}
                                disabled={!content.trim() || (phase === 'SCRIPTING_4' && !title.trim())}
                                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded transition duration-200 disabled:opacity-50"
                            >
                                Submit
                            </button>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center bg-gray-800 rounded border border-gray-700">
                            <div className="text-green-500 text-xl mb-4">✓ Submitted</div>
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
                                    className="mt-8 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded transition duration-200 animate-bounce"
                                >
                                    Next Phase
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
