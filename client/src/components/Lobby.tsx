import React, { useState } from 'react';
import { Socket } from 'socket.io-client';
import { GameState } from '../types';

interface LobbyProps {
    socket: Socket;
    gameState: GameState;
}

export default function Lobby({ socket, gameState }: LobbyProps) {
    const [name, setName] = useState('');
    const [isJoined, setIsJoined] = useState(false);

    const handleJoin = () => {
        if (name.trim()) {
            socket.emit('join_game', name);
            setIsJoined(true);
        }
    };

    const handleStart = () => {
        socket.emit('start_game');
    };

    const myUser = gameState.users.find(u => u.id === socket.id);
    const isHost = myUser?.isHost;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
            <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg">
                <h1 className="text-4xl font-bold mb-8 text-center text-purple-500">SCP報告書作成ゲーム</h1>

                {!isJoined ? (
                    <div className="flex flex-col gap-4">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="名前を入力してください"
                            className="p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-purple-500"
                            onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
                        />
                        <button
                            onClick={handleJoin}
                            disabled={!name.trim()}
                            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded transition duration-200 disabled:opacity-50"
                        >
                            ゲームに参加
                        </button>
                    </div>
                ) : (
                    <div className="text-center">
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-4 text-gray-300">待機中のプレイヤー</h2>
                            <div className="flex flex-wrap justify-center gap-2">
                                {gameState.users.map((user) => (
                                    <div key={user.id} className="bg-gray-700 px-4 py-2 rounded-full flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded-full ${user.isHost ? 'bg-yellow-400' : 'bg-green-400'}`}></div>
                                        <span>{user.name}</span>
                                        {user.isHost && <span className="text-xs text-yellow-400 border border-yellow-400 px-1 rounded">HOST</span>}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {isHost ? (
                            <button
                                onClick={handleStart}
                                disabled={gameState.users.length < 2} // Minimum 2 players
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                ゲーム開始
                            </button>
                        ) : (
                            <p className="text-gray-400 animate-pulse">ホストが開始するのを待っています...</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
