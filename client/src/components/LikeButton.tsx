"use client";
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';

interface LikeButtonProps {
    reportId: string;
}

export default function LikeButton({ reportId }: LikeButtonProps) {
    const [count, setCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const supabase = createClient();

    useEffect(() => {
        const fetchData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUserId(user?.id || null);

            // Get count
            const { count: likeCount } = await supabase
                .from('likes')
                .select('*', { count: 'exact', head: true })
                .eq('report_id', reportId);

            setCount(likeCount || 0);

            if (user) {
                const { data } = await supabase
                    .from('likes')
                    .select('*')
                    .eq('report_id', reportId)
                    .eq('user_id', user.id)
                    .single();
                setIsLiked(!!data);
            }
        };
        fetchData();
    }, [reportId, supabase]);

    const handleToggle = async () => {
        if (!userId) {
            alert('Please login to vote.');
            return;
        }

        const newIsLiked = !isLiked;
        const newCount = newIsLiked ? count + 1 : count - 1;

        // Optimistic update
        setIsLiked(newIsLiked);
        setCount(newCount);

        try {
            if (newIsLiked) {
                const { error } = await supabase
                    .from('likes')
                    .insert({ report_id: reportId, user_id: userId });
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('likes')
                    .delete()
                    .eq('report_id', reportId)
                    .eq('user_id', userId);
                if (error) throw error;
            }
        } catch (error) {
            console.error('Error toggling like:', error);
            // Revert
            setIsLiked(!newIsLiked);
            setCount(count);
        }
    };

    return (
        <button
            onClick={handleToggle}
            className={`flex items-center gap-2 px-3 py-1 border-2 text-sm font-bold uppercase tracking-wider transition-all duration-200 ${isLiked
                    ? 'bg-[#700] text-white border-[#700] shadow-md'
                    : 'bg-transparent text-[#700] border-[#700] hover:bg-[#700] hover:text-white'
                }`}
            title={userId ? (isLiked ? "Remove Commendation" : "Commend Report") : "Login to Commend"}
        >
            <span className="text-lg leading-none">{isLiked ? '★' : '☆'}</span>
            <span>Commendations: {count}</span>
        </button>
    );
}
