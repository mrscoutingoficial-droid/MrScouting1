'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Shield, Zap, TrendingUp, Key, X } from "lucide-react";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const [mode, setMode] = useState<'login' | 'signup'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullname, setFullname] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const supabase = createClient();
    const router = useRouter();

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        if (mode === 'login') {
            const { error: loginError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (loginError) {
                setError(loginError.message);
                setLoading(false);
            } else {
                router.push('/dashboard');
                router.refresh();
            }
        } else {
            const { error: signupError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullname,
                    },
                },
            });

            if (signupError) {
                setError(signupError.message);
                setLoading(false);
            } else {
                setMessage('revisa tu email para confirmar el registro');
                setLoading(false);
            }
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <div
                className="absolute inset-0 bg-[#0a0f1e]/80 backdrop-blur-md"
                onClick={onClose}
            />

            <div className="w-full max-w-md relative animate-in fade-in zoom-in duration-300">
                <div className="glass border border-[#252b46] p-6 md:p-10 rounded-[32px] md:rounded-[40px] shadow-2xl space-y-6 md:space-y-8 backdrop-blur-2xl bg-[#0a0f1e]/40">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 md:top-6 md:right-6 text-slate-500 hover:text-white transition-colors"
                    >
                        <X size={20} className="md:w-6 md:h-6" />
                    </button>

                    <div className="text-center space-y-2 md:space-y-3">
                        <div className="flex justify-center mb-4 md:mb-6">
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-[#162d9c] rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/20 -rotate-3 transition-transform hover:rotate-0">
                                <TrendingUp className="text-[#bef264] w-6 h-6 md:w-8 md:h-8" />
                            </div>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tighter uppercase leading-none text-white">
                            MR. <span className="text-blue-500">SCOUTING</span>
                        </h1>
                        <p className="text-slate-500 text-[10px] md:text-xs font-medium">
                            {mode === 'login' ? 'Inicia sesión en tu Centro de Inteligencia' : 'Únete a la élite del análisis deportivo'}
                        </p>
                    </div>

                    <div className="flex bg-[#0a0f1e] p-1 rounded-xl md:rounded-2xl border border-[#252b46]">
                        <button
                            onClick={() => setMode('login')}
                            className={`flex-1 py-2 md:py-2.5 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-all ${mode === 'login' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setMode('signup')}
                            className={`flex-1 py-2 md:py-2.5 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-all ${mode === 'signup' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            Registro
                        </button>
                    </div>

                    {message && (
                        <div className="bg-[#bef264]/10 border border-[#bef264]/20 p-3 md:p-4 rounded-xl flex items-center gap-3">
                            <Zap className="text-[#bef264] w-4 h-4 flex-shrink-0" />
                            <p className="text-[#bef264] text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-left">{message}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                        {mode === 'signup' && (
                            <div className="space-y-1.5 md:space-y-2 animate-in slide-in-from-top-2 duration-300">
                                <label className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Nombre Completo</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-[#0a0f1e] border border-[#252b46] rounded-xl md:rounded-2xl px-4 py-3 md:px-5 md:py-4 focus:outline-none focus:border-blue-500/50 transition-all text-white text-sm placeholder:text-slate-800"
                                    placeholder="Victor Reyes"
                                    value={fullname}
                                    onChange={(e) => setFullname(e.target.value)}
                                />
                            </div>
                        )}

                        <div className="space-y-1.5 md:space-y-2">
                            <label className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email / Usuario</label>
                            <input
                                type="email"
                                required
                                className="w-full bg-[#0a0f1e] border border-[#252b46] rounded-xl md:rounded-2xl px-4 py-3 md:px-5 md:py-4 focus:outline-none focus:border-blue-500/50 transition-all text-white text-sm placeholder:text-slate-800"
                                placeholder="analista@mrscouting.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="space-y-1.5 md:space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest">Contraseña</label>
                                {mode === 'login' && (
                                    <button type="button" className="text-[9px] md:text-[10px] font-bold text-blue-500 uppercase tracking-widest hover:text-blue-400">¿Olvidaste tu acceso?</button>
                                )}
                            </div>
                            <input
                                type="password"
                                required
                                className="w-full bg-[#0a0f1e] border border-[#252b46] rounded-xl md:rounded-2xl px-4 py-3 md:px-5 md:py-4 focus:outline-none focus:border-blue-500/50 transition-all text-white text-sm placeholder:text-slate-800"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 p-3 md:p-4 rounded-xl flex items-center gap-3">
                                <Shield className="text-red-500 w-4 h-4 flex-shrink-0" />
                                <p className="text-red-500 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-left">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 md:py-5 rounded-xl md:rounded-2xl transition-all shadow-xl shadow-blue-900/30 disabled:opacity-50 flex items-center justify-center gap-3 active:scale-[0.98] uppercase tracking-[2px] text-xs md:text-sm"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    {mode === 'login' ? 'Entrar al Sistema' : 'Crear mi Cuenta'}
                                    <Key size={14} className="text-[#bef264] md:w-4 md:h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="relative flex items-center my-6">
                        <div className="flex-grow border-t border-[#252b46]"></div>
                        <span className="flex-shrink-0 mx-4 text-slate-500 text-[10px] uppercase font-bold tracking-widest">O</span>
                        <div className="flex-grow border-t border-[#252b46]"></div>
                    </div>

                    <button
                        onClick={async () => {
                            await supabase.auth.signInWithOAuth({
                                provider: 'google',
                                options: {
                                    redirectTo: `${window.location.origin}/auth/callback`, // Supabase will handle this route if set up, or redirect to root
                                }
                            });
                        }}
                        className="w-full bg-white hover:bg-slate-100 text-[#0a0f1e] font-bold py-3.5 md:py-4 rounded-xl md:rounded-2xl transition-all flex items-center justify-center gap-3 active:scale-[0.98] uppercase tracking-widest text-xs shadow-lg shadow-white/5"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Continuar con Google
                    </button>

                    <div className="text-center pt-2 md:pt-4">
                        <button
                            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                            className="text-[10px] font-bold text-slate-500 hover:text-blue-500 transition-colors uppercase tracking-widest"
                        >
                            {mode === 'login' ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

