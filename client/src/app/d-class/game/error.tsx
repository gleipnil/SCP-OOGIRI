'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen bg-black text-scp-red font-mono flex flex-col items-center justify-center p-8">
            <h2 className="text-2xl font-bold mb-4 uppercase tracking-widest border-b border-scp-red pb-2">
                System Failure
            </h2>
            <div className="border border-scp-red/50 p-4 mb-6 max-w-2xl w-full bg-scp-red/10 overflow-auto max-h-[50vh]">
                <p className="font-bold mb-2">Error Message:</p>
                <pre className="whitespace-pre-wrap text-sm">{error.message}</pre>
                {error.stack && (
                    <>
                        <p className="font-bold mt-4 mb-2">Stack Trace:</p>
                        <pre className="whitespace-pre-wrap text-xs opacity-70">{error.stack}</pre>
                    </>
                )}
            </div>
            <button
                onClick={() => reset()}
                className="border border-scp-red text-scp-red px-6 py-2 uppercase hover:bg-scp-red hover:text-black transition-colors"
            >
                Try again
            </button>
        </div>
    );
}
