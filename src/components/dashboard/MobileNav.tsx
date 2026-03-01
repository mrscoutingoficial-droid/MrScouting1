'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Target, FileText, User, ShieldAlert } from 'lucide-react';

const NAV_ITEMS = [
    { href: '/dashboard', label: 'Inicio', icon: Home, exact: true },
    { href: '/dashboard/scouting', label: 'Scouting', icon: Target, exact: false },
    { href: '/dashboard/reports', label: 'Informes', icon: FileText, exact: false },
    { href: '/dashboard/profile', label: 'Perfil', icon: User, exact: false },
];

interface MobileNavProps {
    isAdmin: boolean;
}

export function MobileNav({ isAdmin }: MobileNavProps) {
    const pathname = usePathname();

    const isActive = (href: string, exact: boolean) => {
        if (exact) return pathname === href;
        return pathname.startsWith(href);
    };

    const allItems = isAdmin
        ? [...NAV_ITEMS, { href: '/dashboard/admin', label: 'Admin', icon: ShieldAlert, exact: false }]
        : NAV_ITEMS;

    return (
        <nav className="fixed bottom-0 left-0 right-0 lg:hidden z-50 bg-[#0a0f1e]/98 backdrop-blur-2xl border-t border-white/[0.06] shadow-[0_-8px_32px_rgba(0,0,0,0.6)]" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
            <div className="flex justify-around items-center h-[68px] px-1 relative">
                {allItems.map(({ href, label, icon: Icon, exact }) => {
                    const active = isActive(href, exact);
                    return (
                        <Link
                            key={href}
                            href={href}
                            className="flex flex-col items-center justify-center flex-1 h-full gap-1.5 relative group"
                        >
                            <div className={`transition-all duration-300 ${active ? 'text-[#0081ff] scale-110' : 'text-slate-600'}`}>
                                <Icon
                                    size={20}
                                    strokeWidth={active ? 2.5 : 1.8}
                                />
                            </div>
                            <span className={`text-[9px] font-bold uppercase tracking-[2px] transition-colors duration-300 ${active ? 'text-[#0081ff]' : 'text-slate-600'}`}>
                                {label}
                            </span>

                            {/* Active Indicator Line */}
                            {active && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#0081ff] rounded-b-full shadow-[0_2px_10px_rgba(0,129,255,0.4)]" />
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
