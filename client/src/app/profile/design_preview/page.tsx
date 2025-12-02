"use client";
import SecurityCard from '@/components/SecurityCard';
import { calculateAchievements } from '@/utils/achievements';

export default function DesignPreviewPage() {
    // Mock Data for "Maxed Out" state
    const mockUser = {
        name: "O5-1 'THE FOUNDER'",
        id: "0000-0000-0000-0001",
        joinedAt: "19XX-01-01",
        comment: "We die in the dark so that you may live in the light.",
        avatarUrl: "/avatar_placeholder.png"
    };

    const mockStats = {
        total_plays: 9999,
        total_likes_received: 9999,
        apollyon_wins: 999,
        joined_at: "19XX-01-01"
    };

    const achievements = calculateAchievements(mockStats);

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 gap-8">
            <h1 className="text-scp-green text-2xl font-mono uppercase tracking-widest mb-4">
                Security Clearance Card // Design Preview
            </h1>

            <SecurityCard user={mockUser} achievements={achievements} />

            <div className="text-gray-500 font-mono text-sm max-w-lg text-center">
                * This is a mock representation of a fully maxed-out profile card.
                Actual layout may vary based on screen size.
            </div>
        </div>
    );
}
