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

import Entrance from './Entrance';

export default function GamePhaseController() {
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [userName, setUserName] = useState('');
    const [userId, setUserId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [difficultyLevel, setDifficultyLevel] = useState<'A' | 'B' | 'C'>('C');

    // Name input state (if not loaded from profile)
    const [inputName, setInputName] = useState('');

    const supabase = createClient();

    useEffect(() => {
        setTimeout(() => {
            setIsMounted(true);
            setIsConnected(socket.connected);
        }, 0);

        async function init() {
            // Check auth and profile
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                // Check if account is logically deleted
                if (user.user_metadata?.deleted) {
                    await supabase.auth.signOut();
                    window.location.href = '/login';
                    return;
                }

                setUserId(user.id);
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('display_name, difficulty_level')
                    .eq('id', user.id)
                    .single();

                if (profile) {
                    if (profile.display_name) setUserName(profile.display_name);
                    if (profile.difficulty_level) setDifficultyLevel(profile.difficulty_level as 'A' | 'B' | 'C');
                }
            }
            setIsLoading(false);
        }
        init();

        function onConnect() {
            console.log('Socket connected:', socket.id);
            setIsConnected(true);

            // If we have userId, try to rejoin (server will check if in active session)
            // Note: We need userId from state, but it might not be set yet in this closure if called immediately.
            // Better to handle rejoin trigger separately or rely on init() + socket connect.
        }

        function onGameStateUpdate(newState: GameState) {
            setGameState(newState);
        }

        // Handle session events to switch view
        function onSessionCreated(sessionId: string) {
            // Game state update will follow
        }

        function onSessionJoined(sessionId: string) {
            // Game state update will follow
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', () => setIsConnected(false));
        socket.on('game_state_update', onGameStateUpdate);
        socket.on('session_created', onSessionCreated);
        socket.on('session_joined', onSessionJoined);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect');
            socket.off('game_state_update', onGameStateUpdate);
            socket.off('session_created', onSessionCreated);
            socket.off('session_joined', onSessionJoined);
        };
    }, []);

    // Effect to trigger rejoin once both socket and user are ready
    useEffect(() => {
        if (isConnected && userId) {
            socket.emit('rejoin_game', userId);
        }
    }, [isConnected, userId]);

    const handleNameSubmit = async () => {
        if (inputName.trim() && userId) {
            // Save name to profile
            await supabase.from('profiles').upsert({
                id: userId,
                display_name: inputName,
                updated_at: new Date().toISOString(),
            });
            setUserName(inputName);
        }
    };

    if (!isMounted) return null;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black text-scp-green font-mono">
                <div className="text-xl animate-pulse uppercase tracking-widest border border-scp-green p-4 shadow-[0_0_15px_rgba(0,255,65,0.2)]">
                    Authenticating Personnel...
                </div>
            </div>
        );
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

    // 1. Name Input (if no name set)
    if (!userName) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 font-mono bg-black text-scp-green">
                <div className="w-full max-w-md border-2 border-scp-green p-8 shadow-[0_0_20px_rgba(0,255,65,0.2)]">
                    <h1 className="text-2xl font-bold mb-6 text-center uppercase tracking-widest border-b border-scp-green pb-4">
                        Identity Verification
                    </h1>
                    <div className="flex flex-col gap-4">
                        <label className="text-sm uppercase tracking-wider">Enter Codename</label>
                        <input
                            type="text"
                            value={inputName}
                            onChange={(e) => setInputName(e.target.value)}
                            className="p-3 bg-black border border-scp-green text-scp-green focus:outline-none focus:ring-1 focus:ring-scp-green uppercase"
                            placeholder="CODENAME..."
                            onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
                        />
                        <button
                            onClick={handleNameSubmit}
                            disabled={!inputName.trim()}
                            className="bg-scp-green text-black font-bold py-3 px-6 uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-200 disabled:opacity-50"
                        >
                            Confirm Identity
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // 2. Game State (Lobby or In-Game)
    if (gameState) {
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
                return <div className="text-scp-red">Unknown Phase</div>;
        }
    }

    // 3. Entrance (Session List)
    return <Entrance socket={socket} userName={userName} userId={userId!} difficultyLevel={difficultyLevel} />;
}
