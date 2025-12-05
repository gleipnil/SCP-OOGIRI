import React from 'react';
import styles from './Ribbon.module.css';

interface RibbonProps {
    className: string;
    label: string;
    stars: number; // 0-4
    statLabel?: string;
    description?: string;
}

export default function Ribbon({ className, label, stars, description, statLabel }: RibbonProps) {
    return (
        <div className="group relative flex flex-col items-center">
            {/* The Ribbon Itself */}
            <div className={`${styles.ribbon} ${styles[className]} transition-transform transform group-hover:scale-105 flex items-center justify-center`}>
                {/* Stars Overlay */}
                <div className="flex justify-center items-center gap-[2px]" style={{ width: '80%' }}>
                    {Array.from({ length: stars }).map((_, i) => (
                        <span key={i} className="text-[#E0E0E0] text-[12px] leading-none drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]" style={{ textShadow: '0 0 2px rgba(0,0,0,0.8)' }}>★</span>
                    ))}
                </div>
            </div>

            {/* Tooltip */}
            <div className="absolute bottom-full mb-2 hidden group-hover:block w-48 bg-[#f0f0f0] border border-black text-black text-xs p-2 z-10 text-center shadow-lg">
                <div className="font-bold uppercase mb-1">{label}</div>
                <div className="text-gray-600 text-[10px] leading-tight mb-1">{description}</div>
                {statLabel && <div className="text-black font-mono text-[10px] font-bold border-t border-gray-300 pt-1 mt-1">{statLabel}</div>}
            </div>
        </div>
    );
}
