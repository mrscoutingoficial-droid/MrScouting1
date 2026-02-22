'use client';

import { useState, useEffect } from 'react';
import { RadarChart as Radar } from "@/components/charts/RadarChart";
import { Search, Filter, TrendingUp, Shield, Users, Target, ChevronRight, MapPin, FileText, Loader2 } from "lucide-react";
import { createClient } from '@/lib/supabase/client';

export default function ScoutingPage() {
    const [players, setPlayers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchPlayers = async () => {
            const { data, error } = await supabase
                .from('players')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error("Error fetching players:", error);
            } else if (data) {
                setPlayers(data);
            }
            setIsLoading(false);
        };
        fetchPlayers();
    }, []);

    return (
        <div className="space-y-10 pb-20">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative group">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-blue-500">
                        Base de Datos Scouting
                    </h1>
                    <p className="text-slate-500 text-xs font-medium">
                        Normalización de Datos & Análisis Predictivo
                    </p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative group/search flex-1 md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-hover/search:text-[#bef264] transition-colors" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre, club o ID..."
                            className="w-full bg-[#0a0f1e] border border-[#252b46] rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all font-medium text-white placeholder:text-slate-800 shadow-inner"
                        />
                    </div>
                    <button className="p-4 bg-slate-900 border border-[#252b46] rounded-2xl text-slate-400 hover:text-[#bef264] hover:bg-[#bef264]/5 transition-all">
                        <Filter className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Tactical Pills */}
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar border-b border-[#252b46]/50">
                {['Todos', 'U21 Promesas', 'La Liga', 'Premier League', 'Serie A', 'Ligue 1'].map((tag, i) => (
                    <button
                        key={tag}
                        className={`whitespace-nowrap px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border ${i === 0
                            ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/20'
                            : 'bg-[#0a0f1e] border-[#252b46] text-slate-500 hover:border-slate-600'
                            }`}
                    >
                        {tag}
                    </button>
                ))}
            </div>

            {/* Loading State or Players Grid */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Cargando Base de Datos...</p>
                </div>
            ) : players.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 glass border border-[#252b46] rounded-3xl">
                    <Shield className="w-12 h-12 text-slate-600 mb-4" />
                    <h3 className="text-lg font-bold text-slate-300">Sin Datos Disponibles</h3>
                    <p className="text-slate-500 text-sm">No se encontraron jugadores en la base de datos de Supabase.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {players.map((player, index) => {
                        // Generate mock radar stats dynamically to maintain UI aesthetic
                        const dynamicStats = [
                            { attribute: 'Ritmo', value: Math.min(99, (player.overall_rating || 80) + 4) },
                            { attribute: 'Tiro', value: Math.max(50, (player.overall_rating || 80) - 5) },
                            { attribute: 'Pase', value: Math.min(99, (player.overall_rating || 80) + 2) },
                            { attribute: 'Regate', value: Math.min(99, (player.potential_rating || 85) - 2) },
                            { attribute: 'Físico', value: Math.max(50, (player.overall_rating || 80) - 8) },
                        ];

                        return (
                            <div key={player.id} className="group relative glass border border-[#252b46] rounded-[40px] overflow-hidden hover:border-blue-500/30 transition-all duration-500 flex flex-col bg-gradient-to-br from-white/[0.02] to-transparent">
                                <div className="absolute top-6 right-6 z-10">
                                    <div className="bg-[#bef264]/10 text-[#bef264] px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-[2px] border border-[#bef264]/20 backdrop-blur-md">
                                        RANK #{String(index + 1).padStart(2, '0')}
                                    </div>
                                </div>

                                {/* Player Header */}
                                <div className="p-8 pb-4 space-y-4">
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-bold group-hover:text-blue-400 transition-colors tracking-tight">
                                            {player.name}
                                        </h3>
                                        <div className="flex items-center gap-3 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                                            <span className="text-blue-500">{player.position || 'Unknown'}</span>
                                            <span className="w-1 h-1 bg-slate-800 rounded-full"></span>
                                            <span>{player.age || '--'} años</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-slate-500">
                                        <MapPin size={12} className="text-slate-700" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">{player.nationality || 'Internacional'}</span>
                                    </div>
                                </div>

                                {/* Visualization */}
                                <div className="px-8 py-2 flex-1">
                                    <div className="bg-[#0a0f1e]/60 rounded-[32px] p-4 relative group-hover:bg-[#0a0f1e]/80 transition-colors">
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-blue-500/5 rounded-full blur-[60px] pointer-events-none group-hover:bg-blue-500/15"></div>
                                        <Radar data={dynamicStats} />
                                    </div>
                                </div>

                                {/* Footer Card */}
                                <div className="p-8 pt-6 space-y-6">
                                    <div className="flex items-center justify-between border-t border-[#252b46] pt-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-slate-900 border border-[#252b46] flex items-center justify-center">
                                                <TrendingUp size={14} className="text-blue-500" />
                                            </div>
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">{player.team || 'Agente Libre'}</span>
                                        </div>
                                        <ChevronRight className="text-slate-700 group-hover:text-blue-500 transition-colors" size={20} />
                                    </div>

                                    <button className="w-full py-5 bg-[#162d9c] hover:bg-blue-800 text-white font-bold rounded-2xl text-[10px] uppercase tracking-[3px] transition-all shadow-xl shadow-blue-900/30 active:scale-[0.98] flex items-center justify-center gap-3">
                                        <FileText size={14} className="text-[#bef264]" /> Abrir Informe Técnico
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Support / Elite Banner */}
            <div className="relative overflow-hidden glass border border-[#252b46] p-10 rounded-[48px] flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#bef264]"></div>
                <div className="space-y-4">
                    <div className="flex items-center gap-3 text-[#bef264]">
                        <Users size={20} />
                        <h3 className="text-sm font-bold uppercase tracking-[4px]">Servicio de Scouting Bajo Demanda</h3>
                    </div>
                    <p className="text-slate-400 max-w-lg text-xs leading-relaxed font-medium">
                        ¿Requieres un análisis profundo de un mercado o jugador específico? Envía una solicitud de informe a nuestra red de analistas Pro.
                    </p>
                </div>
                <button className="whitespace-nowrap bg-[#bef264] text-[#0a0f1e] px-10 py-5 rounded-2xl font-bold text-xs uppercase tracking-[3px] shadow-2xl shadow-[#bef264]/20 hover:scale-105 transition-all active:scale-95 flex items-center gap-3">
                    <Target size={16} /> Encargar Scouting
                </button>
            </div>
        </div>
    );
}
