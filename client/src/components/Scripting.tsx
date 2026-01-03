import React, { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { GameState } from '../types';
import PlayerStatusPanel from './PlayerStatusPanel';

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
        setTimeout(() => {
            setIsSubmitted(false);
            setContent('');
            setTitle('');
        }, 0);
    }, [phase]);

    // Recover submitted state
    useEffect(() => {
        if (socket.id && gameState.readyStates[socket.id]) {
            setTimeout(() => setIsSubmitted(true), 0);
        }
    }, [gameState.readyStates, socket.id]);

    if (!assignedReport) {
        return <div className="text-scp-green font-mono p-8 animate-pulse">Retrieving File...</div>;
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

    const myUser = gameState.users.find(u => u.id === socket.id);
    const isHost = myUser?.isHost;
    const allReady = gameState.users.every(u => gameState.readyStates[u.id]);
    const lang = myUser?.language || 'ja';

    const TEXT = {
        ja: {
            phase1: "フェーズ1: 特別収容プロトコル",
            phase2i: "フェーズ2: 説明 (初期)",
            phase2c: "フェーズ2: 説明 (完了)",
            phase3: "フェーズ3: 説明 (分析)",
            phase4: "フェーズ4: まとめ & 補足",
            defaultTitle: "執筆フェーズ",
            inst1: "特別収容プロトコルを記載せよ。",
            inst2i: "物理的特徴と基本的な性質を記述せよ。",
            inst2c: "物理的特徴、性質、および変則的影響を記述せよ。",
            inst3: "変則的な影響と実験記録を詳述せよ。",
            inst4: "結論/補遺を提供し、名称を指定せよ。",
            directives: "指令",
            keywords: "キーワード",
            publicClass: "公開情報",
            hiddenClass: "クリアランスレベル4以上公開（非公開情報）",
            currentFile: "現在のファイル",
            procedures: "特別収容プロトコル",
            desc1: "説明 (パート1)",
            desc: "説明",
            desc2: "説明 (パート2)",
            designation: "SCP指定名称 (タイトル)",
            enterDes: "名称を入力...",
            dataEntry: "データ入力",
            typing: "入力を開始...",
            submit: "エントリを送信",
            submitted: "エントリ送信済み",
            awaiting: "チームの同期を待機中...",
            modify: "エントリを修正",
            proceed: "次のフェーズへ進行",
            headers: ["オブジェクトクラス", "性質", "観測特徴", "財団の対応"]
        },
        en: {
            phase1: "Phase 1: Containment Procedures",
            phase2i: "Phase 2: Description (Initial)",
            phase2c: "Phase 2: Description (Complete)",
            phase3: "Phase 3: Description (Analysis)",
            phase4: "Phase 4: Conclusion & Designation",
            defaultTitle: "Writing Phase",
            inst1: "Draft Special Containment Procedures.",
            inst2i: "Describe physical appearance and basic properties.",
            inst2c: "Describe physical appearance, properties, and anomalous effects.",
            inst3: "Detail anomalous effects and test logs.",
            inst4: "Provide conclusion/addendum and assign designation.",
            directives: "Directives",
            keywords: "Keywords",
            publicClass: "Public Classification",
            hiddenClass: "Clearance Level 4",
            currentFile: "Current File",
            procedures: "Special Containment Procedures",
            desc1: "Description (Part 1)",
            desc: "Description",
            desc2: "Description (Part 2)",
            designation: "SCP Designation (Title)",
            enterDes: "ENTER DESIGNATION...",
            dataEntry: "Data Entry",
            typing: "Begin typing...",
            submit: "Submit Entry",
            submitted: "Entry Submitted",
            awaiting: "Awaiting team synchronization...",
            modify: "Modify Entry",
            proceed: "Proceed to Next Phase",
            headers: ["Object Class", "Properties", "Observation", "Containment"]
        }
    };

    const getPhaseTitle = () => {
        if (gameState.users.length === 3 && phase === 'SCRIPTING_2') {
            return TEXT[lang].phase2c;
        }
        switch (phase) {
            case 'SCRIPTING_1': return TEXT[lang].phase1;
            case 'SCRIPTING_2': return TEXT[lang].phase2i;
            case 'SCRIPTING_3': return TEXT[lang].phase3;
            case 'SCRIPTING_4': return TEXT[lang].phase4;
            default: return TEXT[lang].defaultTitle;
        }
    };

    const getInstruction = () => {
        if (gameState.users.length === 3 && phase === 'SCRIPTING_2') {
            return TEXT[lang].inst2c;
        }
        switch (phase) {
            case 'SCRIPTING_1': return TEXT[lang].inst1;
            case 'SCRIPTING_2': return TEXT[lang].inst2i;
            case 'SCRIPTING_3': return TEXT[lang].inst3;
            case 'SCRIPTING_4': return TEXT[lang].inst4;
            default: return '';
        }
    };

    const handleNextPhase = () => {
        socket.emit('next_phase');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 font-mono">
            <div className="w-full max-w-7xl border-2 border-scp-green bg-black/95 p-6 relative shadow-[0_0_20px_rgba(0,255,65,0.1)] flex flex-col md:flex-row gap-6 h-[90vh]">

                {/* Left Panel: Context (Constraints & Previous Parts) */}
                <div className="w-full md:w-1/3 space-y-6 overflow-y-auto pr-2 border-r border-scp-green/30 custom-scrollbar">
                    <div className="border border-scp-green/50 p-4 bg-scp-green/5">
                        <h3 className="text-lg font-bold text-scp-green mb-4 uppercase border-b border-scp-green/30 pb-1">
                            {TEXT[lang].directives}
                        </h3>
                        <div className="mb-4">
                            <span className="text-xs text-scp-green-dim uppercase tracking-widest">{TEXT[lang].keywords}</span>
                            <div className="mt-1 text-sm text-scp-text font-bold border border-scp-green/30 p-2 bg-black">
                                {assignedReport.selectedKeywords.join(', ')}
                            </div>
                        </div>
                        <div className="mb-4">
                            <span className="text-xs text-scp-green-dim uppercase tracking-widest">{TEXT[lang].publicClass}</span>
                            <ul className="space-y-2 mt-2">
                                {assignedReport.constraint.publicDescriptions.map((desc, i) => (
                                    <li key={i} className="text-xs">
                                        <span className="font-bold text-scp-green uppercase block mb-1">
                                            {TEXT[lang].headers[i]}
                                        </span>
                                        <span className="text-scp-text block pl-2 border-l border-scp-green/30">
                                            {desc[lang]}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {phase === 'SCRIPTING_4' && (
                            <div className="border border-scp-red/50 bg-scp-red/10 p-3 mt-4">
                                <span className="text-xs text-scp-red uppercase tracking-widest block mb-1">{TEXT[lang].hiddenClass}</span>
                                <p className="font-bold text-scp-red animate-pulse text-sm">{assignedReport.constraint.hiddenDescription[lang]}</p>
                            </div>
                        )}
                    </div>

                    <div className="border border-scp-green/50 p-4 bg-scp-green/5 space-y-4">
                        <h3 className="text-lg font-bold text-scp-green uppercase border-b border-scp-green/30 pb-1">
                            {TEXT[lang].currentFile}
                        </h3>
                        {phase !== 'SCRIPTING_1' && (
                            <div>
                                <h4 className="text-xs font-bold text-scp-green-dim uppercase mb-1">{TEXT[lang].procedures}</h4>
                                <div className="text-sm bg-black border border-scp-green/30 p-3 text-scp-text whitespace-pre-wrap font-mono">
                                    {assignedReport.containmentProcedures}
                                </div>
                            </div>
                        )}

                        {(phase === 'SCRIPTING_3' || (phase === 'SCRIPTING_4' && gameState.users.length === 4)) && (
                            <div>
                                <h4 className="text-xs font-bold text-scp-green-dim uppercase mb-1">{TEXT[lang].desc1}</h4>
                                <div className="text-sm bg-black border border-scp-green/30 p-3 text-scp-text whitespace-pre-wrap font-mono">
                                    {assignedReport.descriptionEarly}
                                </div>
                            </div>
                        )}

                        {phase === 'SCRIPTING_4' && gameState.users.length === 3 && (
                            <div>
                                <h4 className="text-xs font-bold text-scp-green-dim uppercase mb-1">{TEXT[lang].desc}</h4>
                                <div className="text-sm bg-black border border-scp-green/30 p-3 text-scp-text whitespace-pre-wrap font-mono">
                                    {assignedReport.descriptionEarly}
                                </div>
                            </div>
                        )}

                        {phase === 'SCRIPTING_4' && gameState.users.length === 4 && (
                            <div>
                                <h4 className="text-xs font-bold text-scp-green-dim uppercase mb-1">{TEXT[lang].desc2}</h4>
                                <div className="text-sm bg-black border border-scp-green/30 p-3 text-scp-text whitespace-pre-wrap font-mono">
                                    {assignedReport.descriptionLate}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel: Writing Area */}
                <div className="w-full md:w-2/3 flex flex-col h-full">



                    <div className="flex justify-between items-end mb-6 border-b border-scp-green pb-4">
                        <h2 className="text-2xl font-bold text-scp-green uppercase tracking-widest">{getPhaseTitle()}</h2>
                        <div className="flex items-end">
                            <PlayerStatusPanel gameState={gameState} myId={socket.id} />
                            <div className={`text-xl font-bold ml-6 ${timer.isBlinking ? 'text-scp-red animate-pulse' : 'text-scp-green'}`}>
                                T-{Math.floor(timer.remaining / 60)}:{(timer.remaining % 60).toString().padStart(2, '0')}
                            </div>
                        </div>
                    </div>

                    <p className="text-scp-green-dim mb-4 uppercase text-sm tracking-wider">{getInstruction()}</p>

                    {!isSubmitted ? (
                        <div className="flex-1 flex flex-col gap-4 min-h-0">
                            {phase === 'SCRIPTING_4' && (
                                <div>
                                    <label className="block text-xs text-scp-green uppercase tracking-widest mb-2">{TEXT[lang].designation}</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full min-w-0 box-border p-3 bg-black border border-scp-green text-scp-green placeholder-scp-green-dim focus:outline-none focus:bg-scp-green/10 uppercase font-mono"
                                        placeholder={TEXT[lang].enterDes}
                                    />
                                </div>
                            )}
                            <div className="flex-1 flex flex-col min-h-0">
                                <label className="block text-xs text-scp-green uppercase tracking-widest mb-2">{TEXT[lang].dataEntry}</label>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="flex-1 w-full min-w-0 box-border p-4 bg-black border border-scp-green text-scp-green placeholder-scp-green-dim focus:outline-none focus:bg-scp-green/5 resize-none font-mono leading-relaxed"
                                    placeholder={TEXT[lang].typing}
                                />
                            </div>
                            <button
                                onClick={handleSubmit}
                                disabled={!content.trim() || (phase === 'SCRIPTING_4' && !title.trim())}
                                className="w-full bg-scp-green text-black font-bold py-4 px-6 uppercase tracking-widest hover:bg-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                            >
                                {TEXT[lang].submit}
                            </button>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center border border-scp-green/30 bg-scp-green/5">
                            <div className="text-scp-green text-xl mb-4 uppercase tracking-widest animate-pulse">
                                {">> " + TEXT[lang].submitted + " <<"}
                            </div>
                            <p className="text-scp-green-dim uppercase text-sm mb-6">{TEXT[lang].awaiting}</p>

                            <button
                                onClick={() => {
                                    socket.emit('cancel_submission');
                                    setIsSubmitted(false);
                                }}
                                className="bg-scp-green text-black font-bold py-2 px-6 uppercase tracking-widest hover:bg-white transition-colors duration-200 mb-6"
                            >
                                {TEXT[lang].modify}
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
                                    className="mt-8 bg-scp-red text-black font-bold py-4 px-6 uppercase tracking-widest hover:bg-red-600 transition-colors duration-200"
                                >
                                    {TEXT[lang].proceed}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
