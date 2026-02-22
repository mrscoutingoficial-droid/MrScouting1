'use client';

import { useState } from "react";
import { RadarChart as Radar } from "@/components/charts/RadarChart";
import { AuthModal } from "@/components/shared/AuthModal";
import Link from "next/link";
import {
    TrendingUp,
    Target,
    BarChart3,
    ChevronRight,
    Check,
    Search,
    BookOpen,
    Puzzle as Strategy,
    GraduationCap as School,
    BadgeCheck as Verified,
    Lock,
    LockOpen,
    History,
    Briefcase,
    Globe as Public,
    Mail,
    Home,
    LayoutDashboard as Layout,
    ClipboardList,
    User,
    Zap,
    Shield,
    ArrowRight
} from "lucide-react";

// Mock Data for the Wonderkid Chart
const wonderkidStats = [
    { attribute: 'Ritmo', value: 85 },
    { attribute: 'Visión', value: 72 },
    { attribute: 'Regate', value: 89 },
    { attribute: 'Defensa', value: 45 },
    { attribute: 'Físico', value: 68 },
    { attribute: 'Tiro', value: 77 },
];

export default function LandingPage() {
    const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [mobileStep, setMobileStep] = useState(0);
    const totalSteps = 6;

    const nextStep = () => {
        window.scrollTo(0, 0);
        setMobileStep(prev => Math.min(prev + 1, totalSteps - 1));
    };
    const prevStep = () => {
        window.scrollTo(0, 0);
        setMobileStep(prev => Math.max(prev - 1, 0));
    };

    const handleCheckout = async (priceId: string) => {
        try {
            setCheckoutLoading(priceId);
            const response = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ priceId }),
            });

            const { url, error } = await response.json();
            if (url) window.location.href = url;
            if (error) throw new Error(error);
        } catch (err) {
            console.error(err);
            alert('Error al iniciar el pago. Asegúrate de estar logueado.');
        } finally {
            setCheckoutLoading(null);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0f1e] text-slate-50 relative overflow-x-hidden selection:bg-[#bef264]/30 pb-20 md:pb-0">
            {/* Global Background Elements */}
            <div className="fixed inset-0 tactical-pattern opacity-5 pointer-events-none z-0"></div>
            <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
            <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-[#bef264]/5 rounded-full blur-[120px] pointer-events-none z-0"></div>

            {/* Navigation */}
            <nav className="sticky top-0 z-50 bg-[#0a0f1e]/80 backdrop-blur-xl border-b border-[#252b46]/50 px-6 md:px-12 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2 group cursor-pointer">
                    <TrendingUp className="text-[#bef264] w-7 h-7" />
                    <span className="font-bold text-xl tracking-tighter uppercase">
                        MR. <span className="text-blue-500">SCOUTING</span>
                    </span>
                </div>

                <div className="hidden md:flex gap-8 text-sm font-medium">
                    <a className="hover:text-[#bef264] transition-all" href="#">Scouting</a>
                    <a className="hover:text-[#bef264] transition-all" href="#">Táctica</a>
                    <a className="hover:text-[#bef264] transition-all" href="#">Metodología</a>
                </div>

                <div className="flex items-center gap-2 md:gap-4">
                    <button
                        onClick={() => setIsAuthModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg text-sm font-bold transition-all shadow-xl shadow-blue-900/30 active:scale-95 uppercase tracking-wider"
                    >
                        Login
                    </button>
                </div>
            </nav>

            <main className="relative z-10">
                {/* STEP 0: Hero Section */}
                <section className={`relative pt-10 md:pt-16 pb-24 px-6 md:min-h-[80vh] items-center md:flex ${mobileStep === 0 ? 'flex animate-in fade-in zoom-in-95 duration-500 min-h-[calc(100dvh-140px)]' : 'hidden'}`}>
                    <div className="max-w-4xl mx-auto text-center space-y-8">
                        <div className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-600/20 text-blue-400 px-4 py-1.5 rounded-full text-xs font-bold shadow-2xl">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#bef264] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#bef264]"></span>
                            </span>
                            NUEVA DATA DISPONIBLE: TOP 5 LIGAS
                        </div>

                        <div className="space-y-6">
                            <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight">
                                El Análisis Táctico que el <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-[#bef264]">Fútbol Exige</span>
                            </h1>
                            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                                Transformamos la intuición en datos accionables. Accede al scouting profesional de élite con herramientas de profundidad táctica de última generación.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                            <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-2xl shadow-blue-900/30 transition-all active:scale-95 group">
                                Comienza Gratis <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button className="w-full sm:w-auto glass hover:bg-white/5 px-8 py-4 rounded-xl font-bold text-lg transition-all text-white border border-[#252b46]">
                                Ver Demo
                            </button>
                        </div>
                    </div>
                </section>

                {/* Industrial Grid Wrapper for Desktop */}
                <section className={`py-12 md:py-20 px-6 bg-[#161b2e]/30 border-y border-[#252b46]/50 relative md:block ${(mobileStep === 1 || mobileStep === 2) ? 'block animate-in fade-in slide-in-from-right-8 duration-500 min-h-[calc(100dvh-140px)] flex flex-col justify-center' : 'hidden'}`}>
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

                            {/* STEP 1: Text Content */}
                            <div className={`space-y-10 md:block ${mobileStep === 1 ? 'block' : 'hidden'}`}>
                                <div className="space-y-4">
                                    <h2 className="text-3xl font-bold">Vistazo Inicial: <span className="text-[#bef264]">Métricas de Elite</span></h2>
                                    <p className="text-slate-400 leading-relaxed">
                                        Nuestros algoritmos procesan más de 2,000 eventos por partido para crear perfiles de rendimiento precisos. Visualiza la superioridad táctica antes de que suceda en el campo.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        { title: 'Análisis de Perfil Híbrido', desc: 'Identificación de roles tácticos modernos.', icon: <Verified size={20} className="text-[#bef264]" />, locked: false },
                                        { title: 'Predicción de Valor de Mercado', desc: 'Solo disponible en Plan Pro.', icon: <Lock size={20} className="text-blue-500" />, locked: true },
                                    ].map((item, i) => (
                                        <div key={i} className={`flex items-center gap-4 p-5 glass rounded-xl border-l-4 transition-all group cursor-pointer ${item.locked ? 'border-transparent opacity-60' : 'border-[#bef264]'}`}>
                                            <div className="text-blue-500">
                                                {item.icon}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white uppercase text-xs tracking-wider">{item.title}</h4>
                                                <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* STEP 2: Radar Chart Mockup */}
                            <div className={`relative group md:block w-full max-w-sm mx-auto ${mobileStep === 2 ? 'block' : 'hidden'}`}>
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-[#bef264] rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                                <div className="relative glass p-6 md:p-10 rounded-2xl border border-[#252b46] overflow-hidden bg-gradient-to-br from-white/[0.03] to-transparent shadow-2xl">
                                    <div className="flex justify-between items-start mb-6 md:mb-8 relative z-10">
                                        <div className="space-y-1">
                                            <h3 className="text-lg md:text-xl font-bold uppercase">WONDERKID <br className="md:hidden" />#042</h3>
                                            <p className="text-[#bef264] text-xs md:text-sm font-medium">Extremo Invertido | 19 años</p>
                                        </div>
                                        <div className="bg-[#bef264]/20 text-[#bef264] px-2 py-1 rounded text-[10px] font-bold">CONFIDENCIAL</div>
                                    </div>

                                    <div className="bg-[#0a0f1e]/60 rounded-2xl p-2 md:p-6 flex items-center justify-center min-h-[250px] md:min-h-[300px] border border-[#252b46]/50 relative z-10">
                                        <div className="w-full flex justify-center scale-[0.80] sm:scale-100">
                                            <Radar data={wonderkidStats} />
                                        </div>
                                    </div>

                                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#161b2e] to-transparent flex items-end justify-center pb-6 md:pb-8 z-20">
                                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 md:px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-xl shadow-blue-900/50 active:scale-95 transition-all text-sm md:text-base">
                                            <LockOpen size={18} /> Desbloquear Reporte
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* STEP 3: Features Display */}
                <section className={`py-6 md:py-24 px-6 md:block ${mobileStep === 3 ? 'block animate-in fade-in slide-in-from-right-8 duration-500 min-h-[calc(100dvh-140px)] md:flex md:flex-col md:justify-center' : 'hidden'}`}>
                    <div className="max-w-6xl mx-auto pt-4 md:pt-0">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                            {[
                                { title: 'Análisis de Jugador', icon: <Search className="w-10 h-10" />, desc: 'Informes detallados con métricas avanzadas (xG, xA, Progresión) y mapas.' },
                                { title: 'Táctica y ABP', icon: <Strategy className="w-10 h-10" />, desc: 'Desglose de sistemas de juego, transiciones y jugadas de estrategia.' },
                                { title: 'Metodología', icon: <School className="w-10 h-10" />, desc: 'Aprende los procesos de trabajo de los scouts de élite para profesionalizarte.' },
                            ].map((feature, i) => (
                                <div key={i} className="group p-6 md:p-8 rounded-2xl border border-[#252b46] bg-[#161b2e]/20 hover:border-blue-500/50 transition-all hover:bg-[#161b2e]/30">
                                    <div className="text-blue-600 mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">{feature.title}</h3>
                                    <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                                        {feature.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* STEP 4: Subscription Matrix */}
                <section id="pricing" className={`py-6 md:py-24 px-0 md:px-6 relative overflow-hidden bg-[#0a0f1e] md:block ${mobileStep === 4 ? 'block animate-in fade-in slide-in-from-right-8 duration-500 min-h-[calc(100dvh-140px)] md:flex md:flex-col md:justify-center' : 'hidden'}`}>
                    <div className="max-w-6xl mx-auto space-y-10 md:space-y-16 pt-4 md:pt-0">
                        <div className="text-center space-y-4 px-6 md:px-0">
                            <h2 className="text-3xl md:text-4xl font-bold">Planes de Suscripción</h2>
                            <p className="text-slate-400">Escala tu carrera en el análisis futbolístico</p>
                        </div>

                        <div className="flex overflow-x-auto snap-x snap-mandatory pb-8 pt-4 px-6 md:px-0 md:grid md:grid-cols-3 gap-6 md:gap-8 items-stretch md:overflow-visible no-scrollbar">
                            {/* Beginner */}
                            <div className="min-w-[85vw] md:min-w-0 snap-center p-8 rounded-2xl border border-[#252b46] bg-[#0a0f1e] flex flex-col hover:border-slate-700 transition-all">
                                <div className="mb-8">
                                    <h3 className="text-lg font-bold mb-2">Principiante</h3>
                                    <div className="text-4xl font-bold text-white">$0 <span className="text-sm font-normal text-slate-500">/ mes</span></div>
                                </div>
                                <ul className="space-y-4 mb-8 flex-1">
                                    {['5 Reportes públicos / mes', 'Dashboard analítico básico', 'Acceso a base de datos general'].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-sm text-slate-400">
                                            <Check className="text-[#bef264] w-4 shrink-0 h-4" /> {item}
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    onClick={() => handleCheckout('price_beginner_id')}
                                    disabled={!!checkoutLoading}
                                    className="w-full py-3 rounded-xl border border-[#252b46] font-bold text-sm hover:bg-white/5 transition-all mt-auto"
                                >
                                    Empezar Ahora
                                </button>
                            </div>

                            {/* Semi Pro - Featured */}
                            <div className="min-w-[85vw] md:min-w-0 snap-center p-8 rounded-2xl border-2 border-blue-600 bg-[#162d9c]/5 relative flex flex-col md:scale-105 shadow-2xl">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Recomendado</div>
                                <div className="mb-8">
                                    <h3 className="text-lg font-bold mb-2">Semi Pro</h3>
                                    <div className="text-4xl font-bold text-white">$19 <span className="text-sm font-normal text-slate-500">/ mes</span></div>
                                </div>
                                <ul className="space-y-4 mb-8 flex-1">
                                    {['Reportes ilimitados', 'Filtros avanzados de liga', 'Permiso de creador', 'Acceso a la Comunidad'].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-sm text-white">
                                            <Check className="text-[#bef264] w-4 shrink-0 h-4" /> {item}
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    onClick={() => handleCheckout('price_semipro_id')}
                                    disabled={!!checkoutLoading}
                                    className="w-full py-4 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/40 mt-auto"
                                >
                                    {checkoutLoading === 'price_semipro_id' ? 'Procesando...' : 'Seleccionar Plan'}
                                </button>
                            </div>

                            {/* Pro */}
                            <div className="min-w-[85vw] md:min-w-0 snap-center p-8 rounded-2xl border border-[#252b46] bg-[#0a0f1e] flex flex-col hover:border-slate-700 transition-all">
                                <div className="mb-8">
                                    <h3 className="text-lg font-bold mb-2">Pro</h3>
                                    <div className="text-4xl font-bold text-white">$49 <span className="text-sm font-normal text-slate-500">/ mes</span></div>
                                </div>
                                <ul className="space-y-4 mb-8 flex-1">
                                    {['Networking directo con scouts', 'Consultoría táctica 1:1', 'Exportación masiva PDF/JSON', 'Todo lo de Semi Pro'].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-sm text-slate-400">
                                            <Check className="text-blue-500 w-4 shrink-0 h-4" /> {item}
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    onClick={() => handleCheckout('price_pro_id')}
                                    disabled={!!checkoutLoading}
                                    className="w-full py-3 rounded-xl border border-[#252b46] font-bold text-sm hover:bg-white/5 transition-all mt-auto"
                                >
                                    Ir a Pro
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* STEP 5: Onboarding/Segmentation Teaser */}
                <section className={`py-6 md:py-24 px-6 border-t md:border-[#252b46] md:block ${mobileStep === 5 ? 'block animate-in fade-in slide-in-from-right-8 duration-500 min-h-[calc(100dvh-140px)] md:flex md:flex-col md:justify-center' : 'hidden'}`}>
                    <div className="max-w-4xl mx-auto text-center space-y-12 pt-4 md:pt-0 pb-16 md:pb-0">
                        <h2 className="text-2xl font-bold">Dinos quién eres y personaliza tu panel</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {[
                                { title: 'Aficionado', icon: <TrendingUp className="w-8 h-8" /> },
                                { title: 'Estudiante', icon: <School className="w-8 h-8" /> },
                                { title: 'Profesional', icon: <Briefcase className="w-8 h-8" /> },
                            ].map((role, i) => (
                                <button key={i} className="flex flex-col items-center gap-4 p-8 rounded-2xl border border-[#252b46] hover:bg-blue-600/10 hover:border-blue-600 transition-all group">
                                    <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center group-hover:bg-blue-600/20 transition-colors">
                                        <div className="text-blue-500 group-hover:text-[#bef264] transition-colors">
                                            {role.icon}
                                        </div>
                                    </div>
                                    <span className="font-bold">{role.title}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="hidden md:block bg-[#161b2e] py-16 px-6 border-t border-[#252b46]">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="text-[#bef264] w-6 h-6" />
                        <span className="font-bold text-lg tracking-tighter uppercase">MR. SCOUTING</span>
                    </div>
                    <div className="text-slate-500 text-sm">
                        © 2026 MR. SCOUTING. Todos los derechos reservados.
                    </div>
                    <div className="flex gap-6">
                        <a className="text-slate-400 hover:text-white transition-colors" href="#"><Public size={20} /></a>
                        <a className="text-slate-400 hover:text-white transition-colors" href="#"><Mail size={20} /></a>
                    </div>
                </div>
            </footer>

            {/* MOBILE STORY CONTROLS */}
            <nav className="fixed bottom-0 left-0 right-0 bg-[#0a0f1e] border-t border-[#252b46] md:hidden z-50 px-6 py-4 flex items-center justify-between safe-area-pb shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                <button
                    onClick={prevStep}
                    className={`text-slate-400 font-bold p-2 text-sm uppercase tracking-widest transition-opacity ${mobileStep === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                >
                    Atrás
                </button>

                <div className="flex gap-2">
                    {Array.from({ length: totalSteps }).map((_, i) => (
                        <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === mobileStep ? 'w-6 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'w-1.5 bg-slate-800'}`} />
                    ))}
                </div>

                <div className="flex">
                    {mobileStep === totalSteps - 1 ? (
                        <button
                            onClick={() => setIsAuthModalOpen(true)}
                            className="bg-[#bef264] text-[#0a0f1e] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-lg flex items-center gap-1 shadow-lg shadow-[#bef264]/20 animate-pulse"
                        >
                            Comenzar <ChevronRight size={14} />
                        </button>
                    ) : (
                        <button
                            onClick={nextStep}
                            className="text-white font-bold p-2 text-sm uppercase tracking-widest flex items-center gap-1"
                        >
                            Sig <ChevronRight size={16} />
                        </button>
                    )}
                </div>
            </nav>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />
        </div>
    );
}
