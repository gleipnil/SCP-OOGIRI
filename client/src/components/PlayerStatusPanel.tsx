import React from 'react';
import { GameState } from '../types';

interface PlayerStatusPanelProps {
    gameState: GameState;
    myId?: string;
}

export default function PlayerStatusPanel({ gameState, myId }: PlayerStatusPanelProps) {
    return (
        <div className="flex gap-6 items-center border-l border-scp-green/30 pl-6 ml-6">
            <div className="text-[10px] text-scp-green-dim uppercase tracking-widest writing-vertical-rl transform rotate-180 hidden md:block">
                Team Status
            </div>
            <div className="flex gap-2">
                {gameState.users.filter(u => u.id !== myId).map((user) => {
                    const isReady = gameState.readyStates[user.id];
                    return (
                        <div
                            key={user.id}
                            className={`px-3 py-1 border transition-all duration-300 ${isReady
                                ? '!bg-white !text-black !border-white font-bold shadow-[0_0_10px_rgba(255,255,255,0.4)]'
                                : '!bg-black !text-white !border-white'
                                }`}
                        >
                            <span className="text-xs uppercase tracking-wider">
                                {user.name}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
