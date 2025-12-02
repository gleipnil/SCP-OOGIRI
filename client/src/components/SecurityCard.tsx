import React from 'react';
import { Achievement } from '../utils/achievements';
import Ribbon from './Ribbon';

interface SecurityCardProps {
    user: {
        name: string;
        id: string;
        joinedAt: string;
        comment: string;
        avatarUrl?: string;
    };
    achievements: Achievement[];
}

export default function SecurityCard({ user, achievements }: SecurityCardProps) {
    return (
        <div className="w-full max-w-[600px] aspect-[1.586] bg-[#f0f0f0] text-[#111] rounded-3xl border-[6px] border-black relative shadow-2xl font-sans">

            {/* Name & ID - Left at 5%, Top at 5% */}
            {/* Name has py-2 (0.5rem = 8px). So text starts 8px down from container top. */}
            <div
                className="absolute flex flex-col max-w-[40%]"
                style={{ left: '5%', top: '5%' }}
            >
                <div className="py-2">
                    <h1 className="text-4xl font-black uppercase tracking-tighter font-mono text-black leading-none break-words">
                        {user.name}
                    </h1>
                </div>
                <div className="mt-1 font-mono text-sm font-bold tracking-widest text-gray-800 break-all">
                    {user.id}
                </div>
            </div>

            {/* Ribbons - Centered at 75% width. 
                Top alignment: Name container is at 5%. Text starts +0.5rem down. 
                Ribbon container should start at 5% + 0.5rem to align top of ribbon with top of name text box? 
                Or just align visually. Let's try adding top margin to match the py-2 of name. */}
            <div
                className="absolute flex flex-wrap gap-2 justify-center content-start"
                style={{
                    left: '75%',
                    top: '5%', // Base top
                    marginTop: '0.5rem', // Match py-2 of name
                    transform: 'translateX(-50%)',
                    width: '260px'
                }}
            >
                {achievements.map(ach => (
                    <Ribbon
                        key={ach.id}
                        className={ach.className}
                        label={ach.label}
                        stars={ach.stars}
                        description={ach.description}
                        statLabel={ach.statLabel}
                    />
                ))}
            </div>

            {/* Comment - Top at 50%, Left at 60% */}
            <div
                className="absolute flex flex-col items-start text-left"
                style={{
                    top: '50%',
                    left: '60%',
                    width: '35%'
                }}
            >
                <div className="font-typewriter text-sm mb-2 text-[#222] bg-white/50 p-1 border-l-2 border-gray-300">
                    "{user.comment}"
                </div>
            </div>

            {/* Issued Date - Bottom Right */}
            <div
                className="absolute font-mono text-xs font-bold text-gray-700"
                style={{
                    bottom: '5%',
                    right: '5%'
                }}
            >
                ISSUED: {user.joinedAt}
            </div>

            {/* Logo/Motto - Bottom Left (Text Only) - Bottom at 5%, Left at 5% */}
            <div
                className="absolute"
                style={{ left: '5%', bottom: '5%' }}
            >
                <div className="flex flex-col">
                    <span className="text-3xl font-black uppercase leading-none tracking-tight">SCP FOUNDATION</span>
                    <div className="flex flex-col text-sm font-bold tracking-[0.2em] uppercase text-gray-800 mt-1 leading-tight">
                        <span>SECURE.</span>
                        <span>CONTAIN.</span>
                        <span>PROTECT.</span>
                    </div>
                </div>
            </div>

        </div>
    );
}
