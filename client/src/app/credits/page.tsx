import fs from 'fs';
import path from 'path';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function CreditsPage() {
    const changelogPath = path.join(process.cwd(), 'src', 'CHANGELOG.md');
    let changelogContent = '';

    try {
        changelogContent = fs.readFileSync(changelogPath, 'utf8');
    } catch (err) {
        console.error('Failed to read CHANGELOG.md', err);
        changelogContent = 'Failed to load update history.';
    }

    return (
        <div className="min-h-screen bg-black text-scp-green font-mono p-8 flex flex-col items-center">
            <div className="max-w-3xl w-full border-2 border-scp-green bg-black/90 p-8 shadow-[0_0_20px_rgba(0,255,65,0.2)] relative">
                <h1 className="text-3xl font-bold mb-8 text-center uppercase tracking-widest border-b border-scp-green pb-4">
                    Project Credits & Attribution
                </h1>

                <div className="space-y-8">
                    <section className="border-l-2 border-scp-green pl-4">
                        <h2 className="text-xl font-bold mb-2 uppercase text-scp-green-dim">Core Team</h2>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <span className="text-sm text-scp-green-dim block">Creator / Lead Developer</span>
                                <span className="text-lg font-bold">gleipnil</span>
                            </div>
                            <div>
                                <span className="text-sm text-scp-green-dim block">Original Concept / Draft</span>
                                <span className="text-lg font-bold">ボッチチ</span>
                            </div>
                        </div>
                    </section>

                    <section className="border-l-2 border-scp-green pl-4">
                        <h2 className="text-xl font-bold mb-2 uppercase text-scp-green-dim">License</h2>
                        <div className="flex flex-col items-start gap-4">
                            <div className="bg-white/10 p-2 rounded">
                                <Image
                                    src="/CC_BY-SA_icon.svg.png"
                                    alt="CC BY-SA 3.0"
                                    width={120}
                                    height={42}
                                    className="opacity-90 hover:opacity-100 transition-opacity"
                                />
                            </div>
                            <p className="text-sm text-scp-green-dim">
                                This project is licensed under
                                <br />
                                <br />
                                <a href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank" rel="noopener noreferrer" className="underline hover:text-scp-green">Creative Commons Attribution-ShareAlike 3.0 Unported (CC BY-SA 3.0)</a>.
                            </p>
                            <div className="mt-4 text-sm text-scp-green-dim space-y-1">
                                <p>このゲームはSCP財団の世界観に基づいています</p>
                                <p>SCP Wiki <a href="https://scp-wiki.wikidot.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-scp-green">https://scp-wiki.wikidot.com/</a></p>
                            </div>
                        </div>
                    </section>

                    <section className="border-l-2 border-scp-green pl-4">
                        <h2 className="text-xl font-bold mb-2 uppercase text-scp-green-dim">System Update History</h2>
                        <div className="bg-black/50 p-4 border border-scp-green/30 max-h-60 overflow-y-auto whitespace-pre-wrap text-sm custom-scrollbar">
                            {changelogContent}
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
