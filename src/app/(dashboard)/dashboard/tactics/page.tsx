'use client';

import { TacticalBoard } from "@/components/tactical-board/Board";
import { MousePointer2, Pencil, MoveRight, Users, Save, Shield, HelpCircle, Zap } from "lucide-react";

export default function TacticsPage() {
    return (
        <div className="space-y-10 pb-20">
            {/* Page Header */}
            <div className="space-y-1 relative group">
                <h1 className="text-3xl font-bold tracking-tight text-blue-500">
                    Laboratorio Táctico
                </h1>
                <p className="text-slate-500 text-xs font-medium">
                    Simulación Predictiva y Diseño de Sistemas
                </p>
            </div>

            {/* Main Board Section */}
            <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-[#bef264]/20 rounded-[40px] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative glass border border-[#252b46] rounded-[48px] p-6 md:p-12 shadow-2xl bg-gradient-to-b from-[#0a0f1e] to-transparent overflow-hidden">
                    <div className="absolute top-0 right-0 w-full h-full tactical-pattern opacity-10 pointer-events-none"></div>
                    <TacticalBoard />
                </div>
            </div>

            {/* Tactical Intelligence / Info */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 glass border border-[#252b46] rounded-[40px] p-10 space-y-8">
                    <div className="flex items-center gap-4 text-white">
                        <div className="p-2.5 bg-blue-600/10 rounded-2xl"><HelpCircle className="w-5 h-5 text-blue-500" /></div>
                        <h3 className="text-sm font-bold uppercase tracking-[3px]">Protocolo de Operación</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            {[
                                { icon: <MousePointer2 size={16} />, text: 'Posicionamiento fluidos de activos mediante drag & drop.' },
                                { icon: <Pencil size={16} />, text: 'Trazado de líneas de presión y transiciones manuales.' },
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 group/item">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#0a0f1e] border border-[#252b46] flex items-center justify-center text-blue-500 group-hover/item:border-blue-500/50 transition-all">
                                        {item.icon}
                                    </div>
                                    <p className="text-xs text-slate-400 font-medium leading-relaxed italic uppercase tracking-tight">
                                        {item.text}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div className="space-y-6">
                            {[
                                { icon: <MoveRight size={16} />, text: 'Vectorización de pases y desplazamientos en largo.' },
                                { icon: <Users size={16} />, text: 'Inyección dinámica de jugadores desde el banco táctico.' },
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 group/item">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#0a0f1e] border border-[#252b46] flex items-center justify-center text-[#bef264] group-hover/item:border-[#bef264]/50 transition-all">
                                        {item.icon}
                                    </div>
                                    <p className="text-xs text-slate-400 font-medium leading-relaxed italic uppercase tracking-tight">
                                        {item.text}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="relative group/status h-full">
                    <div className="h-full glass border border-[#252b46] rounded-[40px] p-10 flex flex-col justify-between items-center text-center space-y-8 bg-gradient-to-b from-blue-900/10 to-transparent">
                        <div className="relative">
                            <div className="absolute inset-0 bg-blue-500/20 blur-[30px] rounded-full group-hover/status:bg-blue-500/40 transition-colors"></div>
                            <div className="w-20 h-20 bg-[#0a0f1e] border-2 border-[#252b46] rounded-[28px] flex items-center justify-center relative z-10">
                                <Save className="w-8 h-8 text-blue-500 group-hover/status:animate-pulse" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h3 className="font-bold text-sm uppercase tracking-[4px] text-[#bef264]">NUBE TÁCTICA</h3>
                            <p className="text-[10px] text-slate-500 italic font-bold uppercase tracking-widest leading-relaxed">
                                Tus configuraciones tácticas se guardan y sincronizan automáticamente en tiempo real en Supabase.
                            </p>
                        </div>

                        <div className="w-full pt-6 border-t border-[#252b46]/50">
                            <div className="flex items-center justify-center gap-2 text-[8px] font-bold uppercase tracking-[4px] text-blue-400/60">
                                <Zap size={10} /> Latencia: 0.2ms
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
