import React from 'react';
import Link from 'next/link';

export default function InstructionPage() {
    return (
        <div className="min-h-screen bg-black text-scp-green font-mono p-8 flex flex-col items-center">
            <div className="max-w-4xl w-full border-2 border-scp-green bg-black/90 p-8 shadow-[0_0_20px_rgba(0,255,65,0.2)] relative">
                <h1 className="text-3xl font-bold mb-8 text-center uppercase tracking-widest border-b border-scp-green pb-4">
                    SCP収容報告書記載ゲーム 説明書
                </h1>

                <div className="space-y-8 text-sm leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold mb-4 uppercase text-scp-green-dim border-l-4 border-scp-green pl-3">
                            ゲームの背景
                        </h2>
                        <p className="mb-2">あなたは、SCP財団の下級職員です。</p>
                        <p className="mb-2">上司から、新たにSCP報告書の作成を命じられましたが、断片的な情報しか手元に無く、完全な報告書を記載することができません。</p>
                        <p className="mb-2">しかし幸いなことに、一緒に働く同僚が、そのSCPについて部分的に知っているようです！</p>
                        <p>仲間たちと協力して、完璧なSCP収容報告書を書き上げ、上司に報告し、最高の評価を手に入れましょう。</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4 uppercase text-scp-green-dim border-l-4 border-scp-green pl-3">
                            ゲームの目的
                        </h2>
                        <p>皆が選んだ単語や、上位クリアランスから提供されたお題に従って、皆で連作してSCP報告書を書き上げましょう。</p>
                        <p>もっとも完璧に、もっとも美しい報告書を書き上げ、最高の評価を得た職員が勝利となります。</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4 uppercase text-scp-green-dim border-l-4 border-scp-green pl-3">
                            ゲームの流れ
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-bold text-scp-green mb-2">フェーズ0: エントランス</h3>
                                <p>ログイン出来た後は、部屋の選択画面になります。</p>
                                <p>新規に部屋を立てることと、既に部屋が立っている場合はその部屋に参加することができます。</p>
                                <p>部屋の最大数は4つです。</p>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-scp-green mb-2">フェーズ1: ロビー (Lobby)</h3>
                                <p>ロビー画面は、参加者が揃うまでの待ち合わせになります。</p>
                                <p>最初に入った人がADMINになり、その後のゲーム進行を行います。</p>
                                <p>開始前であれば、部屋から抜けることが可能です。</p>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-scp-green mb-2">フェーズ2: キーワード提案 (Suggestion)</h3>
                                <p>このゲーム中で使用するお題となる単語を5つ入力してください。</p>
                                <p>入力する単語は地球上に存在する物体を推奨します。概念や感情のような実体のないものはなるだけ避けてください。</p>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-scp-green mb-2">フェーズ3: キーワード・制約選択 (Choice)</h3>
                                <p>前のフェーズで入力した単語がシャッフルして配り直されます。</p>
                                <p>それと合わせて、公開制約、非公開制約が提示されます。</p>
                                <p>制約を確認しながら、このオブジェクトを表現するのに用いる単語を、5つから3つ選択しましょう。</p>
                                <ul className="list-disc list-inside mt-2 ml-4 text-scp-green-dim">
                                    <li>公開制約: オブジェクトクラス、性質、観測特徴、対応など。</li>
                                    <li>非公開制約: プレイヤーだけが知る秘密のルール（例：「実は猫である」「爆発オチにする」など）。</li>
                                </ul>
                                <p className="mt-2 text-xs text-scp-green-dim">※最終的にあなたが担当することになるSCP収容報告書はこの条件のものになります。なるだけ自分が楽になるような単語を選ぶのが良いでしょう。</p>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-scp-green mb-2">フェーズ4: 執筆 (Scripting) - 全4パート</h3>
                                <p>リレー形式でSCP収容報告書を執筆します。</p>
                                <p>4人プレイでは4パート、3人プレイでは3パートで構成されています。</p>
                                <ul className="list-disc list-inside mt-2 ml-4 text-scp-green-dim">
                                    <li>特別収容プロトコル (Containment Procedures): オブジェクトの封じ込め方法。</li>
                                    <li>説明・前半 (Description - Initial): 外見や基本的性質。</li>
                                    <li>説明・後半 (Description - Analysis): 実験記録や異常性の詳細。</li>
                                    <li>結論・タイトル (Conclusion & Designation): 補遺や結論、そしてSCPのタイトル（Designation）を決定。</li>
                                </ul>
                                <p className="mt-2 text-xs text-scp-green-dim">※3人プレイの場合は、説明前半・後半が統合されて一つのフェーズになります。</p>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-scp-green mb-2">フェーズ5: 発表 (Presentation)</h3>
                                <p>完成したレポートが非公開制約も含めて順番に全体公開されます。</p>
                                <p>レポートが標示された順に、レポートの責任者が作成したSCP収容報告書について説明しましょう。</p>
                                <p>ページめくりはADMINが行います。</p>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-scp-green mb-2">フェーズ6: 投票 (Voting)</h3>
                                <p>発表が終われば投票フェーズです。</p>
                                <p>最も良いと思ったSCP報告書を選び、右上のボタンから投票しましょう。</p>
                                <p>また、非公開条件を満たしていると思ったレポートについては、左下のチェックボックスに✓を入れましょう。</p>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-scp-green mb-2">フェーズ7: 結果 (Result)</h3>
                                <p>最後はスコア集計と結果発表です。</p>
                                <p>1位のプレイヤーは「Top Clearance」として表彰されます。</p>
                                <p>ゲームログはMarkdown形式で保存できます。</p>
                                <div className="mt-2 border border-scp-green/30 p-2 bg-scp-green/5">
                                    <p className="font-bold">スコア計算:</p>
                                    <ul className="list-disc list-inside ml-4">
                                        <li>ベストレポート得票数 × 10pt</li>
                                        <li>非公開制約達成（過半数の承認）: オーナー +20pt、執筆協力者 +5pt</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                <div className="mt-12 text-center">
                    <Link href="/" className="inline-block border border-scp-green text-scp-green px-6 py-2 hover:bg-scp-green hover:text-black transition-colors uppercase tracking-widest text-sm">
                        Return to Terminal
                    </Link>
                </div>
            </div>
        </div>
    );
}
