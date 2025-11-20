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
            <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                SCP Report Game
            </h1>

            {!isJoined ? (
                <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
                    <h2 className="text-2xl mb-4">Join Game</h2>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        className="w-full p-3 mb-4 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-purple-500"
                    />
                    <button
                        onClick={handleJoin}
                        disabled={!name.trim()}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded transition duration-200 disabled:opacity-50"
                    >
                        Join
                    </button>
                </div>
            ) : (
                <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
                    <h2 className="text-2xl mb-4">Lobby</h2>
                    <div className="mb-6">
                        <h3 className="text-lg text-gray-400 mb-2">Participants ({gameState.users.length}/4)</h3>
                        <ul className="space-y-2">
                            {gameState.users.map((user) => (
                                <li key={user.id} className="flex items-center bg-gray-700 p-3 rounded">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                                    <span className={user.id === socket.id ? "font-bold text-purple-400" : ""}>
                                        {user.name} {user.isHost && "(Host)"}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {isHost && (
                        <button
                            onClick={handleStart}
                            disabled={gameState.users.length < 4}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {gameState.users.length < 4 ? "Waiting for players..." : "Start Game"}
                        </button>
                    )}
                    {!isHost && (
                        <p className="text-center text-gray-400 animate-pulse">
                            Waiting for host to start...
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
