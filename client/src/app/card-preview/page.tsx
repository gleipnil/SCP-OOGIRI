"use client";

import React from 'react';
import SecurityCardMock from '../../components/SecurityCardMock';
import ContrastTest from '../../components/ContrastTest';

export default function CardPreviewPage() {
    return (
        <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center p-10 relative">
            <div className="mb-8 text-zinc-500 font-mono text-xs max-w-2xl text-center">
                PREVIEW MODE<br />
                Validating Zinc-900 Contrast with Global Effects
            </div>

            <SecurityCardMock />

            <div className="w-full max-w-4xl mt-16 p-4 bg-white/5 rounded-xl backdrop-blur-sm relative z-10">
                <h4 className="text-white/50 text-xs font-mono mb-4 text-center tracking-widest uppercase">Contrast Reference Board</h4>
                <ContrastTest />
            </div>
        </div>
    );
}
