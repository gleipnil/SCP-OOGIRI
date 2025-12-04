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
                    SCP収容報告書作成プロトコル
                    <span className="block text-sm mt-2 text-scp-green-dim">Operational Manual v2.0 (JP)</span>
                </h1>

                <div className="space-y-8 text-scp-text">
                    <div className="text-center text-scp-red font-bold animate-pulse mb-8">
                        **セキュリティクリアランスレベル 2 (制限付き) が必要です**
                    </div>

                    <section>
                        <h2 className="text-2xl font-bold text-scp-green mb-4 uppercase tracking-wider border-l-4 border-scp-green pl-4">
                            1. 背景 (Operational Context)
                        </h2>
                        <p className="leading-relaxed">
                            貴官は、SCP財団の下級研究員として着任しました。
                            上層部より、早急に新たなSCP報告書の作成を命じられましたが、手元にあるのは断片的な情報と、数名の同僚のみです。
                            しかし、悲観することはありません。同僚たちもまた、そのSCPに関する「何か」を知っているようです。
                            彼らと協力し（あるいは利用し）、完璧なSCP収容報告書を完成させ、O5評議会への報告を行ってください。
                            最も優秀な報告書を作成した職員には、特別昇進が約束されるでしょう。
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-scp-green mb-4 uppercase tracking-wider border-l-4 border-scp-green pl-4">
                            2. 目的 (Objective)
                        </h2>
                        <p className="leading-relaxed">
                            提供されたキーワードと制約条件に従い、他の職員と協力してSCP報告書を執筆してください。
                            最終的に、最も「SCPらしい」、あるいは「興味深い」報告書を作成し、最高の評価を得ることが目標です。
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-scp-green mb-4 uppercase tracking-wider border-l-4 border-scp-green pl-4">
                            3. プロトコル手順 (Protocol Sequence)
                        </h2>

                        <div className="space-y-6">
                            <div className="border border-scp-green/30 p-4 bg-scp-green/5">
                                <h3 className="text-xl font-bold text-scp-green mb-2">Phase 0: エントランス (Entrance)</h3>
                                <p>財団のセキュア端末にログインし、セッション（部屋）を作成または参加してください。最大4名の職員が同時に接続可能です。</p>
                            </div>

                            <div className="border border-scp-green/30 p-4 bg-scp-green/5">
                                <h3 className="text-xl font-bold text-scp-green mb-2">Phase 1: ロビー (Lobby)</h3>
                                <p>参加職員の待機場所です。ホスト権限を持つ職員（ADMIN）がプロトコルを開始します。</p>
                            </div>

                            <div className="border border-scp-green/30 p-4 bg-scp-green/5">
                                <h3 className="text-xl font-bold text-scp-green mb-2">Phase 2: キーワード提案 (Suggestion)</h3>
                                <p>報告書の核となる要素（キーワード）を提案してください。</p>
                                <ul className="list-disc list-inside mt-2 text-scp-green-dim">
                                    <li><strong>推奨:</strong> 地球上に存在する具体的な物体、生物、場所。</li>
                                    <li><strong>非推奨:</strong> 抽象的な概念、感情、既存のキャラクター名。</li>
                                </ul>
                                <p className="mt-2">各職員は5つのキーワードを提出する必要があります。</p>
                            </div>

                            <div className="border border-scp-green/30 p-4 bg-scp-green/5">
                                <h3 className="text-xl font-bold text-scp-green mb-2">Phase 3: 条件選択 (Selection)</h3>
                                <p>貴官が担当する報告書の「骨子」を決定します。</p>
                                <ol className="list-decimal list-inside mt-2 space-y-1 text-scp-green-dim">
                                    <li><strong>キーワード選択:</strong> 提出されたキーワードプールから3つを選択します。</li>
                                    <li><strong>公開制約 (Public Constraints):</strong> 全員に公開される条件（オブジェクトクラス、基本的性質など）。</li>
                                    <li><strong>非公開制約 (Hidden Constraints):</strong> <strong>貴官のみが知る秘密の条件</strong>です。これを満たすよう、他者に悟られずに誘導してください。</li>
                                </ol>
                            </div>

                            <div className="border border-scp-green/30 p-4 bg-scp-green/5">
                                <h3 className="text-xl font-bold text-scp-green mb-2">Phase 4: 執筆 (Scripting)</h3>
                                <p className="mb-2">報告書をセクションごとに分割し、リレー形式で執筆します。他者に担当してもらうセクションもありますが、<strong>最終的な責任（オーナー）は貴官の報告書にあります。</strong></p>
                                <ul className="list-disc list-inside space-y-1 ml-4 text-scp-green-dim">
                                    <li><strong className="text-scp-green">Section 1: 特別収容プロトコル</strong> (封じ込め方法、セキュリティレベル)</li>
                                    <li><strong className="text-scp-green">Section 2: 説明・前半</strong> (外見、物理的特徴、発見経緯)</li>
                                    <li><strong className="text-scp-green">Section 3: 説明・後半</strong> (異常性、実験記録、インシデント)</li>
                                    <li><strong className="text-scp-green">Section 4: 結論・タイトル</strong> (補遺、最終的な結論、正式名称の決定)</li>
                                </ul>
                                <p className="mt-2 text-xs text-scp-green-dim">※3名参加の場合、説明セクションは統合されます。</p>
                            </div>

                            <div className="border border-scp-green/30 p-4 bg-scp-green/5">
                                <h3 className="text-xl font-bold text-scp-green mb-2">Phase 5 & 6: 査読・投票 (Review & Voting)</h3>
                                <p>完成した全ての報告書が公開されます。内容を精査し、最も優れた報告書に投票してください。また、各報告書が非公開制約を満たしているかどうかの審議も行われます。</p>
                            </div>

                            <div className="border border-scp-green/30 p-4 bg-scp-green/5">
                                <h3 className="text-xl font-bold text-scp-green mb-2">Phase 7: 結果発表 (Result)</h3>
                                <p>投票結果と制約達成状況に基づき、最終スコアが算出されます。最高得点の職員が勝者となります。</p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-scp-green mb-4 uppercase tracking-wider border-l-4 border-scp-green pl-4">
                            4. 拡張プロトコル: Dクラス遠隔探査 (Remote Exploration Protocol)
                        </h2>
                        <div className="border border-scp-red/50 p-4 bg-scp-red/5 mb-4">
                            <p className="text-scp-red font-bold uppercase tracking-widest mb-2">WARNING: RESTRICTED ACCESS</p>
                            <p>本セクションは、作成された報告書の「実地検証」を行うための危険なプロトコルです。</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-bold text-scp-green mb-2">概要</h3>
                                <p>作成されたSCP報告書に基づき、Dクラス職員（D-9341）を対象オブジェクトの収容チャンバーまたは発生地点へ派遣します。貴官は管制室からDクラスに指示を出し、実験を遂行してください。</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-scp-green mb-2">手順</h3>
                                <ol className="list-decimal list-inside space-y-1 text-scp-green-dim">
                                    <li><strong>接続:</strong> 結果画面またはアーカイブから「D-CLASS MODE」を起動します。</li>
                                    <li><strong>コマンド入力:</strong> テキストコンソールに指示を入力してください（例: &quot;周囲を見る&quot;, &quot;オブジェクトに触れる&quot;, &quot;逃げる&quot;）。</li>
                                    <li><strong>応答:</strong> 財団のAIシステム（GM）が、報告書の内容に基づき、Dクラスの状況やオブジェクトの反応を描写します。</li>
                                </ol>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-scp-green mb-2">終了条件</h3>
                                <ul className="list-disc list-inside space-y-1 text-scp-green-dim">
                                    <li><strong className="text-scp-green">CLEAR:</strong> オブジェクトの収容に成功する、または実験目的を達成する。</li>
                                    <li><strong className="text-scp-red">DEAD END:</strong> Dクラス職員が死亡する、または回復不能な精神汚染を受ける。</li>
                                    <li><strong className="text-yellow-500">TERMINATION:</strong> 16ターン以内に決着がつかない場合、プロトコルは強制終了され、Dクラスは処分されます。</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-scp-green mb-4 uppercase tracking-wider border-l-4 border-scp-green pl-4">
                            5. 評価基準 (Scoring Metrics)
                        </h2>
                        <ul className="list-none space-y-2">
                            <li className="flex justify-between border-b border-scp-green/30 pb-1">
                                <span>ベストレポート得票</span>
                                <span className="font-bold text-scp-green">10 pts / 票</span>
                            </li>
                            <li className="flex justify-between border-b border-scp-green/30 pb-1">
                                <span>オーナー非公開制約達成</span>
                                <span className="font-bold text-scp-green">20 pts</span>
                            </li>
                            <li className="flex justify-between border-b border-scp-green/30 pb-1">
                                <span>協力者非公開制約達成</span>
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
