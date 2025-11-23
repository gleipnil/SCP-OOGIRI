import React from 'react';
import { GameState } from '../types';

interface PlayerStatusPanelProps {
    gameState: GameState;
}

export default function PlayerStatusPanel({ gameState }: PlayerStatusPanelProps) {
    return (
        <div className="flex gap-6 items-center border-l border-scp-green/30 pl-6 ml-6">
            <div className="text-[10px] text-scp-green-dim uppercase tracking-widest writing-vertical-rl transform rotate-180 hidden md:block">
                Team Status
            </div>
            <div className="flex gap-4">
                {gameState.users.map((user) => {
                    const isReady = gameState.readyStates[user.id];
                    return (
                        <div key={user.id} className="flex flex-col items-center gap-2 group">
                            <div
                                className={`w-3 h-3 rounded-full border border-scp-green transition-all duration-300 ${isReady
                                        ? 'bg-scp-green shadow-[0_0_8px_#00ff41] scale-110'
                                        : 'bg-scp-green/10'
                                    }`}
                            ></div>
                            <span className={`text-[10px] uppercase tracking-wider font-bold transition-colors duration-300 ${isReady ? 'text-scp-green' : 'text-scp-green-dim'
                                }`}>
                                {user.name}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
