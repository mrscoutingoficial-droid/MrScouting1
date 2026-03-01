'use client';

import { useEffect, useState } from 'react';
import { Star, Lock, BookOpen, Target, BarChart2, TrendingUp, Zap, ChevronRight, Loader2, Plus, Heart, MessageCircle, Share2, Bookmark, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { getFeedPosts } from '@/lib/services/feed';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const CATEGORY_CONFIG: Record<string, { label: string, color: string, icon: any, bgColor: string, textColor: string }> = {
    articulo: { label: 'ARTÍCULO', color: '#34d399', icon: BookOpen, bgColor: '#0d2a23', textColor: '#34d399' },
    analisis_jugador: { label: 'PLAYER DATA', color: '#bef264', icon: BarChart2, bgColor: '#1c2e12', textColor: '#bef264' },
    analisis_tactico: { label: 'TACTICAL ANALYSIS', color: '#3b82f6', icon: Target, bgColor: '#111b2e', textColor: '#3b82f6' },
    promesas: { label: 'WONDERKID', color: '#f59e0b', icon: TrendingUp, bgColor: '#2a1a0d', textColor: '#f59e0b' },
};

function getCategoryConfig(category: string) {
    return CATEGORY_CONFIG[category] || { label: 'GENERAL', color: '#64748b', icon: Zap, bgColor: '#1a1f2e', textColor: '#94a3b8' };
}

const TABS = ['Todo', 'Artículos', 'Tácticas', 'Jugadores'];

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={12}
                        className={star <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'fill-slate-800 text-slate-800'}
                    />
                ))}
            </div>
            <span className="text-xs text-slate-500 font-bold ml-1">{rating.toFixed(1)}</span>
        </div>
    );
}

function InteractiveActionBar({
    postId,
    userId,
    initialLikes,
    initialLiked,
    initialBookmarked,
    commentCount
}: {
    postId: string;
    userId: string | null;
    initialLikes: number;
    initialLiked: boolean;
    initialBookmarked: boolean;
    commentCount: number;
}) {
    const [isLiked, setIsLiked] = useState(initialLiked);
    const [likesCount, setLikesCount] = useState(initialLikes);
    const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
    const [isLiking, setIsLiking] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleLike = async () => {
        if (!userId || isLiking) return;
        setIsLiking(true);
        // Optimistic UI
        setIsLiked(!isLiked);
        setLikesCount(prev => isLiked ? prev - 1 : prev + 1);

        try {
            const { toggleLike } = await import('@/lib/services/feed');
            await toggleLike(postId, userId, isLiked);
        } catch (error) {
            console.error("Error toggling like:", error);
            // Revert on error
            setIsLiked(isLiked);
            setLikesCount(initialLikes);
        } finally {
            setIsLiking(false);
        }
    };

    const handleBookmark = async () => {
        if (!userId || isSaving) return;
        setIsSaving(true);
        // Optimistic UI
        setIsBookmarked(!isBookmarked);

        try {
            const { toggleBookmark } = await import('@/lib/services/feed');
            await toggleBookmark(postId, userId, isBookmarked);
        } catch (error) {
            console.error("Error toggling bookmark:", error);
            // Revert on error
            setIsBookmarked(isBookmarked);
        } finally {
            setIsSaving(false);
        }
    };

    const handleShare = async () => {
        const urlToShare = `${window.location.origin}/dashboard/feed/${postId}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'MR. SCOUTING Report',
                    text: 'Echa un vistazo a este informe técnico:',
                    url: urlToShare
                });
            } catch (err) {
                console.log('User cancelled share or it failed', err);
            }
        } else {
            try {
                await navigator.clipboard.writeText(urlToShare);
                alert("Enlace copiado al portapapeles");
            } catch (err) {
                console.error('Failed to copy text: ', err);
            }
        }
    };

    return (
        <div className="px-4 md:px-6 py-3 flex items-center justify-between border-t border-transparent mt-1">
            <div className="flex items-center gap-6">
                <button
                    onClick={handleLike}
                    disabled={!userId || isLiking}
                    className={`flex items-center gap-2 transition-colors group ${isLiked ? 'text-red-500' : 'text-slate-500 hover:text-red-500 disabled:opacity-50'}`}
                >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isLiked ? 'bg-red-500/10' : 'group-hover:bg-red-500/10'}`}>
                        <Heart size={20} className={`transition-transform active:scale-75 ${isLiked ? 'fill-current' : ''}`} />
                    </div>
                    <span className="text-xs font-semibold">{likesCount}</span>
                </button>

                <Link href={`/dashboard/feed/${postId}#comments`} className="flex items-center gap-2 text-slate-500 hover:text-[#0081ff] transition-colors group">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-[#0081ff]/10 transition-colors">
                        <MessageCircle size={20} className="group-active:scale-75 transition-transform" />
                    </div>
                    <span className="text-xs font-semibold">{commentCount}</span>
                </Link>

                <button onClick={handleShare} className="flex items-center gap-2 text-slate-500 hover:text-[#34d399] transition-colors group">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-[#34d399]/10 transition-colors">
                        <Share2 size={20} className="group-active:scale-75 transition-transform" />
                    </div>
                </button>
            </div>

            <button
                onClick={handleBookmark}
                disabled={!userId || isSaving}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors active:scale-75 disabled:opacity-50 ${isBookmarked ? 'text-[#0081ff] bg-[#0081ff]/20' : 'text-slate-500 hover:text-[#0081ff] hover:bg-[#0081ff]/10'}`}
            >
                <Bookmark size={20} className={isBookmarked ? 'fill-current' : ''} />
            </button>
        </div>
    );
}

function PostCard({ post, userId }: { post: any, userId: string | null }) {
    const config = getCategoryConfig(post.category);
    const Icon = config.icon;
    const authorName = post.profiles?.full_name || 'Anonymous';
    const initials = authorName.slice(0, 2).toUpperCase();

    // Fallback date if created_at is missing, format using date-fns
    const postDate = post.created_at ? new Date(post.created_at) : new Date();
    const timeAgo = formatDistanceToNow(postDate, { addSuffix: true, locale: es }).replace('hace ', '');

    return (
        <article className="block bg-[#0a0f1e] md:bg-[#1a1f2e] md:border md:border-white/5 md:rounded-[32px] overflow-hidden transition-all group border-b border-white/[0.05] md:border-b-white/5 pb-4 md:pb-0 mb-2 md:mb-0">
            {/* Social Header */}
            <div className="px-4 py-3 md:p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-xs font-bold text-white uppercase shadow-inner shrink-0">
                        {initials}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-white text-sm font-bold flex items-center gap-1.5">
                            {authorName}
                            <span className="text-slate-500 font-normal text-xs">· {timeAgo}</span>
                        </span>
                        <span className="text-[#0081ff] text-[10px] font-bold tracking-wider uppercase">{config.label}</span>
                    </div>
                </div>
                <button className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/5 rounded-full transition-colors">
                    <MoreHorizontal size={18} />
                </button>
            </div>

            {/* Content Area */}
            <div className="px-4 md:px-6 mb-3">
                <p className="text-white text-base md:text-xl font-medium leading-snug tracking-tight">
                    {post.title}
                </p>
            </div>

            {/* Thumbnail Area - Edge to Edge on Mobile */}
            <Link href={`/dashboard/feed/${post.id}`} className="block relative w-full aspect-[4/3] md:aspect-video bg-[#161b29] flex items-center justify-center overflow-hidden active:opacity-90 transition-opacity">
                <div className="absolute inset-0 tactical-pattern opacity-5" />

                {/* Central Icon */}
                <div className="relative z-10 w-20 h-20 rounded-full bg-[#0a0f1e]/60 border border-white/10 flex items-center justify-center backdrop-blur-md">
                    <Icon size={32} className="text-slate-300 opacity-80" />
                </div>

                {post.is_exclusive && (
                    <div className="absolute top-4 right-4 bg-[#0081ff] text-white px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-[2px] flex items-center gap-1.5 shadow-lg shadow-[#0081ff]/20">
                        <Lock size={10} className="fill-current" /> PRO
                    </div>
                )}
            </Link>

            {/* Social Action Bar */}
            <InteractiveActionBar
                postId={post.id}
                userId={userId}
                initialLikes={post.likesCount || 0}
                initialLiked={post.isLiked || false}
                initialBookmarked={post.isBookmarked || false}
                commentCount={post.comments?.length > 0 ? post.comments[0].count : 0}
            />
        </article>
    );
}

export default function DashboardFeedPage() {
    const [activeTab, setActiveTab] = useState('Todo');
    const [posts, setPosts] = useState<any[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchPostsAndUser = async () => {
            setLoading(true);
            const { createClient } = await import('@/lib/supabase/client');
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            setUserId(user?.id || null);

            // Fetch base posts
            const fetchedPosts = await getFeedPosts(activeTab);

            // If logged in, fetch interactions per post (Could be optimized in SQL or RPC in future)
            if (user && fetchedPosts.length > 0) {
                const { getPostInteractions } = await import('@/lib/services/feed');

                const postsWithInteractions = await Promise.all(
                    fetchedPosts.map(async (post) => {
                        const interactions = await getPostInteractions(post.id, user.id);
                        return {
                            ...post,
                            isLiked: interactions.isLiked,
                            isBookmarked: interactions.isBookmarked,
                            likesCount: interactions.totalLikes
                        };
                    })
                );
                setPosts(postsWithInteractions);
            } else {
                // For non-logged in users just fetch total likes roughly or show 0
                // (Optimally getFeedPosts should perform grouping. For now, defaulting)
                const postsWithZero = fetchedPosts.map(p => ({ ...p, likesCount: 0, isLiked: false, isBookmarked: false }));
                setPosts(postsWithZero);
            }

            setLoading(false);
        };
        fetchPostsAndUser();
    }, [activeTab]);

    return (
        <div className="pb-24 -mx-4 md:mx-0">
            {/* Header - Hidden on mobile, visible on desktop */}
            <div className="hidden md:flex items-center justify-between pt-4 px-4 md:px-0 mb-10">
                <div className="space-y-1">
                    <h1 className="text-4xl font-bold tracking-tight text-white">Feed de Inteligencia</h1>
                    <p className="text-slate-500 text-sm font-medium">Análisis y reportes de la élite mundial</p>
                </div>
                <Link href="/dashboard/create" className="flex items-center gap-3 bg-[#0081ff] text-white px-6 py-4 rounded-full text-xs font-bold hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/20 active:scale-95 group">
                    <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                    <span>NUEVO ANÁLISIS</span>
                </Link>
            </div>

            {/* Sticky Filter Tabs */}
            <div className="sticky top-[64px] md:top-auto z-30 bg-[#0a0f1e]/90 backdrop-blur-xl border-b border-white/[0.05] md:border-none md:bg-transparent px-4 py-3 md:px-0 md:py-0 md:mb-6 flex gap-4 overflow-x-auto no-scrollbar">
                {TABS.map((tab) => {
                    const isActive = activeTab === tab;
                    return (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-shrink-0 px-5 md:px-8 py-2 md:py-3.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-[1px] md:tracking-[2px] transition-all border ${isActive
                                ? 'bg-[#0081ff] border-[#0081ff] text-white shadow-lg shadow-blue-900/40'
                                : 'bg-[#1a1f2e] md:bg-[#1a1f2e] bg-transparent border-transparent md:border-white/5 text-slate-500 hover:text-white hover:border-white/10'
                                }`}
                        >
                            {tab}
                        </button>
                    );
                })}
            </div>

            {/* Content Grid */}
            <div
                className="pt-2 md:pt-0 min-h-[50vh]"
            >
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-4">
                        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest italic">Sincronizando feed...</p>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-40 mx-4 md:mx-0 bg-[#1a1f2e] border border-white/5 rounded-[32px] gap-6">
                        <div className="w-20 h-20 rounded-3xl bg-slate-900 border border-white/5 flex items-center justify-center">
                            <Target className="w-10 h-10 text-slate-800" />
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="text-white font-bold text-xl uppercase tracking-tighter">Sin publicaciones</h3>
                            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-[4px] mt-1">Sube el primer análisis</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-1 gap-0 md:gap-8">
                        {posts.map((post) => (
                            <PostCard key={post.id} post={post} userId={userId} />
                        ))}
                    </div>
                )}
            </div>

            {/* Mobile FAB (Floating Action Button) */}
            <Link
                href="/dashboard/create"
                className="md:hidden fixed bottom-24 right-4 z-40 w-14 h-14 bg-[#0081ff] rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(0,129,255,0.4)] text-white hover:bg-blue-600 active:scale-90 transition-all border border-white/10"
            >
                <Plus size={28} />
            </Link>
        </div>
    );
}
