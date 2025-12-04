/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

// import { useChat } from '@ai-sdk/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, useRef, Suspense } from 'react';
import { createClient } from '@/utils/supabase/client';

function DClassGameContent() {
    const searchParams = useSearchParams();
    const reportId = searchParams.get('reportId');
    const router = useRouter();
    const supabase = createClient();

    const [reportContent, setReportContent] = useState<string | null>(null);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [gameStatus, setGameStatus] = useState<'PLAYING' | 'DEAD' | 'CLEAR'>('PLAYING');

    const [messages, setMessages] = useState<any[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Fetch Report Content
    useEffect(() => {
        if (!reportId) {
            router.push('/d-class');
            return;
        }

        const fetchReport = async () => {
            const { data, error } = await supabase
                .from('reports')
                .select('content')
                .eq('id', reportId)
                .single();

            if (error || !data) {
                console.error('Error fetching report:', error);
                router.push('/d-class');
            } else {
                // Ensure content is a string to avoid [object Object] in AI prompt
                const rawContent = data.content || '';
                const contentStr = typeof rawContent === 'string'
                    ? rawContent
                    : JSON.stringify(rawContent);
                setReportContent(contentStr);
                setLoading(false);
            }
        };

        fetchReport();
    }, [reportId, router, supabase]);

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async (content: string) => {
        const userMessage = { id: Date.now().toString(), role: 'user', content };
        setMessages(prev => [...prev, userMessage]);
        setIsGenerating(true);
        setError(null);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, userMessage],
                    reportContent
                }),
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const assistantMessageId = (Date.now() + 1).toString();
            setMessages(prev => [...prev, { id: assistantMessageId, role: 'assistant', content: '' }]);

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (!reader) throw new Error('No reader available');

            let accumulatedText = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                accumulatedText += chunk;

                setMessages(prev => prev.map(m =>
                    m.id === assistantMessageId
                        ? { ...m, content: accumulatedText }
                        : m
                ));
            }

            // Check for game status tags in the final text
            if (accumulatedText.includes('[DEAD END]')) {
                setGameStatus('DEAD');
            } else if (accumulatedText.includes('[CLEAR]')) {
                setGameStatus('CLEAR');
            }

        } catch (err) {
            console.error('Chat error:', err);
            setError('CONNECTION ERROR: UNABLE TO REACH FOUNDATION DATABASE.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || isGenerating) return;

        const content = inputValue;
        setInputValue('');
        sendMessage(content);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-scp-green font-mono flex items-center justify-center">
                <div className="animate-pulse uppercase tracking-widest">Initializing Neural Link...</div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-black text-scp-green font-mono flex flex-col p-4 md:p-8 relative overflow-hidden">
            {/* CRT Overlay Effect */}
            <div className="pointer-events-none fixed inset-0 z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] opacity-20"></div>

            {/* Header */}
            <div className="border-b border-scp-green/50 pb-4 mb-4 flex justify-between items-center z-10 flex-shrink-0">
                <h1 className="text-xl font-bold uppercase tracking-widest text-scp-red animate-pulse">
                    Remote Exploration Protocol
                </h1>
                <div className="text-xs text-scp-green-dim uppercase">
                    Subject: D-9341 | Status: {gameStatus}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-grow overflow-y-auto custom-scrollbar mb-4 space-y-6 pr-2 z-10 min-h-0">
                {messages.length === 0 && (
                    <div className="text-center text-scp-green-dim py-12 italic">
                        &lt; Connection Established. Awaiting Input. &gt;
                        <br />
                        (Type &quot;Look around&quot; or &quot;Inspect the object&quot; to begin.)
                    </div>
                )}

                {messages.map((m: any) => (
                    <div key={m.id} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-[80%] p-4 border ${m.role === 'user'
                            ? 'border-scp-green bg-scp-green/10 text-scp-green'
                            : 'border-scp-red/50 bg-black text-scp-green-dim font-typewriter'
                            }`}>
                            <div className="text-xs uppercase mb-1 opacity-50 font-bold tracking-wider">
                                {m.role === 'user' ? 'You' : 'Foundation GM'}
                            </div>
                            <div className="whitespace-pre-wrap leading-relaxed">
                                {m.content}
                            </div>
                        </div>
                    </div>
                ))}

                {isGenerating && (
                    <div className="flex justify-start">
                        <div className="max-w-[80%] p-4 border border-scp-red/50 bg-black text-scp-red animate-pulse font-typewriter">
                            Generating Response...
                        </div>
                    </div>
                )}
                {error && (
                    <div className="flex justify-center my-4">
                        <div className="bg-scp-red/20 border border-scp-red text-scp-red p-4 font-bold uppercase tracking-widest animate-pulse">
                            {error}
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="w-full bg-black border-t border-scp-green/50 pt-4 z-20 flex-shrink-0">
                <div className="max-w-6xl mx-auto">
                    {gameStatus === 'PLAYING' ? (
                        <form onSubmit={handleFormSubmit} className="flex gap-4">
                            <input
                                className="flex-grow bg-black border border-scp-green text-scp-green p-4 focus:outline-none focus:ring-1 focus:ring-scp-green font-mono placeholder-scp-green-dim/50 uppercase"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Enter action..."
                                autoFocus
                                disabled={isGenerating}
                            />
                            <button
                                type="submit"
                                disabled={isGenerating || !inputValue.trim()}
                                className="bg-scp-green text-black font-bold px-8 py-4 uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-50"
                            >
                                Send
                            </button>
                        </form>
                    ) : (
                        <div className="flex flex-col items-center gap-4">
                            <div className={`text-2xl font-bold uppercase tracking-widest ${gameStatus === 'DEAD' ? 'text-scp-red' : 'text-yellow-500'}`}>
                                {gameStatus === 'DEAD' ? 'SUBJECT TERMINATED' : 'PROTOCOL COMPLETE'}
                            </div>
                            <button
                                onClick={() => router.push('/d-class')}
                                className="border border-scp-green text-scp-green px-8 py-3 uppercase tracking-widest hover:bg-scp-green hover:text-black transition-colors"
                            >
                                Return to Terminal
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function DClassGame() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black text-scp-green font-mono flex items-center justify-center"><div className="animate-pulse uppercase tracking-widest">Loading Protocol...</div></div>}>
            <DClassGameContent />
        </Suspense>
    );
}
