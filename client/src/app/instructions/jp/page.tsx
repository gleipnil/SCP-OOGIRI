import React from 'react';

export default function InstructionsPageJP() {
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
                    SCP 収容報告書記載ゲーム
                    <span className="block text-sm mt-2 text-scp-green-dim">Operational Manual v1.0 (JP)</span>
                </h1>

                <div className="space-y-8 text-scp-text">
                    <section>
                        <h2 className="text-2xl font-bold text-scp-green mb-4 uppercase tracking-wider border-l-4 border-scp-green pl-4">
                            1. ゲームの背景
                        </h2>
                        <p className="leading-relaxed">
                            あなたは、SCP財団の下級職員です。上司から、新たにSCP報告書の作成を命じられましたが、断片的な情報しか手元に無く、完全な報告書を記載することができません。
                            しかし幸いなことに、一緒に働く同僚が、そのSCPについて部分的に知っているようです！
                            仲間たちと協力して、完璧なSCP収容報告書を書き上げ、上司に報告し、最高の評価を手に入れましょう。
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-scp-green mb-4 uppercase tracking-wider border-l-4 border-scp-green pl-4">
                            2. ゲームの目的
                        </h2>
                        <p className="leading-relaxed">
                            皆が選んだ単語や、上位クリアランスから提供されたお題に従って、皆で連作してSCP報告書を書き上げましょう。
                            もっとも完璧に、もっとも美しい報告書を書き上げ、最高の評価を得た職員が勝利となります。
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-scp-green mb-4 uppercase tracking-wider border-l-4 border-scp-green pl-4">
                            3. ゲームの流れ
                        </h2>

                        <div className="space-y-6">
                            <div className="border border-scp-green/30 p-4 bg-scp-green/5">
                                <h3 className="text-xl font-bold text-scp-green mb-2">フェーズ1: ロビー (Lobby)</h3>
                                <p>プレイヤーの参加待機。名前を入力して参加します。ホストはゲームを開始できます。</p>
                            </div>

                            <div className="border border-scp-green/30 p-4 bg-scp-green/5">
                                <h3 className="text-xl font-bold text-scp-green mb-2">フェーズ2: キーワード提案 (Suggestion)</h3>
                                <p>ゲームで使用するキーワードのプールを作成します。各プレイヤーは5つの単語を入力し、データベースにアップロードします。</p>
                            </div>

                            <div className="border border-scp-green/30 p-4 bg-scp-green/5">
                                <h3 className="text-xl font-bold text-scp-green mb-2">フェーズ3: キーワード・制約選択 (Choice)</h3>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>プールからランダムに配られた5つの候補から<strong>3つ</strong>を選択します。</li>
                                    <li><strong>公開制約 (Public Classification)</strong>: オブジェクトクラス、性質、観測特徴などを確認します。</li>
                                    <li><strong>非公開制約 (Hidden Directive)</strong>: プレイヤーだけが知る秘密のルールを確認します。</li>
                                </ul>
                            </div>

                            <div className="border border-scp-green/30 p-4 bg-scp-green/5">
                                <h3 className="text-xl font-bold text-scp-green mb-2">フェーズ4: 執筆 (Scripting)</h3>
                                <p className="mb-2">リレー形式でレポートを執筆します。各パートで担当するレポートがローテーションします。</p>
                                <ol className="list-decimal list-inside space-y-1 ml-4 text-scp-green-dim">
                                    <li><strong className="text-scp-green">特別収容プロトコル:</strong> オブジェクトの封じ込め方法。</li>
                                    <li><strong className="text-scp-green">説明・前半:</strong> 外見や基本的性質。</li>
                                    <li><strong className="text-scp-green">説明・後半:</strong> 実験記録や異常性の詳細。</li>
                                    <li><strong className="text-scp-green">結論・タイトル:</strong> 補遺や結論、そしてSCPのタイトルを決定。</li>
                                </ol>
                            </div>

                            <div className="border border-scp-green/30 p-4 bg-scp-green/5">
                                <h3 className="text-xl font-bold text-scp-green mb-2">フェーズ5 & 6: 発表・投票 (Presentation & Voting)</h3>
                                <p>完成したレポートを確認し、最も優れていると思うレポートに投票します。また、各レポートが「非公開制約」を守れているかチェックします。</p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-scp-green mb-4 uppercase tracking-wider border-l-4 border-scp-green pl-4">
                            4. スコア計算 (Scoring)
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
                                <span>非公開制約達成 (執筆協力者)</span>
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
