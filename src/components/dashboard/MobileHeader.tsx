'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Zap } from 'lucide-react';

const ROUTE_TITLES: Record<string, string> = {
    '/dashboard': 'Inicio',
    '/dashboard/scouting': 'Scouting Central',
    '/dashboard/reports': 'Informes',
    '/dashboard/tactics': 'Táctica',
    '/dashboard/profile': 'Perfil',
    '/dashboard/create': 'Nuevo Análisis',
    '/dashboard/admin': 'Administración',
};

function getTitle(pathname: string): string {
    // Exact match first
    if (ROUTE_TITLES[pathname]) return ROUTE_TITLES[pathname];
    // Match dynamic segments like /dashboard/scouting/[id]
    if (pathname.startsWith('/dashboard/scouting/')) return 'Perfil de Jugador';
    if (pathname.startsWith('/dashboard/feed/')) return 'Inteligencia';
    return 'MR. SCOUTING';
}

interface MobileHeaderProps {
    userEmail: string | undefined;
}

export function MobileHeader({ userEmail }: MobileHeaderProps) {
    const pathname = usePathname();
    const title = getTitle(pathname);
    const initials = (userEmail?.split('@')[0] || 'U').slice(0, 2).toUpperCase();

    return (
        <header className="sticky top-0 z-40 lg:hidden px-4 pt-4 bg-[#0a0f1e]">
            <div className="flex items-center justify-between h-12 relative">
                {/* Left: Brand mark (Dark circular bolt) */}
                <Link href="/dashboard" className="flex items-center">
                    <div className="w-10 h-10 bg-[#1e293b] rounded-full flex items-center justify-center shadow-lg shadow-blue-900/10 active:scale-95 transition-transform">
                        <Zap size={18} className="text-[#0081ff] fill-[#0081ff]" />
                    </div>
                </Link>

                {/* Center: Current page title */}
                <div className="absolute left-1/2 -translate-x-1/2">
                    <span className="text-lg font-bold text-white tracking-tight">{title}</span>
                </div>

                {/* Right: User avatar (Grey circular initials) */}
                <Link href="/dashboard/profile" className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center active:scale-95 transition-transform">
                    <span className="text-[10px] font-black text-white">{initials}</span>
                </Link>
            </div>
        </header>
    );
}
