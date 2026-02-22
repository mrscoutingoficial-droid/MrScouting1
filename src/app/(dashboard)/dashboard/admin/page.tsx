'use client';

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Users, Database, ShieldAlert, Plus, Trash2, Edit } from "lucide-react";

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<'jugadores' | 'usuarios'>('jugadores');
    const [players, setPlayers] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);

    // Add Player Modal State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newPlayer, setNewPlayer] = useState({
        name: '',
        position: '',
        age: '',
        team: '',
        nationality: '',
        overall_rating: '',
        potential_rating: '',
        tier: 'PROSPECT',
        locked: true
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const supabase = createClient();

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        if (activeTab === 'jugadores') {
            const { data } = await supabase.from('players').select('*').order('created_at', { ascending: false });
            if (data) setPlayers(data);
        } else {
            const { data } = await supabase.from('user_profiles').select('*').order('created_at', { ascending: false });
            if (data) setUsers(data);
        }
    };

    const handleAddPlayer = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const { error } = await supabase.from('players').insert([{
            name: newPlayer.name,
            position: newPlayer.position,
            age: parseInt(newPlayer.age),
            team: newPlayer.team,
            nationality: newPlayer.nationality,
            overall_rating: parseInt(newPlayer.overall_rating),
            potential_rating: parseInt(newPlayer.potential_rating),
            tier: newPlayer.tier,
            locked: newPlayer.locked
        }]);
        setIsSubmitting(false);
        if (!error) {
            setIsAddModalOpen(false);
            setNewPlayer({ name: '', position: '', age: '', team: '', nationality: '', overall_rating: '', potential_rating: '', tier: 'PROSPECT', locked: true });
            fetchData();
        } else {
            alert("Error al añadir jugador: " + error.message);
        }
    };

    const toggleUserTier = async (userId: string, currentRole: string) => {
        const newRole = currentRole === 'beginner' ? 'pro' : 'beginner';
        await supabase.from('user_profiles').update({ role: newRole }).eq('id', userId);
        fetchData(); // reload
    };

    const deletePlayer = async (playerId: string) => {
        if (confirm("¿Estás seguro de que deseas eliminar a este jugador permanentemente?")) {
            await supabase.from('players').delete().eq('id', playerId);
            fetchData();
        }
    };

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight text-red-500 flex items-center gap-3">
                    <ShieldAlert className="w-8 h-8" /> Panel de Administración
                </h1>
                <p className="text-slate-500 text-xs font-medium">
                    Control Absoluto: Gestión de base de datos y suscripciones. Acceso Restringido.
                </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-[#252b46]/50 pb-4">
                <button
                    onClick={() => setActiveTab('jugadores')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'jugadores' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-[#0a0f1e] text-slate-500 hover:text-slate-300'}`}
                >
                    <Database size={16} /> Data Scouting
                </button>
                <button
                    onClick={() => setActiveTab('usuarios')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'usuarios' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-[#0a0f1e] text-slate-500 hover:text-slate-300'}`}
                >
                    <Users size={16} /> Suscriptores
                </button>
            </div>

            {/* Content Area */}
            <div className="glass border border-[#252b46] rounded-[40px] p-8 min-h-[500px]">
                {activeTab === 'jugadores' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-xl font-bold text-white">Directorio de Jugadores</h2>
                            <button onClick={() => setIsAddModalOpen(true)} className="bg-red-600 text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-red-500 transition-colors flex items-center gap-2 shadow-lg shadow-red-900/20">
                                <Plus size={16} /> Añadir Ficha Técnica
                            </button>
                        </div>
                        <div className="overflow-x-auto rounded-3xl border border-[#252b46]">
                            <table className="w-full text-left text-sm text-slate-400">
                                <thead className="text-[10px] text-slate-500 uppercase bg-[#161b2e] border-b border-[#252b46]">
                                    <tr>
                                        <th className="px-6 py-4 font-bold tracking-widest">Nombre</th>
                                        <th className="px-6 py-4 font-bold tracking-widest">Posición / Equipo</th>
                                        <th className="px-6 py-4 font-bold tracking-widest">Edad</th>
                                        <th className="px-6 py-4 font-bold tracking-widest">Rating</th>
                                        <th className="px-6 py-4 font-bold tracking-widest">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-[#0a0f1e]">
                                    {players.map(player => (
                                        <tr key={player.id} className="border-b border-[#252b46]/50 hover:bg-slate-800/20 transition-colors">
                                            <td className="px-6 py-4 font-bold text-white">{player.name}</td>
                                            <td className="px-6 py-4">{player.position} | {player.team}</td>
                                            <td className="px-6 py-4">{player.age}</td>
                                            <td className="px-6 py-4 text-[#bef264] font-bold">{player.overall_rating}</td>
                                            <td className="px-6 py-4 flex gap-3">
                                                <button className="p-2 text-slate-500 hover:text-blue-500 bg-slate-900 rounded-lg transition-colors"><Edit size={14} /></button>
                                                <button onClick={() => deletePlayer(player.id)} className="p-2 text-slate-500 hover:text-red-500 bg-slate-900 rounded-lg transition-colors"><Trash2 size={14} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                    {players.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-10 text-center text-slate-500 font-medium italic">No hay jugadores en la base de datos.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'usuarios' && (
                    <div className="space-y-6">
                        <div className="mb-8">
                            <h2 className="text-xl font-bold text-white">Gestión de Accesos</h2>
                            <p className="text-xs text-slate-500 mt-2">Controla qué usuarios tienen planes gratuitos o suscripciones PRO.</p>
                        </div>
                        <div className="overflow-x-auto rounded-3xl border border-[#252b46]">
                            <table className="w-full text-left text-sm text-slate-400">
                                <thead className="text-[10px] text-slate-500 uppercase bg-[#161b2e] border-b border-[#252b46]">
                                    <tr>
                                        <th className="px-6 py-4 font-bold tracking-widest">Email</th>
                                        <th className="px-6 py-4 font-bold tracking-widest">Status Actual</th>
                                        <th className="px-6 py-4 font-bold tracking-widest">Registro</th>
                                        <th className="px-6 py-4 font-bold tracking-widest">Acción de Poder</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-[#0a0f1e]">
                                    {users.map(user => (
                                        <tr key={user.id} className="border-b border-[#252b46]/50 hover:bg-slate-800/20 transition-colors">
                                            <td className="px-6 py-4 font-bold text-white">{user.email}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${user.role === 'pro' || user.role === 'semi-pro' ? 'bg-[#bef264]/20 text-[#bef264]' : 'bg-slate-800 text-slate-400'}`}>
                                                    {user.role || 'beginner'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-xs">{new Date(user.created_at).toLocaleDateString()}</td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => toggleUserTier(user.id, user.role || 'beginner')}
                                                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${user.role === 'beginner' || !user.role ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-400'}`}
                                                >
                                                    {user.role === 'beginner' || !user.role ? 'Convertir a PRO' : 'Degradar a Free'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {users.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-10 text-center text-slate-500 font-medium italic">No se encontraron usuarios sincronizados.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Add Player Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#0a0f1e] border border-[#252b46] rounded-3xl p-8 w-full max-w-2xl shadow-2xl relative overflow-y-auto max-h-[90vh] custom-scrollbar">
                        <h3 className="text-xl font-bold text-white mb-6">Nueva Ficha de Scouting</h3>
                        <form onSubmit={handleAddPlayer} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input required placeholder="Nombre (ej. Lamine Yamal)" value={newPlayer.name} onChange={e => setNewPlayer({ ...newPlayer, name: e.target.value })} className="w-full bg-[#161b2e] border border-[#252b46] rounded-xl px-4 py-3 text-sm focus:border-red-500 text-white" />
                                <input required placeholder="Posición (ej. Extremo Derecho)" value={newPlayer.position} onChange={e => setNewPlayer({ ...newPlayer, position: e.target.value })} className="w-full bg-[#161b2e] border border-[#252b46] rounded-xl px-4 py-3 text-sm focus:border-red-500 text-white" />
                                <input required type="number" placeholder="Edad (ej. 16)" value={newPlayer.age} onChange={e => setNewPlayer({ ...newPlayer, age: e.target.value })} className="w-full bg-[#161b2e] border border-[#252b46] rounded-xl px-4 py-3 text-sm focus:border-red-500 text-white" />
                                <input required placeholder="Equipo (ej. FC Barcelona)" value={newPlayer.team} onChange={e => setNewPlayer({ ...newPlayer, team: e.target.value })} className="w-full bg-[#161b2e] border border-[#252b46] rounded-xl px-4 py-3 text-sm focus:border-red-500 text-white" />
                                <input required placeholder="Nacionalidad (ej. España)" value={newPlayer.nationality} onChange={e => setNewPlayer({ ...newPlayer, nationality: e.target.value })} className="w-full bg-[#161b2e] border border-[#252b46] rounded-xl px-4 py-3 text-sm focus:border-red-500 text-white" />
                                <select value={newPlayer.tier} onChange={e => setNewPlayer({ ...newPlayer, tier: e.target.value })} className="w-full bg-[#161b2e] border border-[#252b46] rounded-xl px-4 py-3 text-sm focus:border-red-500 text-white">
                                    <option value="PROSPECT">PROSPECT (Promesa)</option>
                                    <option value="WONDERKID">WONDERKID (Joven Maravilla)</option>
                                    <option value="ELITE">ELITE (Clase Mundial)</option>
                                </select>
                                <input required type="number" placeholder="Rating General (ej. 84)" value={newPlayer.overall_rating} onChange={e => setNewPlayer({ ...newPlayer, overall_rating: e.target.value })} className="w-full bg-[#161b2e] border border-[#252b46] rounded-xl px-4 py-3 text-sm focus:border-red-500 text-white" />
                                <input required type="number" placeholder="Rating Potencial (ej. 95)" value={newPlayer.potential_rating} onChange={e => setNewPlayer({ ...newPlayer, potential_rating: e.target.value })} className="w-full bg-[#161b2e] border border-[#252b46] rounded-xl px-4 py-3 text-sm focus:border-red-500 text-white" />
                            </div>

                            <div className="flex items-center gap-3 pt-4 border-t border-[#252b46]">
                                <input type="checkbox" id="locked" checked={newPlayer.locked} onChange={e => setNewPlayer({ ...newPlayer, locked: e.target.checked })} className="w-4 h-4 accent-red-500" />
                                <label htmlFor="locked" className="text-sm font-bold text-slate-400">¿Bloquear para usuarios Free? (Requiere PRO)</label>
                            </div>

                            <div className="flex gap-4 pt-6">
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 px-4 py-3 rounded-xl font-bold uppercase tracking-widest bg-slate-800 text-white hover:bg-slate-700 transition">Cancelar</button>
                                <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-3 rounded-xl font-bold uppercase tracking-widest bg-red-600 text-white hover:bg-red-500 transition shadow-lg shadow-red-900/20">{isSubmitting ? 'Guardando...' : 'Confirmar Ingreso'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
