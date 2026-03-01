'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Home,
    Target,
    FileText,
    Layout,
    User,
    PlusSquare,
    LogOut,
    TrendingUp,
    ShieldAlert
} from "lucide-react";

const mainNavItems = [
    { href: '/dashboard', label: 'Inicio', icon: Home, exact: true },
    { href: '/dashboard/scouting', label: 'Scouting Central', icon: Target, exact: false },
    { href: '/dashboard/reports', label: 'Archivo de Informes', icon: FileText, exact: false },
    { href: '/dashboard/tactics', label: 'Laboratorio Táctico', icon: Layout, exact: false },
];

export function DashboardSidebarNav({ isAdmin }: { isAdmin: boolean }) {
    const pathname = usePathname();

    const isActive = (href: string, exact: boolean) => {
        if (exact) return pathname === href;
        return pathname.startsWith(href);
    };

    const linkClass = (href: string, exact: boolean, accent = false) => {
        const active = isActive(href, exact);
        const base = "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group font-bold text-xs tracking-tight border";
        if (accent) {
            return `${base} ${active ? 'bg-[#bef264]/10 text-[#bef264] border-[#bef264]/30' : 'hover:bg-[#bef264]/5 text-slate-400 hover:text-[#bef264] border-transparent hover:border-[#bef264]/20'}`;
        }
        return `${base} ${active ? 'bg-blue-600/10 text-white border-blue-500/30' : 'hover:bg-blue-600/10 text-slate-400 hover:text-white border-transparent hover:border-blue-500/20'}`;
    };

    return (
        <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
            <nav className="flex-1 min-h-0 flex flex-col gap-0.5">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-3">Terminal de Mando</p>

                {mainNavItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={linkClass(item.href, item.exact)}
                    >
                        <item.icon size={16} className="group-hover:text-blue-500 shrink-0" /> {item.label}
                    </Link>
                ))}

                <hr className="border-[#252b46] my-3" />

                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-3">Agente Elite</p>

                <Link
                    href="/dashboard/profile"
                    className={linkClass('/dashboard/profile', false, true)}
                >
                    <User size={16} className="shrink-0" /> Perfil de Analista
                </Link>

                <Link href="/dashboard/create" className="mt-4 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-xl shadow-blue-900/30 active:scale-95 group uppercase tracking-widest text-[10px]">
                    <PlusSquare size={14} className="text-[#bef264]" /> Nuevo Análisis
                </Link>

                {isAdmin && (
                    <Link href="/dashboard/admin" className="mt-2 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-red-600/10 border border-red-500/20 hover:bg-red-500/20 text-red-500 font-bold transition-all shadow-xl shadow-red-900/10 active:scale-95 group uppercase tracking-widest text-[10px]">
                        <ShieldAlert size={14} /> Panel Admin
                    </Link>
                )}
            </nav>

            <div className="shrink-0 pt-3 mt-2 border-t border-[#252b46]">
                <form action="/auth/signout" method="post">
                    <button className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-red-500/5 text-slate-500 hover:text-red-500 transition-all font-bold text-xs uppercase tracking-widest border border-transparent hover:border-red-500/20">
                        <LogOut size={14} /> Cerrar Conexión
                    </button>
                </form>
            </div>
        </div>
    );
}
