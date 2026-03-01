'use client';

import { useState, useRef, useCallback, useEffect } from "react";
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
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [mobileStep, setMobileStep] = useState(0);
    const totalSteps = 6;

    // Use a flag to prevent scrolling while we are already programmatic scrolling
    const isProgrammaticScroll = useRef(false);

    // Effect to handle window resize and recalibrate scroll position
    useEffect(() => {
        const handleResize = () => {
            if (scrollContainerRef.current) {
                const container = scrollContainerRef.current;
                const stepWidth = container.clientWidth;
                container.scrollLeft = mobileStep * stepWidth;
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [mobileStep]);

    const scrollToStep = useCallback((step: number) => {
        if (!scrollContainerRef.current) return;
        isProgrammaticScroll.current = true;
        const container = scrollContainerRef.current;
        const stepWidth = container.clientWidth;

        container.scrollTo({
            left: step * stepWidth,
            behavior: 'smooth'
        });

        setMobileStep(step);

        // Reset the flag after animation finishes (~500ms for safety)
        setTimeout(() => {
            isProgrammaticScroll.current = false;
        }, 600);
    }, []);

    const nextStep = () => {
        if (mobileStep < totalSteps - 1) {
            scrollToStep(mobileStep + 1);
        }
    };

    const prevStep = () => {
        if (mobileStep > 0) {
            scrollToStep(mobileStep - 1);
        }
    };

    const handleScroll = useCallback(() => {
        if (!scrollContainerRef.current || isProgrammaticScroll.current) return;

        const container = scrollContainerRef.current;
        const scrollLeft = container.scrollLeft;
        const width = container.clientWidth;

        if (!width) return;

        const currentStep = Math.round(scrollLeft / width);
        if (currentStep !== mobileStep) {
            setMobileStep(currentStep);
        }
    }, [mobileStep]);

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
        <div className="min-h-screen bg-[#0a0f1e] text-slate-50 relative selection:bg-[#bef264]/30 pb-20 md:pb-0">
            {/* Global Background Elements */}
            <div className="fixed inset-0 tactical-pattern opacity-5 pointer-events-none z-0"></div>
            <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
            <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-[#bef264]/5 rounded-full blur-[120px] pointer-events-none z-0"></div>

            {/* Navigation */}
            <nav className="sticky top-0 z-50 bg-[#0a0f1e]/80 backdrop-blur-xl border-b border-[#252b46]/50 px-6 md:px-12 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="w-10 h-10 bg-[#1e293b] rounded-full flex items-center justify-center shadow-lg shadow-blue-900/10">
                        <Zap size={18} className="text-[#0081ff] fill-[#0081ff]" />
                    </div>
                    <span className="font-bold text-xl tracking-tighter uppercase text-white">
                        MR. <span className="text-[#0081ff]">SCOUTING</span>
                    </span>
                </div>

                <div className="hidden md:flex gap-8 text-sm font-medium">
                    <a className="hover:text-[#bef264] transition-all" href="#scouting">Scouting</a>
                    <a className="hover:text-[#bef264] transition-all" href="#tactica">Táctica</a>
                    <a className="hover:text-[#bef264] transition-all" href="#metodologia">Metodología</a>
                    <a className="hover:text-[#bef264] transition-all" href="#pricing">Precios</a>
                </div>

                <div className="flex items-center gap-2 md:gap-4">
                    <button
                        onClick={() => setIsAuthModalOpen(true)}
                        className="bg-[#0081ff] hover:bg-blue-600 text-white px-8 py-2.5 rounded-full text-sm font-bold transition-all shadow-xl shadow-blue-500/20 active:scale-95 uppercase tracking-wider"
                    >
                        Ingresar
                    </button>
                </div>
            </nav>

            <main
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="relative z-10 md:block flex overflow-x-auto snap-x snap-mandatory no-scrollbar md:scroll-auto scroll-smooth"
            >
                {/* STEP 0: Hero Section */}
                <section className="relative pt-4 md:pt-16 pb-20 px-6 md:min-h-[80vh] items-center md:flex flex-none w-full snap-start snap-always min-h-[calc(100dvh-140px)] overflow-y-auto">
                    <div className="max-w-4xl mx-auto text-center space-y-8">
                        <div className="inline-flex items-center gap-2 bg-[#0081ff]/10 border border-[#0081ff]/20 text-[#0081ff] px-4 py-1.5 rounded-full text-xs font-bold shadow-2xl">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0081ff] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0081ff]"></span>
                                <Zap size={12} className="text-[#0081ff] fill-[#0081ff]" />
                            </span>
                            NUEVA DATA DISPONIBLE: TOP 5 LIGAS
                        </div>

                        <div className="space-y-6">
                            <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight">
                                El Análisis Táctico que el <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0081ff] to-blue-300">Fútbol Exige</span>
                            </h1>
                            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                                Transformamos la intuición en datos accionables. Accede al scouting profesional de élite con herramientas de profundidad táctica de última generación.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                            <button
                                onClick={() => setIsAuthModalOpen(true)}
                                className="w-full sm:w-auto bg-[#0081ff] hover:bg-blue-600 text-white px-10 py-4.5 rounded-full font-bold text-lg flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20 transition-all active:scale-95 group"
                            >
                                Comienza Gratis <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={() => {
                                    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="w-full sm:w-auto bg-[#1a1f2e] hover:bg-[#23293e] px-10 py-4.5 rounded-full font-bold text-lg transition-all text-white border border-white/5"
                            >
                                Ver Demo
                            </button>
                        </div>
                    </div>
                </section>

                {/* Industrial Grid Wrapper for Desktop - Split into two sections for mobile */}
                <section id="scouting" className="py-4 md:py-20 px-6 bg-[#161b2e]/30 border-y border-[#252b46]/50 relative flex-none w-full snap-start snap-always md:block flex flex-col justify-center overflow-y-auto scroll-mt-24">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                            {/* STEP 1: Text Content */}
                            <div className="space-y-10 md:block block">
                                <div className="space-y-4">
                                    <h2 className="text-3xl font-bold">Vistazo Inicial: <span className="text-[#bef264]">Métricas de Élite</span></h2>
                                    <p className="text-slate-400 leading-relaxed">
                                        Nuestros algoritmos procesan más de 2,000 eventos por partido para crear perfiles de rendimiento precisos. Visualiza la superioridad táctica antes de que suceda en el campo.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        { title: 'Análisis de Perfil Híbrido', desc: 'Identificación de roles tácticos modernos.', icon: <Verified size={20} className="text-[#0081ff]" />, locked: false },
                                        { title: 'Predicción de Valor de Mercado', desc: 'Solo disponible en Plan Pro.', icon: <Lock size={20} className="text-[#0081ff]" />, locked: true },
                                    ].map((item, i) => (
                                        <div key={i} className={`flex items-center gap-5 p-6 bg-[#1a1f2e] rounded-[32px] border border-white/5 transition-all group cursor-pointer ${item.locked ? 'opacity-60' : 'hover:border-white/10'}`}>
                                            <div className="w-12 h-12 rounded-full bg-[#0a0f1e] border border-white/5 flex items-center justify-center shrink-0">
                                                {item.icon}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white uppercase text-xs tracking-wider">{item.title}</h4>
                                                <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Step 2 mockup is hidden on this desktop grid when in mobile Step 1 */}
                            <div className="hidden lg:block relative group w-full max-w-sm mx-auto">
                                <div className="absolute -inset-1 bg-[#0081ff]/20 rounded-[36px] blur group-hover:bg-[#0081ff]/40 transition duration-1000"></div>
                                <div className="relative bg-[#1a1f2e] p-6 md:p-10 rounded-[32px] border border-white/5 overflow-hidden shadow-2xl">
                                    <div className="w-full flex justify-center scale-[0.80] sm:scale-100">
                                        <Radar data={wonderkidStats} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-2 md:py-20 px-6 bg-[#161b2e]/30 border-y border-[#252b46]/50 relative flex-none w-full snap-start snap-always md:hidden flex flex-col justify-start overflow-y-auto">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 items-center">
                            {/* STEP 2: Radar Chart Mockup */}
                            <div className="relative group block w-full max-w-sm mx-auto">
                                <div className="absolute -inset-1 bg-[#0081ff]/20 rounded-[36px] blur group-hover:bg-[#0081ff]/40 transition duration-1000"></div>
                                <div className="relative bg-[#1a1f2e] p-6 md:p-10 rounded-[32px] border border-white/5 overflow-hidden shadow-2xl">
                                    <div className="flex justify-between items-start mb-6 md:mb-8 relative z-10">
                                        <div className="space-y-1">
                                            <h3 className="text-lg md:text-xl font-bold uppercase tracking-tight">WONDERKID <br className="md:hidden" />#042</h3>
                                            <p className="text-[#0081ff] text-xs md:text-sm font-medium">Extremo Invertido | 19 años</p>
                                        </div>
                                        <div className="bg-[#1e293b] text-white px-3 py-1.5 rounded-lg text-[9px] font-bold tracking-[2px]">CONFIDENCIAL</div>
                                    </div>

                                    <div className="bg-[#0a0f1e] rounded-[24px] p-2 md:p-6 flex items-center justify-center min-h-[250px] md:min-h-[300px] border border-white/5 relative z-10">
                                        <div className="w-full flex justify-center scale-[0.80] sm:scale-100">
                                            <Radar data={wonderkidStats} />
                                        </div>
                                    </div>

                                    <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#1a1f2e] via-[#1a1f2e]/80 to-transparent flex items-end justify-center pb-8 z-20">
                                        <button className="bg-[#0081ff] hover:bg-blue-600 text-white px-8 py-3.5 rounded-full font-bold flex items-center gap-2 shadow-xl shadow-[#0081ff]/20 active:scale-95 transition-all text-sm md:text-base tracking-widest uppercase">
                                            <LockOpen size={16} /> Desbloquear
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* STEP 3: Features Display */}
                <section id="features" className="py-4 md:py-24 px-6 flex-none w-full snap-start snap-always md:block md:flex md:flex-col md:justify-center overflow-y-auto scroll-mt-24">
                    <div className="max-w-6xl mx-auto pt-4 md:pt-0">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                            {[
                                { title: 'Análisis de Jugador', icon: <Search className="w-8 h-8" />, desc: 'Informes detallados con métricas avanzadas y mapas.', id: undefined },
                                { title: 'Táctica y ABP', icon: <Strategy className="w-8 h-8" />, desc: 'Desglose de sistemas de juego y transiciones.', id: 'tactica' },
                                { title: 'Metodología', icon: <School className="w-8 h-8" />, desc: 'Aprende los procesos de élite para profesionalizarte.', id: 'metodologia' },
                            ].map((feature, i) => (
                                <div key={i} {...(feature.id && { id: feature.id })} className="group p-8 rounded-[32px] border border-white/5 bg-[#1a1f2e] hover:border-white/10 transition-all scroll-mt-24">
                                    <div className="w-16 h-16 rounded-full bg-[#0a0f1e] border border-white/5 flex items-center justify-center text-[#0081ff] mb-6 group-hover:scale-110 group-hover:bg-[#0081ff] group-hover:text-white transition-all">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 tracking-tight">{feature.title}</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">
                                        {feature.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* STEP 4: Subscription Matrix */}
                <section id="pricing" className="py-4 md:py-24 px-0 md:px-6 relative overflow-hidden bg-[#0a0f1e] flex-none w-full snap-start snap-always md:block md:flex md:flex-col md:justify-center overflow-y-auto scroll-mt-24">
                    <div className="max-w-6xl mx-auto space-y-10 md:space-y-16 pt-4 md:pt-0">
                        <div className="text-center space-y-4 px-6 md:px-0">
                            <h2 className="text-3xl md:text-4xl font-bold">Planes de Suscripción</h2>
                            <p className="text-slate-400">Escala tu carrera en el análisis futbolístico</p>
                        </div>

                        <div className="flex flex-col pb-8 pt-4 px-6 md:px-0 md:grid md:grid-cols-3 md:items-center gap-6 md:gap-8 items-stretch">
                            {/* Beginner */}
                            <div className="w-full md:min-w-0 p-8 rounded-[32px] border border-white/5 bg-[#1a1f2e] flex flex-col hover:border-white/10 transition-all">
                                <div className="mb-8">
                                    <h3 className="text-lg font-bold mb-2 text-slate-400 uppercase tracking-widest text-xs">Principiante</h3>
                                    <div className="text-5xl font-bold text-white tracking-tight">$0 <span className="text-sm font-normal text-slate-500">/ mes</span></div>
                                </div>
                                <ul className="space-y-4 mb-8 flex-1">
                                    {['5 Reportes públicos / mes', 'Dashboard analítico básico', 'Base de datos general'].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-sm text-slate-400">
                                            <div className="w-5 h-5 rounded-full bg-[#0a0f1e] flex items-center justify-center shrink-0">
                                                <Check className="text-[#bef264] w-3 h-3" />
                                            </div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    onClick={() => handleCheckout('price_beginner_id')}
                                    disabled={!!checkoutLoading}
                                    className="w-full py-4 rounded-full bg-[#0a0f1e] border border-white/5 font-bold text-sm tracking-widest uppercase hover:bg-[#252b46] transition-all mt-auto"
                                >
                                    Empezar Ahora
                                </button>
                            </div>

                            {/* Semi Pro - Featured */}
                            <div className="w-full md:min-w-0 p-8 rounded-[32px] border-2 border-[#0081ff] bg-[#1a1f2e] relative flex flex-col md:scale-[1.05] shadow-[0_0_40px_rgba(0,129,255,0.15)] md:z-10">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0081ff] text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[2px]">Recomendado</div>
                                <div className="mb-8">
                                    <h3 className="text-lg font-bold mb-2 text-[#0081ff] uppercase tracking-widest text-xs">Semi Pro</h3>
                                    <div className="text-5xl font-bold text-white tracking-tight">$19 <span className="text-sm font-normal text-slate-500">/ mes</span></div>
                                </div>
                                <ul className="space-y-4 mb-8 flex-1">
                                    {['Reportes ilimitados', 'Filtros avanzados de liga', 'Permiso de creador', 'Acceso Comunidad'].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-sm text-white">
                                            <div className="w-5 h-5 rounded-full bg-[#0081ff]/20 flex items-center justify-center shrink-0">
                                                <Check className="text-[#0081ff] w-3 h-3" />
                                            </div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    onClick={() => handleCheckout('price_semipro_id')}
                                    disabled={!!checkoutLoading}
                                    className="w-full py-4 rounded-full bg-[#0081ff] text-white font-bold text-sm uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-[#0081ff]/20 mt-auto"
                                >
                                    {checkoutLoading === 'price_semipro_id' ? 'Procesando...' : 'Seleccionar Plan'}
                                </button>
                            </div>

                            {/* Pro */}
                            <div className="w-full md:min-w-0 p-8 rounded-[32px] border border-white/5 bg-[#1a1f2e] flex flex-col hover:border-white/10 transition-all">
                                <div className="mb-8">
                                    <h3 className="text-lg font-bold mb-2 text-slate-400 uppercase tracking-widest text-xs">Pro</h3>
                                    <div className="text-5xl font-bold text-white tracking-tight">$49 <span className="text-sm font-normal text-slate-500">/ mes</span></div>
                                </div>
                                <ul className="space-y-4 mb-8 flex-1">
                                    {['Networking con scouts', 'Consultoría táctica 1:1', 'Exportación PDF/JSON', 'Todo lo de Semi Pro'].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-sm text-slate-400">
                                            <div className="w-5 h-5 rounded-full bg-[#0a0f1e] flex items-center justify-center shrink-0">
                                                <Check className="text-[#bef264] w-3 h-3" />
                                            </div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    onClick={() => handleCheckout('price_pro_id')}
                                    disabled={!!checkoutLoading}
                                    className="w-full py-4 rounded-full bg-[#0a0f1e] border border-white/5 font-bold text-sm tracking-widest uppercase hover:bg-[#252b46] transition-all mt-auto"
                                >
                                    Ir a Pro
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* STEP 5: Onboarding/Segmentation Teaser */}
                <section className="py-4 md:py-24 px-6 border-t md:border-[#252b46] flex-none w-full snap-start snap-always md:block md:flex md:flex-col md:justify-center overflow-y-auto">
                    <div className="max-w-4xl mx-auto text-center space-y-12 pt-4 md:pt-0 pb-16 md:pb-0">
                        <h2 className="text-2xl font-bold">Dinos quién eres y personaliza tu panel</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {[
                                { title: 'Aficionado', icon: <TrendingUp className="w-8 h-8" /> },
                                { title: 'Estudiante', icon: <School className="w-8 h-8" /> },
                                { title: 'Profesional', icon: <Briefcase className="w-8 h-8" /> },
                            ].map((role, i) => (
                                <button key={i} className="flex flex-col items-center gap-5 p-8 rounded-[32px] border border-white/5 bg-[#1a1f2e] hover:border-white/10 hover:bg-[#0a0f1e] transition-all group">
                                    <div className="w-16 h-16 rounded-full bg-[#0a0f1e] flex items-center justify-center border border-white/5 group-hover:bg-[#0081ff]/10 transition-colors">
                                        <div className="text-[#0081ff] group-hover:scale-110 transition-transform">
                                            {role.icon}
                                        </div>
                                    </div>
                                    <span className="font-bold text-lg tracking-tight uppercase text-slate-300 group-hover:text-white transition-colors">{role.title}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="hidden md:block bg-[#161b2e] py-16 px-6 border-t border-[#252b46]">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
                    <div className="flex items-center gap-3 group cursor-pointer opacity-80 hover:opacity-100 transition-opacity">
                        <div className="w-8 h-8 bg-[#0a0f1e] rounded-full flex items-center justify-center border border-white/5">
                            <Zap size={14} className="text-[#0081ff] fill-[#0081ff]" />
                        </div>
                        <span className="font-bold text-lg tracking-tighter uppercase text-white">
                            MR. <span className="text-[#0081ff]">SCOUTING</span>
                        </span>
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
                    onClick={() => mobileStep > 0 && scrollToStep(mobileStep - 1)}
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
                            className="bg-[#0081ff] text-white text-[10px] font-bold uppercase tracking-[2px] px-5 py-2.5 rounded-full flex items-center gap-1.5 shadow-xl shadow-[#0081ff]/20 animate-pulse"
                        >
                            Comenzar <ChevronRight size={14} />
                        </button>
                    ) : (
                        <button
                            onClick={() => mobileStep < totalSteps - 1 && scrollToStep(mobileStep + 1)}
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
