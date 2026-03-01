'use client';

import { useEffect, useState, use } from 'react';
import { ChevronLeft, Calendar, User, Zap, Target, BookOpen, BarChart2, TrendingUp, Shield, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { getPostById, getComments, createComment } from '@/lib/services/feed';
import { RadarChart as Radar } from '@/components/charts/RadarChart';
import { createClient } from '@/lib/supabase/client';
import { MessageSquare, Send } from 'lucide-react';

const CATEGORY_CONFIG: Record<string, { label: string, color: string, icon: any }> = {
    articulo: { label: 'ARTÍCULO', color: '#10b981', icon: BookOpen },
    analisis_jugador: { label: 'PLAYER DATA', color: '#bef264', icon: BarChart2 },
    analisis_tactico: { label: 'TACTICAL ANALYSIS', color: '#3b82f6', icon: Target },
    promesas: { label: 'WONDERKID', color: '#f59e0b', icon: TrendingUp },
};

function getCategoryConfig(category: string) {
    return CATEGORY_CONFIG[category] || { label: 'GENERAL', color: '#64748b', icon: Zap };
}

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [post, setPost] = useState<any>(null);
    const [comments, setComments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [commentText, setCommentText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [user, setUser] = useState<any>(null);

    const supabase = createClient();

    useEffect(() => {
        const fetchData = async () => {
            // Fetch sequentially to prevent Supabase Client race conditions and AbortErrors
            const { data: { user: authUser } } = await supabase.auth.getUser();
            const postData = await getPostById(id);
            const commentData = await getComments(id);

            setPost(postData);
            setComments(commentData);
            setUser(authUser);
            setLoading(false);
        };
        fetchData();
    }, [id]);

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim() || !user || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const newComment = await createComment(id, user.id, commentText);
            setComments(prev => [...prev, newComment]);
            setCommentText('');
        } catch (error) {
            console.error("Error submitting comment:", error);
            alert("No se pudo publicar el comentario. Reintente más tarde.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-40 gap-4">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest italic">Sincronizando Nodo de Inteligencia...</p>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="flex flex-col items-center justify-center py-40 gap-6">
                <Shield className="w-16 h-16 text-slate-800" />
                <div className="text-center space-y-2">
                    <h3 className="text-white font-bold text-xl uppercase tracking-tighter">Nodo No Encontrado</h3>
                    <p className="text-slate-500 text-xs">El informe solicitado no existe o ha sido desclasificado.</p>
                </div>
                <Link href="/dashboard" className="px-8 py-3 bg-blue-600/10 border border-blue-500/20 text-blue-400 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-600/20 transition-all">
                    Volver al Feed
                </Link>
            </div>
        );
    }

    const config = getCategoryConfig(post.category);
    const Icon = config.icon;
    const authorName = post.profiles?.full_name || 'Anonymous Analyst';

    // Prepare radar data if available
    const playerMetadata = Array.isArray(post.player_metadata) ? post.player_metadata[0] : post.player_metadata;
    const radarData = playerMetadata?.radar_data ?
        Object.entries(playerMetadata.radar_data).map(([attribute, value]) => ({
            attribute,
            value: Number(value),
        })) : null;

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-32">
            {/* Navigation Header */}
            <div className="flex items-center justify-between">
                <Link href="/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors group">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-blue-500/30">
                        <ChevronLeft size={16} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Regresar</span>
                </Link>
                <div className="flex items-center gap-3">
                    <div className={`px-3 py-1.5 rounded-lg border text-[8px] font-bold uppercase tracking-[2px]`}
                        style={{ backgroundColor: `${config.color}10`, color: config.color, border: `1px solid ${config.color}20` }}>
                        {config.label}
                    </div>
                </div>
            </div>

            {/* Post Header Content */}
            <div className="space-y-8">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.1]">
                    {post.title}
                </h1>

                <div className="flex flex-wrap items-center gap-6 border-y border-white/5 py-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/20 flex items-center justify-center text-[10px] font-bold text-blue-400 uppercase">
                            {authorName[0]}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-white text-xs font-bold leading-tight">{authorName}</span>
                            <span className="text-slate-500 text-[9px] uppercase font-bold tracking-widest">Analista Acreditado</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-slate-500">
                        <Calendar size={14} />
                        <span className="text-[10px] uppercase font-bold tracking-widest">
                            {new Date(post.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                    </div>

                    {post.is_exclusive && (
                        <div className="bg-[#bef264]/10 border border-[#bef264]/20 text-[#bef264] px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                            <Zap size={10} className="fill-[#bef264]" /> EXCLUSIVO PRO
                        </div>
                    )}
                </div>
            </div>

            {/* Split layout: Content + Sidebar for Player Data */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8 space-y-8">
                    {/* Main Content Body */}
                    <div className="prose prose-invert prose-blue max-w-none">
                        <p className="text-slate-300 text-lg leading-relaxed whitespace-pre-wrap">
                            {post.content}
                        </p>
                    </div>

                    {/* Support Banner */}
                    <div className="glass border border-white/5 p-8 rounded-[32px] bg-gradient-to-br from-blue-900/10 to-transparent space-y-4">
                        <h4 className="text-blue-400 text-[10px] font-bold uppercase tracking-[3px]">Nota del Analista</h4>
                        <p className="text-slate-500 text-xs leading-relaxed italic">
                            Este reporte forma parte de la red de inteligencia de MR. SCOUTING. Los datos están normalizados bajo criterios de scouting profesional europeo.
                        </p>
                    </div>
                </div>

                {/* Sidebar for Radar/Metadata */}
                {playerMetadata && (
                    <div className="lg:col-span-4 space-y-8">
                        <div className="glass border border-white/5 p-8 rounded-[40px] space-y-8 sticky top-24 bg-gradient-to-b from-[#0a0f1e] to-transparent">
                            <div className="space-y-2 text-center">
                                <h3 className="text-xs font-bold text-white uppercase tracking-[3px] leading-tight">
                                    {playerMetadata.player_name}
                                </h3>
                                <div className="flex items-center justify-center gap-2 text-slate-500 text-[9px] font-bold uppercase tracking-widest">
                                    <span className="text-blue-500">{playerMetadata.position}</span>
                                    <span>•</span>
                                    <span>{playerMetadata.current_team}</span>
                                </div>
                            </div>

                            {radarData && (
                                <div className="bg-black/20 rounded-[32px] p-4 border border-white/5">
                                    <Radar data={radarData} />
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 border border-white/5 p-4 rounded-2xl text-center">
                                    <span className="block text-slate-500 text-[8px] font-bold uppercase tracking-widest mb-1">Edad</span>
                                    <span className="text-white font-bold">{playerMetadata.age}</span>
                                </div>
                                <div className="bg-white/5 border border-white/5 p-4 rounded-2xl text-center">
                                    <span className="block text-slate-500 text-[8px] font-bold uppercase tracking-widest mb-1">ID Nodo</span>
                                    <span className="text-blue-400 font-bold">#{post.id.slice(0, 4)}</span>
                                </div>
                            </div>

                            <button className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98]">
                                <TrendingUp size={14} className="text-[#bef264]" />
                                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-300">Descargar Informe PDF</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
            {/* Comments Section */}
            <div className="pt-12 border-t border-white/5 space-y-12">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                            <MessageSquare size={20} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white tracking-tight">Comunidad de Inteligencia</h3>
                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Debate táctico y feedback especializado</p>
                        </div>
                    </div>
                    <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                        {comments.length} COMENTARIOS
                    </div>
                </div>

                {/* Comment Form */}
                {user ? (
                    <form onSubmit={handleCommentSubmit} className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-[#bef264] rounded-[32px] blur opacity-10 group-focus-within:opacity-20 transition-opacity"></div>
                        <div className="relative glass border border-white/10 rounded-[32px] p-2 flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="Añadir un análisis o pregunta..."
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                className="flex-1 bg-transparent border-none outline-none px-6 py-4 text-sm text-white placeholder:text-slate-600 font-medium"
                                disabled={isSubmitting}
                            />
                            <button
                                type="submit"
                                disabled={!commentText.trim() || isSubmitting}
                                className="p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl transition-all shadow-xl shadow-blue-500/20 active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                            >
                                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="p-8 rounded-[32px] border border-dashed border-white/10 text-center space-y-4">
                        <p className="text-slate-500 text-xs font-medium">Inicia sesión para participar en el debate táctico.</p>
                        <Link href="/login" className="inline-block px-8 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-700 transition-all">
                            Iniciar Sesión
                        </Link>
                    </div>
                )}

                {/* Comments List */}
                <div className="space-y-6">
                    {comments.length === 0 ? (
                        <div className="py-12 text-center space-y-2">
                            <p className="text-slate-600 text-sm font-medium italic">Aún no hay comentarios en este informe.</p>
                            <p className="text-slate-800 text-[9px] font-bold uppercase tracking-[4px]">Sé el primero en aportar valor</p>
                        </div>
                    ) : (
                        comments.map((comment) => (
                            <div key={comment.id} className="group relative flex gap-4 p-6 rounded-[32px] hover:bg-white/[0.02] transition-colors border border-transparent hover:border-white/5">
                                <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-xs font-black text-white shrink-0 shadow-lg capitalize">
                                    {comment.profiles?.full_name?.[0] || 'U'}
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-bold text-white leading-tight">
                                            {comment.profiles?.full_name || 'Anonymous Analyst'}
                                        </span>
                                        <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                                            {new Date(comment.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                                        </span>
                                    </div>
                                    <p className="text-slate-400 text-sm leading-relaxed">
                                        {comment.content}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
