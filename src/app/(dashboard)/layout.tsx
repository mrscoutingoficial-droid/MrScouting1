import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
    Home,
    Target,
    FileText,
    Layout,
    User,
    PlusSquare,
    LogOut,
    TrendingUp,
    Zap,
    ShieldAlert
} from "lucide-react";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-[#0a0f1e] text-slate-50 relative overflow-hidden">
            {/* Global Tactical Background */}
            <div className="absolute inset-0 tactical-pattern opacity-10 pointer-events-none"></div>

            {/* Sidebar (Desktop Only) */}
            <aside className="hidden lg:flex w-72 border-r border-[#252b46] flex-col p-8 space-y-10 bg-[#0a0f1e]/80 backdrop-blur-xl z-20 relative">
                <Link href="/" className="flex items-center gap-3 transition-transform hover:scale-105">
                    <div className="w-10 h-10 bg-[#162d9c] rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20 rotate-3">
                        <TrendingUp className="text-[#bef264] w-6 h-6" />
                    </div>
                    <span className="text-xl font-bold tracking-tighter uppercase">
                        MR. <span className="text-blue-500">SCOUTING</span>
                    </span>
                </Link>

                <nav className="flex-1 space-y-2">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 ml-4">Terminal de Mando</p>

                    <Link href="/dashboard" className="flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-blue-600/10 text-slate-400 hover:text-white transition-all group font-bold text-sm tracking-tight border border-transparent hover:border-blue-500/20">
                        <Home size={18} className="group-hover:text-blue-500" /> Inicio
                    </Link>

                    <Link href="/dashboard/scouting" className="flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-blue-600/10 text-slate-400 hover:text-white transition-all group font-bold text-sm tracking-tight border border-transparent hover:border-blue-500/20">
                        <Target size={18} className="group-hover:text-blue-500" /> Scouting Central
                    </Link>

                    <Link href="/dashboard/reports" className="flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-blue-600/10 text-slate-400 hover:text-white transition-all group font-bold text-sm tracking-tight border border-transparent hover:border-blue-500/20">
                        <FileText size={18} className="group-hover:text-blue-500" /> Archivo de Informes
                    </Link>

                    <Link href="/dashboard/tactics" className="flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-blue-600/10 text-slate-400 hover:text-white transition-all group font-bold text-sm tracking-tight border border-transparent hover:border-blue-500/20">
                        <Layout size={18} className="group-hover:text-blue-500" /> Laboratorio Táctico
                    </Link>

                    <hr className="border-[#252b46] my-6" />

                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 ml-4">Agente Elite</p>

                    <Link href="/dashboard/profile" className="flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-[#bef264]/5 text-slate-400 hover:text-[#bef264] transition-all group font-bold text-sm tracking-tight border border-transparent hover:border-[#bef264]/20">
                        <User size={18} className="group-hover:text-[#bef264]" /> Perfil de Analista
                    </Link>

                    <Link href="/dashboard/create" className="mt-8 flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-xl shadow-blue-900/30 active:scale-95 group uppercase tracking-widest text-[10px]">
                        <PlusSquare size={16} className="text-[#bef264]" /> Nuevo Análisis
                    </Link>

                    {user?.email === process.env.ADMIN_EMAIL && (
                        <Link href="/dashboard/admin" className="mt-4 flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl bg-red-600/10 border border-red-500/20 hover:bg-red-500/20 text-red-500 font-bold transition-all shadow-xl shadow-red-900/10 active:scale-95 group uppercase tracking-widest text-[10px]">
                            <ShieldAlert size={16} /> Admin Panel
                        </Link>
                    )}
                </nav>

                <div className="pt-6 border-t border-[#252b46]">
                    <form action="/auth/signout" method="post">
                        <button className="w-full text-left flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-red-500/5 text-slate-500 hover:text-red-500 transition-all font-bold text-xs uppercase tracking-widest border border-transparent hover:border-red-500/20">
                            <LogOut size={16} /> Cerrar Conexión
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden relative pb-20 lg:pb-0">
                {/* Header/Status Bar */}
                <header className="h-16 lg:h-16 border-b border-[#252b46] flex items-center justify-between px-6 lg:px-10 bg-[#0a0f1e]/50 backdrop-blur-md z-10 shrink-0">
                    <div className="flex items-center gap-2 lg:gap-3">
                        {/* Mobile Logo Visibility */}
                        <div className="lg:hidden flex items-center gap-2 mr-4">
                            <TrendingUp size={20} className="text-[#bef264]" />
                            <span className="text-sm font-bold tracking-tighter uppercase leading-none">
                                MR. <span className="text-blue-500">S</span>
                            </span>
                        </div>
                        <div className="hidden sm:flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">SISTEMA v1.0 • EN LÍNEA</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="bg-[#161b2e] px-3 py-1.5 rounded-lg border border-[#252b46] flex items-center gap-2 max-w-[120px] sm:max-w-none">
                            <Zap size={10} className="text-[#bef264]" />
                            <span className="text-[10px] font-bold uppercase tracking-widest truncate">{user.email?.split('@')[0]}</span>
                        </div>
                        <form action="/auth/signout" method="post" className="lg:hidden">
                            <button className="text-slate-500 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-500/10 flex items-center justify-center">
                                <LogOut size={18} />
                            </button>
                        </form>
                    </div>
                </header>

                {/* Content scroll area */}
                <main className="flex-1 overflow-y-auto p-6 lg:p-10 relative custom-scrollbar pb-24 lg:pb-10">
                    <div className="max-w-7xl mx-auto min-h-full">
                        {children}
                    </div>
                </main>
            </div>

            {/* MOBILE BOTTOM NAVBAR (Dashboard Version) */}
            <nav className="fixed bottom-0 left-0 right-0 bg-[#0a0f1e]/90 backdrop-blur-xl border-t border-[#252b46]/50 lg:hidden z-50 px-4 shadow-2xl safe-area-pb">
                <div className="flex justify-between items-center h-20">
                    <Link href="/dashboard" className="flex flex-col items-center gap-1.5 flex-1 transition-colors text-[#bef264]">
                        <Home className="w-5 h-5" />
                        <span className="text-[9px] font-bold uppercase tracking-widest">Inicio</span>
                    </Link>
                    <Link href="/dashboard/scouting" className="flex flex-col items-center gap-1.5 flex-1 transition-colors text-slate-500 hover:text-blue-400">
                        <Target className="w-5 h-5" />
                        <span className="text-[9px] font-bold uppercase tracking-widest">Scout</span>
                    </Link>
                    <Link href="/dashboard/reports" className="flex flex-col items-center gap-1.5 flex-1 transition-colors text-slate-500 hover:text-blue-400">
                        <FileText className="w-5 h-5" />
                        <span className="text-[9px] font-bold uppercase tracking-widest">Data</span>
                    </Link>
                    <Link href="/dashboard/tactics" className="flex flex-col items-center gap-1.5 flex-1 transition-colors text-slate-500 hover:text-blue-400">
                        <Layout className="w-5 h-5" />
                        <span className="text-[9px] font-bold uppercase tracking-widest">Táctica</span>
                    </Link>
                    <Link href="/dashboard/profile" className="flex flex-col items-center gap-1.5 flex-1 transition-colors text-slate-500 hover:text-blue-400">
                        <User className="w-5 h-5" />
                        <span className="text-[9px] font-bold uppercase tracking-widest">Perfil</span>
                    </Link>
                    {user?.email === process.env.ADMIN_EMAIL && (
                        <Link href="/dashboard/admin" className="flex flex-col items-center gap-1.5 flex-1 transition-colors text-red-500 hover:text-red-400">
                            <ShieldAlert className="w-5 h-5" />
                            <span className="text-[9px] font-bold uppercase tracking-widest">Admin</span>
                        </Link>
                    )}
                </div>
            </nav>
        </div>
    );
}
