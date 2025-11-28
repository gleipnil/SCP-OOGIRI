import React from 'react';

export default function InstructionPage() {
    return (
        <div className="min-h-screen bg-black text-scp-green font-mono p-8 relative overflow-hidden">
            <div className="max-w-4xl mx-auto border-2 border-scp-green p-8 bg-black/90 shadow-[0_0_20px_rgba(0,255,65,0.1)] relative">
                {/* Decorative corners */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-scp-green -mt-1 -ml-1"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-scp-green -mt-1 -mr-1"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-scp-green -mb-1 -ml-1"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-scp-green -mb-1 -mr-1"></div>

                <div className="flex justify-end mb-6">
                    <a
                        href="/instructions"
                        className="group inline-flex items-center gap-2 px-3 py-1 border border-scp-green/30 text-scp-green-dim text-xs uppercase tracking-widest hover:bg-scp-green/10 hover:text-scp-green hover:border-scp-green transition-all duration-300"
                    >
                        <span className="group-hover:animate-pulse">▶</span>
                        Switch to English
                    </a>
                </div>

                <h1 className="text-4xl font-bold mb-8 text-center text-scp-green uppercase tracking-widest border-b-2 border-scp-green pb-4">
                    SCP収容報告書記載プロトコル
                    <span className="block text-sm mt-2 text-scp-green-dim">Operational Manual v1.0 (JP)</span>
                </h1>

                <div className="space-y-8 text-scp-text">
                    <section>
                        <h2 className="text-2xl font-bold text-scp-green mb-4 uppercase tracking-wider border-l-4 border-scp-green pl-4">
                            1. 背景 (Operational Context)
                        </h2>
                        <p className="leading-relaxed">
                            あなたは、SCP財団の下級職員です。上司から、新たにSCP報告書の作成を命じられましたが、断片的な情報しか手元に無く、完全な報告書を記載することができません。しかし幸いなことに、一緒に働く同僚が、そのSCPについて部分的に知っているようです！仲間たちと協力して、完璧なSCP収容報告書を書き上げ、上司に報告し、最高の評価を手に入れましょう。
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-scp-green mb-4 uppercase tracking-wider border-l-4 border-scp-green pl-4">
                            2. 目的 (Objective)
                        </h2>
                        <p className="leading-relaxed">
                            皆が選んだ単語や、上位クリアランスから提供されたお題に従って、皆で連作してSCP報告書を書き上げましょう。もっとも完璧に、もっとも美しい報告書を書き上げ、最高の評価を得た職員が勝利となります。
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-scp-green mb-4 uppercase tracking-wider border-l-4 border-scp-green pl-4">
                            3. プロトコル手順 (Protocol Sequence)
                        </h2>

                        <div className="space-y-6">
                            <div className="border border-scp-green/30 p-4 bg-scp-green/5">
                                <h3 className="text-xl font-bold text-scp-green mb-2">Phase 0: エントランス</h3>
                                <p>ログイン後、部屋の選択画面になります。新規に部屋を立てるか、既存の部屋に参加できます（最大4部屋）。</p>
                            </div>

                            <div className="border border-scp-green/30 p-4 bg-scp-green/5">
                                <h3 className="text-xl font-bold text-scp-green mb-2">Phase 1: ロビー (Lobby)</h3>
                                <p>参加者が揃うまでの待機場所です。最初に入った人がADMINとなり、ゲーム進行を行います。</p>
                            </div>

                            <div className="border border-scp-green/30 p-4 bg-scp-green/5">
                                <h3 className="text-xl font-bold text-scp-green mb-2">Phase 2: キーワード提案 (Suggestion)</h3>
                                <p>ゲームで使用するお題となる単語を5つ入力してください。地球上に存在する物体を推奨します（概念や感情は避けてください）。</p>
                            </div>

                            <div className="border border-scp-green/30 p-4 bg-scp-green/5">
                                <h3 className="text-xl font-bold text-scp-green mb-2">Phase 3: キーワード・制約選択 (Choice)</h3>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>配布された5つの単語から3つを選択します。</li>
                                    <li><strong>公開制約</strong>（オブジェクトクラス、性質など）を確認します。</li>
                                    <li><strong>非公開制約</strong>（あなただけが知る秘密のルール）を記憶します。</li>
                                </ul>
                                <p className="mt-2 text-xs text-scp-green-dim">※最終的にあなたが担当する報告書はこの条件になります。</p>
                            </div>

                            <div className="border border-scp-green/30 p-4 bg-scp-green/5">
                                <h3 className="text-xl font-bold text-scp-green mb-2">Phase 4: 執筆 (Scripting)</h3>
                                <p className="mb-2">リレー形式で報告書を執筆します（4人プレイ: 4パート / 3人プレイ: 3パート）。</p>
                                <ol className="list-decimal list-inside space-y-1 ml-4 text-scp-green-dim">
                                    <li><strong className="text-scp-green">特別収容プロトコル:</strong> 封じ込め方法。</li>
                                    <li><strong className="text-scp-green">説明・前半:</strong> 外見や基本的性質。</li>
                                    <li><strong className="text-scp-green">説明・後半:</strong> 実験記録や異常性の詳細。</li>
                                    <li><strong className="text-scp-green">結論・タイトル:</strong> 補遺、結論、SCPタイトル決定。</li>
                                </ol>
                                <p className="mt-2 text-xs text-scp-green-dim">※3人プレイの場合、説明の前半・後半は統合されます。</p>
                            </div>

                            <div className="border border-scp-green/30 p-4 bg-scp-green/5">
                                <h3 className="text-xl font-bold text-scp-green mb-2">Phase 5 & 6: 発表・投票 (Review & Voting)</h3>
                                <p>完成したレポートが公開されます。最も良いと思った報告書に投票し、非公開制約を満たしているかチェックしてください。</p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-scp-green mb-4 uppercase tracking-wider border-l-4 border-scp-green pl-4">
                            4. 評価基準 (Scoring Metrics)
                        </h2>
                        <ul className="list-none space-y-2">
                            <li className="flex justify-between border-b border-scp-green/30 pb-1">
                                <span>ベストレポート得票数</span>
                                <span className="font-bold text-scp-green">10 pts / 票</span>
                            </li>
                            <li className="flex justify-between border-b border-scp-green/30 pb-1">
                                <span>非公開制約達成 (オーナー)</span>
                                <span className="font-bold text-scp-green">20 pts</span>
                            </li>
                            <li className="flex justify-between border-b border-scp-green/30 pb-1">
                                <span>非公開制約達成 (協力者)</span>
                                <span className="font-bold text-scp-green">5 pts</span>
                            </li>
                        </ul>
                    </section>
                </div>

                <div className="mt-12 text-center">
                    <p className="text-xs text-scp-green-dim uppercase tracking-widest mb-4">
                        SECURE. CONTAIN. PROTECT.
                    </p>
                    <div className="inline-block border border-scp-red text-scp-red px-4 py-1 text-sm font-bold uppercase animate-pulse">
                        Clearance Verified
                    </div>
                </div>
            </div>
        </div>
    );
}
