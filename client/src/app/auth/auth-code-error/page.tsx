import Link from 'next/link'

export default function AuthCodeError() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-scp-red p-4 font-mono">
            <div className="max-w-md w-full border border-scp-red p-8 bg-black/90 shadow-[0_0_20px_rgba(255,51,51,0.2)] text-center">
                <h1 className="text-2xl font-bold mb-4 uppercase tracking-widest">Authentication Error</h1>
                <p className="mb-8 text-scp-red/80">
                    Failed to verify authentication code. The link may have expired or already been used.
                </p>
                <p className="mb-8 text-sm text-scp-green-dim">
                    If your email is already verified, please try logging in directly.
                </p>
                <Link
                    href="/login"
                    className="inline-block border border-scp-red text-scp-red px-6 py-2 hover:bg-scp-red hover:text-black transition-colors uppercase tracking-widest text-sm"
                >
                    Return to Login
                </Link>
            </div>
        </div>
    )
}
