"use client";

import React, { useState, useRef } from 'react';
import { Libre_Barcode_39_Text, Cinzel, Inter, Herr_Von_Muellerhoff, Shippori_Mincho } from 'next/font/google';
import Ribbon from './Ribbon';
import { Achievement } from '../utils/achievements';

// Font definitions
const barcode = Libre_Barcode_39_Text({
    weight: "400",
    subsets: ["latin"],
});

const cinzel = Cinzel({
    subsets: ["latin"],
    weight: ["400", "700", "900"],
});

const inter = Inter({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

const shipporiMincho = Shippori_Mincho({
    weight: ["400", "500", "600", "700", "800"],
    subsets: ["latin"],
});

interface SecurityCardProps {
    user: {
        name: string;
        id: string;
        joinedAt: string;
        comment: string;
    };
    difficulty: 'A' | 'B' | 'C';
    achievements: Achievement[];
}

export default function SecurityCard({ user, difficulty, achievements }: SecurityCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [rotate, setRotate] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -3;
        const rotateY = ((x - centerX) / centerX) * 3;

        setRotate({ x: rotateX, y: rotateY });
    };

    const handleMouseLeave = () => {
        setRotate({ x: 0, y: 0 });
    };

    // Prepare Ribbon Slots
    const totalSlots = 12;
    const ribbonSlots = [...achievements];
    // Fill remaining slots with null to maintain grid structure
    while (ribbonSlots.length < totalSlots) {
        ribbonSlots.push(null as any);
    }

    // Dynamic Styles & Text based on Difficulty
    const getCardConfig = (level: 'A' | 'B' | 'C') => {
        switch (level) {
            case 'A': // O5 Council
                return {
                    headerGradient: "bg-gradient-to-r from-[#8B0000] via-[#A00000] to-[#8B0000]",
                    headerStripe: "bg-red-500",
                    headerStripeDark: "bg-red-900",
                    clearanceLabel: "LEVEL 5",
                    roleTitle: "O5 COUNCIL MEMBER",
                };
            case 'B': // Field Agent
                return {
                    headerGradient: "bg-gradient-to-r from-[#1e3a8a] via-[#2563eb] to-[#1e3a8a]", // Blue-900 to Blue-600
                    headerStripe: "bg-blue-400",
                    headerStripeDark: "bg-blue-800",
                    clearanceLabel: "LEVEL 3",
                    roleTitle: "FIELD AGENT",
                };
            case 'C': // Class D
                return {
                    headerGradient: "bg-gradient-to-r from-[#c2410c] via-[#f97316] to-[#c2410c]", // Orange-700 to Orange-500
                    headerStripe: "bg-orange-300",
                    headerStripeDark: "bg-orange-800",
                    clearanceLabel: "LEVEL 1",
                    roleTitle: "CLASS D PERSONNEL",
                };
        }
    };

    const config = getCardConfig(difficulty);

    // Colors
    const TEXT_MAIN = "#27272a";
    const BG_CARD_BASE = "#fdfdfd"; // Off-white
    const BG_PURE_WHITE = "#ffffff";

    return (
        <div className={`flex flex-col items-center justify-center bg-transparent ${inter.className} perspective-1000`}>
            {/* Wrapper for perspective to work cleanly without extra margins influencing layout if embedded */}

            {/* --- Card Container --- */}
            <div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
                    transition: 'transform 0.1s ease-out',
                    backgroundColor: BG_CARD_BASE,
                    color: TEXT_MAIN,
                    borderColor: '#71717a'
                }}
                className="relative w-[540px] h-[340px] rounded-xl overflow-hidden shadow-2xl border select-none theme-physical flex flex-col"
            >

                {/* Background Watermark/Pattern */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                    <svg viewBox="0 0 100 100" className="w-full h-full pattern-grid" style={{ fill: TEXT_MAIN }}>
                        <defs>
                            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                                <path d="M 10 0 L 0 0 0 10" fill="none" stroke={TEXT_MAIN} strokeWidth="0.5" />
                            </pattern>
                        </defs>
                        <rect width="100" height="100" fill="url(#grid)" />
                    </svg>
                </div>

                {/* --- 1. Header (Fixed Height) --- */}
                <div className={`h-11 w-full shrink-0 ${config.headerGradient} flex items-center justify-between px-5 shadow-md z-20 relative`} style={{ borderBottomColor: TEXT_MAIN, borderBottomWidth: '2px' }}>
                    <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className={`w-1 h-3 transform skew-x-[-15deg] ${i < 5 ? config.headerStripe : config.headerStripeDark} border border-black/20`}></div>
                            ))}
                        </div>
                        <span className={`text-sm tracking-[0.2em] font-black ${inter.className} mt-[1px]`} style={{ color: '#ffffff' }}>
                            {config.clearanceLabel}
                        </span>
                    </div>
                    <span className={`text-[10px] tracking-widest font-bold ${cinzel.className} opacity-90`} style={{ color: '#ffffff' }}>
                        CLASSIFIED
                    </span>
                </div>

                {/* --- 2. Main Body: Columns (Flex Grow) --- */}
                <div className="flex flex-1 min-h-0 w-full">

                    {/* LEFT COLUMN */}
                    <div className="w-[32%] bg-[#eef2f6] flex flex-col p-4 border-r border-[#bdc3c7] relative">
                        <div className="relative z-10 flex flex-col gap-3 h-full">
                            {/* ID */}
                            <div>
                                <div className="text-[8px] text-zinc-700 font-bold tracking-wider mb-0.5 uppercase">Personnel ID</div>
                                <div className={`text-sm font-black tracking-tighter ${inter.className}`} style={{ color: TEXT_MAIN }}>
                                    {user.id.substring(0, 18)}
                                </div>
                            </div>

                            {/* Photo Frame */}
                            <div className="w-full h-[140px] bg-zinc-300 border border-zinc-500 shadow-inner flex flex-col items-center justify-center relative overflow-hidden group shrink-0">
                                <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,#000_2px,#000_3px)] opacity-10"></div>
                                <span className="text-4xl text-zinc-500 font-bold opacity-50 z-10">IMG</span>
                                <div className="absolute bottom-0 w-full bg-zinc-800 text-white text-[7px] text-center py-0.5 tracking-widest">
                                    NO IMAGE AVAILABLE
                                </div>
                            </div>

                            {/* Logo */}
                            <div className="mt-auto flex justify-center pb-2 shrink-0">
                                <div className="w-12 h-12 border-[2px] border-zinc-400 rounded-full flex items-center justify-center opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                                    <span className={`font-bold text-sm text-zinc-600 ${cinzel.className}`}>SCP</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="w-[68%] flex flex-col" style={{ backgroundColor: BG_PURE_WHITE }}>

                        {/* Name Section */}
                        <div className="h-[28%] border-b border-gray-300 px-5 pt-3 pb-2 flex flex-col justify-center relative">
                            <div className="flex justify-between items-start">
                                <div className="flex flex-col">
                                    <span className="text-[8px] text-zinc-500 font-bold tracking-widest uppercase mb-1">Name</span>
                                    {/* Using Shippori Mincho for the Name to handle Japanese text beautifully */}
                                    <h1 className={`text-xl font-black tracking-tight leading-none ${shipporiMincho.className}`} style={{ color: TEXT_MAIN, fontWeight: 700 }}>
                                        {user.name}
                                    </h1>
                                </div>
                                <div
                                    className="text-[9px] px-1.5 py-0.5 font-bold tracking-wider rounded-sm uppercase mt-1"
                                    style={{ backgroundColor: '#ffffff', color: TEXT_MAIN }}
                                >
                                    {config.roleTitle}
                                </div>
                            </div>
                        </div>

                        {/* Ribbon Rack */}
                        <div className="h-[40%] border-b border-gray-300 px-5 py-3 relative flex flex-col justify-center" style={{ backgroundColor: '#f8f9fa' }}>
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-[8px] text-zinc-600 font-bold tracking-widest uppercase">Commendations</span>
                                <span className="text-[8px] text-zinc-400 font-mono">CLASS A</span>
                            </div>
                            <div className="flex justify-start">
                                <div className="grid grid-cols-4 gap-[2px] w-fit p-[2px] border border-gray-200 bg-white shadow-sm">
                                    {ribbonSlots.map((ribbon, i) => (
                                        <div key={i} className="flex justify-center items-center w-[80px] h-[24px]">
                                            {ribbon ? (
                                                <Ribbon
                                                    className={ribbon.className}
                                                    stars={ribbon.stars}
                                                    label={ribbon.label}
                                                    description={ribbon.description}
                                                // statLabel might be missing in mock but exists in type, it's optional
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-100/50 shadow-inner"></div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer Group (Notes + Barcode within Right Column) */}
                        <div className="flex-1 flex flex-col justify-between" style={{ backgroundColor: BG_PURE_WHITE }}>

                            {/* Notes & Signature */}
                            <div className="px-5 flex justify-between items-center pt-2 pb-1 flex-1">
                                {/* Notes */}
                                <div className="w-full pr-2">
                                    <div className="text-[8px] text-zinc-500 font-bold mb-0.5 uppercase">Notes</div>
                                    <p className={`text-[10px] leading-3 italic border-l-2 border-red-900 pl-2 ${shipporiMincho.className} font-semibold line-clamp-2`} style={{ color: TEXT_MAIN }}>
                                        "{user.comment}"
                                    </p>
                                </div>

                                {/* Signature REMOVED per user request */}
                                {/* 
                                <div className="w-1/3 flex flex-col items-center">
                                    <div className={`text-3xl transform -rotate-6 ${signatureFont.className} leading-none`} style={{ color: TEXT_MAIN }}>
                                        {user.name.charAt(0) + user.name.slice(1).toLowerCase()}
                                    </div>
                                    <div className="w-full h-px bg-zinc-400 mt-1"></div>
                                    <div className="text-[7px] text-zinc-400 font-bold tracking-widest uppercase mt-0.5">Authorized Sig.</div>
                                </div>
                                */}
                            </div>

                            {/* Info Row: Barcode & Date (Bottom of Right Column) */}
                            <div className="h-7 w-full flex items-center justify-between px-5 bg-white border-t border-gray-200 shrink-0">
                                <div className={`${barcode.className} text-2xl leading-none whitespace-nowrap opacity-60`} style={{ color: TEXT_MAIN }}>
                                    {user.id.replace(/-/g, '').substring(0, 8)}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[6px] text-zinc-400 font-bold tracking-widest uppercase">JOINED</span>
                                    <span className={`text-[9px] font-bold tracking-wider ${inter.className}`} style={{ color: TEXT_MAIN }}>
                                        {user.joinedAt}
                                    </span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}
