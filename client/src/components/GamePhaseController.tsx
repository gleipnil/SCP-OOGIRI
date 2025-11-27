import React, { useEffect, useState } from 'react';
import { socket } from '../socket';
import { GameState } from '../types';
import Lobby from './Lobby';
import Suggestion from './Suggestion';
import Choice from './Choice';
import Scripting from './Scripting';
import Presentation from './Presentation';
import Voting from './Voting';
import Result from './Result';
// Will import other components as they are created

import { createClient } from '../utils/supabase/client';

export default function GamePhaseController() {
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        setTimeout(() => {
            setIsMounted(true);
            setIsConnected(socket.connected);
        }, 0);

        async function onConnect() {
            console.log('Socket connected:', socket.id);
            setIsConnected(true);

            // Auto-rejoin if session exists
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                socket.emit('rejoin_game', user.id);
            }
        }

        function onDisconnect() {
            console.log('Socket disconnected');
            setIsConnected(false);
        }

        function onConnectError(err: any) {
            console.error('Socket connection error:', err);
        }

        function onGameStateUpdate(newState: GameState) {
            setGameState(newState);
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('connect_error', onConnectError);
        socket.on('game_state_update', onGameStateUpdate);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('connect_error', onConnectError);
            socket.off('game_state_update', onGameStateUpdate);
        };
    }, []);

    if (!isMounted) {
        return null;
    }

    if (!isConnected) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black text-scp-green font-mono">
                <div className="text-xl animate-pulse uppercase tracking-widest border border-scp-green p-4 shadow-[0_0_15px_rgba(0,255,65,0.2)]">
                    Establishing Secure Connection...
                </div>
            </div>
        );
    }

    if (!gameState) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black text-scp-green font-mono">
                <div className="text-xl animate-pulse uppercase tracking-widest border border-scp-green p-4 shadow-[0_0_15px_rgba(0,255,65,0.2)]">
                    Synchronizing Database...
                </div>
            </div>
        );
    }

    switch (gameState.phase) {
        case 'LOBBY':
            return <Lobby socket={socket} gameState={gameState} />;
        case 'SUGGESTION':
            return <Suggestion socket={socket} gameState={gameState} />;
        case 'CHOICE':
            return <Choice socket={socket} gameState={gameState} />;
        case 'SCRIPTING_1':
        case 'SCRIPTING_2':
        case 'SCRIPTING_3':
        case 'SCRIPTING_4':
            return <Scripting socket={socket} gameState={gameState} />;
        case 'PRESENTATION':
            return <Presentation socket={socket} gameState={gameState} />;
        case 'VOTING':
            return <Voting socket={socket} gameState={gameState} />;
        case 'RESULT':
            return <Result socket={socket} gameState={gameState} />;
        default:
            return <div className="text-scp-red font-mono bg-black min-h-screen flex items-center justify-center uppercase tracking-widest">Unknown Phase Protocol</div>;
    }
}
