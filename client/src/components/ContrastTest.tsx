"use client";

import React from 'react';
import { Inter, Cinzel } from 'next/font/google';

const inter = Inter({ subsets: ["latin"] });
const cinzel = Cinzel({ subsets: ["latin"], weight: ["400", "700", "900"] });

export default function ContrastTest() {
    // Using explicit HEX codes to bypass any potential Tailwind issues
    const shades = [
        { label: "Zinc-400 (#a1a1aa)", hex: "#a1a1aa" },
        { label: "Zinc-500 (#71717a)", hex: "#71717a" },
        { label: "Zinc-600 (#52525b)", hex: "#52525b" },
        { label: "Zinc-700 (#3f3f46)", hex: "#3f3f46" },
        { label: "Zinc-800 (#27272a)", hex: "#27272a" },
        { label: "Zinc-900 (#18181b)", hex: "#18181b" },
        { label: "Black (#000000)", hex: "#000000" },
    ];

    const bgColors = [
        { name: "White Base", val: "#ffffff" },
        { name: "Off-White Base", val: "#fdfdfd" },
    ];

    return (
        <div className="w-full flex flex-col gap-8 my-8 text-black">
            <div className="p-4 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded mb-4 text-sm font-bold">
                DEBUG MODE: Forcing colors via inline styles (hex codes).
                If these look the same, there is a global filter or opacity issue.
            </div>

            {bgColors.map((bg) => (
                <div key={bg.name} className="p-8 rounded-xl border border-gray-400 shadow-xl" style={{ backgroundColor: bg.val }}>
                    <h3 className="text-black font-bold mb-4 border-b border-gray-300 pb-2">
                        Base Color: {bg.name} ({bg.val})
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                        {shades.map((shade) => (
                            <div key={shade.label} className="flex flex-col gap-4">
                                <span className="text-[10px] text-gray-500 font-mono mb-1">{shade.label}</span>

                                {/* 
                   Using INLINE STYLES to guarantee unique colors.
                   If this fails, browser rendering is intercepted.
                */}
                                <div
                                    className="p-2 border-2 border-dashed flex flex-col gap-2"
                                    style={{
                                        color: shade.hex,
                                        borderColor: shade.hex
                                    }}
                                >

                                    <div className="text-[9px] font-bold tracking-wider uppercase">
                                        Authorized Personnel
                                    </div>

                                    <div className={`text-xl font-black tracking-tight uppercase leading-none ${cinzel.className}`}>
                                        GLEIPNIL
                                    </div>

                                    <div className="w-full h-px bg-current my-1 opacity-50"></div>

                                    <p className={`text-[10px] italic border-l-2 pl-2 ${cinzel.className}`} style={{ borderColor: shade.hex }}>
                                        "Secure. Contain. Protect."
                                    </p>

                                    <div className="text-[9px] font-mono tracking-wider font-bold">
                                        SITE-19
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
