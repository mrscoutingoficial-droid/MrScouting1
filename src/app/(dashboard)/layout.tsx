import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { TrendingUp, Zap } from "lucide-react";
import { MobileNav } from '@/components/dashboard/MobileNav';
import { MobileHeader } from '@/components/dashboard/MobileHeader';
import { DashboardSidebarNav } from '@/components/dashboard/DashboardSidebarNav';
import { MobileSwipeWrapper } from '@/components/dashboard/MobileSwipeWrapper';

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

    const isAdmin = user?.email === process.env.ADMIN_EMAIL;

    return (
        <>
            {/* ── MOBILE LAYOUT ── */}
            <div className="lg:hidden flex flex-col min-h-dvh bg-[#0a0f1e] text-slate-50 relative">
                {/* Global Tactical Background */}
                <div className="fixed inset-0 tactical-pattern opacity-5 pointer-events-none z-0" />

                {/* Mobile Header */}
                <MobileHeader userEmail={user.email ?? undefined} />

                {/* Scrollable content */}
                <main className="flex-1 relative z-10 px-4 py-5 pb-28 overflow-x-hidden">
                    <MobileSwipeWrapper>
                        <div className="max-w-7xl mx-auto">
                            {children}
                        </div>
                    </MobileSwipeWrapper>
                </main>

                {/* Mobile Bottom Nav */}
                <MobileNav isAdmin={isAdmin} />
            </div>

            {/* ── DESKTOP LAYOUT ── */}
            <div className="hidden lg:flex h-dvh bg-[#0a0f1e] text-slate-50 relative overflow-hidden">
                {/* Global Tactical Background */}
                <div className="fixed inset-0 tactical-pattern opacity-5 pointer-events-none z-0" />

                {/* Sidebar */}
                <aside className="w-72 border-r border-[#252b46] flex flex-col p-5 space-y-5 bg-[#0a0f1e]/80 backdrop-blur-xl z-20 relative shrink-0 overflow-hidden">
                    <Link href="/" className="flex items-center gap-2.5 shrink-0 transition-transform hover:scale-105">
                        <div className="w-9 h-9 bg-[#162d9c] rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20 rotate-3">
                            <TrendingUp className="text-[#bef264] w-5 h-5" />
                        </div>
                        <span className="text-lg font-bold tracking-tighter uppercase">
                            MR. <span className="text-blue-500">SCOUTING</span>
                        </span>
                    </Link>

                    <DashboardSidebarNav isAdmin={isAdmin} />
                </aside>

                {/* Main content column */}
                <div className="flex-1 flex flex-col overflow-hidden relative z-10">
                    {/* Desktop top bar */}
                    <header className="h-16 border-b border-[#252b46] flex items-center justify-between px-10 bg-[#0a0f1e]/50 backdrop-blur-md shrink-0">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">SISTEMA v1.0 • EN LÍNEA</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-[#161b2e] px-3 py-1.5 rounded-lg border border-[#252b46] flex items-center gap-2">
                                <Zap size={10} className="text-[#bef264]" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">{user.email?.split('@')[0]}</span>
                            </div>
                        </div>
                    </header>

                    {/* Scrollable content */}
                    <main className="flex-1 overflow-y-auto overscroll-contain custom-scrollbar relative">
                        <div className="px-10 py-10">
                            <div className="max-w-7xl mx-auto">
                                {children}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}

