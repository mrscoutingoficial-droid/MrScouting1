'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Rect, Circle, Line, Group, Text, Arrow } from 'react-konva';
import { MousePointer2, Pencil, Trash2, UserPlus, ArrowRight, Download, Save, Cloud } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Player {
    id: string;
    x: number;
    y: number;
    team: 'home' | 'away';
    number: string;
}

interface Drawing {
    id: string;
    points: number[];
    color: string;
    type: 'line' | 'arrow';
}

export function TacticalBoard() {
    const stageRef = useRef<any>(null);
    const [players, setPlayers] = useState<Player[]>([
        { id: 'h1', x: 400, y: 400, team: 'home', number: '1' },
        { id: 'a1', x: 400, y: 50, team: 'away', number: '1' },
    ]);
    const [drawings, setDrawings] = useState<Drawing[]>([]);
    const [isDrawing, setIsDrawing] = useState(false);
    const [tool, setTool] = useState<'move' | 'line' | 'arrow'>('move');
    const [teamToAdd, setTeamToAdd] = useState<'home' | 'away'>('home');

    // Supabase State
    const [userId, setUserId] = useState<string | null>(null);
    const [savedBoards, setSavedBoards] = useState<any[]>([]);
    const [currentBoardId, setCurrentBoardId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserId(user.id);
                fetchBoards(user.id);
            }
        };
        init();
    }, []);

    const fetchBoards = async (uid: string) => {
        const { data } = await supabase
            .from('tactical_boards')
            .select('*')
            .eq('user_id', uid)
            .order('created_at', { ascending: false });
        if (data) setSavedBoards(data);
    };

    const saveBoard = async () => {
        if (!userId) return;
        setIsSaving(true);
        let nameToSave = "Planteamiento Táctico";

        if (currentBoardId) {
            const existing = savedBoards.find(b => b.id === currentBoardId);
            if (existing) nameToSave = existing.name;
        } else {
            const promptName = window.prompt("Nombre para esta pizarra:", "Pizarra 4-3-3 Ofensiva");
            if (!promptName) { setIsSaving(false); return; }
            nameToSave = promptName;
        }

        const payload = {
            user_id: userId,
            name: nameToSave,
            players_data: players,
            drawings_data: drawings
        };

        if (currentBoardId) {
            await supabase.from('tactical_boards').update(payload).eq('id', currentBoardId);
        } else {
            const { data } = await supabase.from('tactical_boards').insert(payload).select().single();
            if (data) {
                setCurrentBoardId(data.id);
            }
        }
        await fetchBoards(userId);
        setIsSaving(false);
    };

    const loadBoard = (boardId: string) => {
        if (!boardId) {
            setCurrentBoardId(null);
            clearBoard();
            return;
        }
        const board = savedBoards.find(b => b.id === boardId);
        if (board) {
            setPlayers(board.players_data || []);
            setDrawings(board.drawings_data || []);
            setCurrentBoardId(board.id);
        }
    };

    // Drawing state
    const currentDrawing = useRef<Drawing | null>(null);

    const handleMouseDown = (e: any) => {
        if (tool === 'move') return;

        setIsDrawing(true);
        const pos = e.target.getStage().getPointerPosition();
        const newDrawing: Drawing = {
            id: `d-${Date.now()}`,
            points: [pos.x, pos.y],
            color: '#bef264',
            type: tool as 'line' | 'arrow',
        };
        currentDrawing.current = newDrawing;
        setDrawings([...drawings, newDrawing]);
    };

    const handleMouseMove = (e: any) => {
        if (!isDrawing || !currentDrawing.current) return;

        const stage = e.target.getStage();
        const point = stage.getPointerPosition();

        const lastDrawing = drawings[drawings.length - 1];
        if (tool === 'line') {
            lastDrawing.points = lastDrawing.points.concat([point.x, point.y]);
        } else if (tool === 'arrow') {
            // For arrows, we only care about start and end
            lastDrawing.points = [lastDrawing.points[0], lastDrawing.points[1], point.x, point.y];
        }

        setDrawings([...drawings.slice(0, -1), lastDrawing]);
    };

    const handleMouseUp = () => {
        setIsDrawing(false);
        currentDrawing.current = null;
    };

    const addPlayer = () => {
        const newPlayer: Player = {
            id: `p-${Date.now()}`,
            x: 400,
            y: 225,
            team: teamToAdd,
            number: (players.filter(p => p.team === teamToAdd).length + 1).toString(),
        };
        setPlayers([...players, newPlayer]);
    };

    const clearBoard = () => {
        setDrawings([]);
        setPlayers([
            { id: 'h1', x: 400, y: 400, team: 'home', number: '1' },
            { id: 'a1', x: 400, y: 50, team: 'away', number: '1' },
        ]);
    };

    const exportImage = () => {
        const uri = stageRef.current.toDataURL();
        const link = document.createElement('a');
        link.download = 'mr-scouting-tactics.png';
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="flex flex-col gap-4 w-full">
            {/* Top Cloud Sync Bar */}
            <div className="flex items-center justify-between bg-[#161b2e]/50 p-3 rounded-2xl border border-[#252b46]/50">
                <div className="flex items-center gap-3">
                    <Cloud className="w-5 h-5 text-blue-500" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nube Táctica</span>
                </div>
                <div className="flex items-center gap-3">
                    <select
                        value={currentBoardId || ''}
                        onChange={(e) => loadBoard(e.target.value)}
                        className="bg-[#0a0f1e] border border-[#252b46] rounded-xl px-4 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500 font-medium"
                    >
                        <option value="">+ Nueva Pizarra Limpia</option>
                        {savedBoards.map(b => (
                            <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                    </select>
                    <button
                        onClick={saveBoard}
                        disabled={isSaving}
                        className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-[2px] transition-all flex items-center gap-2 ${isSaving ? 'bg-slate-800 text-slate-500' : 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/20'}`}
                    >
                        <Save size={14} /> {isSaving ? 'Guardando...' : 'Guardar en Nube'}
                    </button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-[#161b2e] p-3 rounded-2xl border border-[#252b46] shadow-xl">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setTool('move')}
                        className={`p-2 rounded-lg transition-all ${tool === 'move' ? 'bg-[#162d9c] text-[#bef264]' : 'bg-[#0a0f1e] text-slate-400 hover:text-white'}`}
                        title="Mover"
                    >
                        <MousePointer2 size={20} />
                    </button>
                    <button
                        onClick={() => setTool('line')}
                        className={`p-2 rounded-lg transition-all ${tool === 'line' ? 'bg-[#162d9c] text-[#bef264]' : 'bg-[#0a0f1e] text-slate-400 hover:text-white'}`}
                        title="Dibujar Línea"
                    >
                        <Pencil size={20} />
                    </button>
                    <button
                        onClick={() => setTool('arrow')}
                        className={`p-2 rounded-lg transition-all ${tool === 'arrow' ? 'bg-[#162d9c] text-[#bef264]' : 'bg-[#0a0f1e] text-slate-400 hover:text-white'}`}
                        title="Dibujar Flecha"
                    >
                        <ArrowRight size={20} />
                    </button>
                </div>

                <div className="h-8 w-[1px] bg-[#252b46] hidden sm:block" />

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setTeamToAdd('home')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${teamToAdd === 'home' ? 'bg-blue-600 text-white' : 'bg-[#0a0f1e] text-slate-400'}`}
                    >
                        LOCAL
                    </button>
                    <button
                        onClick={() => setTeamToAdd('away')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${teamToAdd === 'away' ? 'bg-red-600 text-white' : 'bg-[#0a0f1e] text-slate-400'}`}
                    >
                        VISITANTE
                    </button>
                    <button
                        onClick={addPlayer}
                        className="p-2 bg-[#bef264] text-[#0a0f1e] rounded-lg hover:bg-[#a3e635] transition-all shadow-lg shadow-[#bef264]/10"
                        title="Añadir Jugador"
                    >
                        <UserPlus size={20} />
                    </button>
                </div>

                <div className="h-8 w-[1px] bg-[#252b46] hidden sm:block" />

                <div className="flex items-center gap-2 ml-auto">
                    <button
                        onClick={exportImage}
                        className="p-2 bg-[#0a0f1e] text-blue-400 border border-blue-500/20 rounded-lg hover:bg-blue-500/10 transition-all"
                        title="Exportar Imagen"
                    >
                        <Download size={20} />
                    </button>
                    <button
                        onClick={clearBoard}
                        className="p-2 bg-[#0a0f1e] text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/10 transition-all"
                        title="Limpiar Todo"
                    >
                        <Trash2 size={20} />
                    </button>
                </div>
            </div>

            {/* Board Container */}
            <div className="border border-[#252b46] rounded-3xl overflow-hidden bg-[#0a0f1e] aspect-video w-full shadow-2xl relative group">
                <div className="absolute top-4 left-4 z-10 pointer-events-none">
                    <div className="text-[10px] font-black text-slate-600 uppercase tracking-[3px]">MR. SCOUTING TACTICAL ENGINE</div>
                </div>

                <Stage
                    width={800}
                    height={450}
                    ref={stageRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    className={`bg-[#0a0f1e] relative touch-none ${tool !== 'move' ? 'cursor-crosshair' : 'cursor-default'}`}
                >
                    <Layer>
                        {/* Smooth Pitch Background */}
                        <Rect x={0} y={0} width={800} height={450} fill="#0d2b1d" />

                        {/* Subtle Glow beneath the pitch */}
                        <Rect x={20} y={20} width={760} height={410} fill="#14532d" shadowBlur={50} shadowColor="#10b981" shadowOpacity={0.1} />

                        {/* Grass stripes pattern with vertical gradients */}
                        {[...Array(12)].map((_, i) => (
                            <Rect
                                key={i}
                                x={i * 66.6}
                                y={20}
                                width={33.3}
                                height={410}
                                fill="#064e3b"
                                opacity={0.2}
                            />
                        ))}

                        {/* Markings - Subtle and semi-transparent */}
                        <Rect x={20} y={20} width={760} height={410} stroke="rgba(255,255,255,0.2)" strokeWidth={1.5} />
                        <Line points={[400, 20, 400, 430]} stroke="rgba(255,255,255,0.2)" strokeWidth={1.5} />
                        <Circle x={400} y={225} radius={60} stroke="rgba(255,255,255,0.2)" strokeWidth={1.5} />
                        <Circle x={400} y={225} radius={3} fill="rgba(255,255,255,0.5)" />

                        {/* Area Home */}
                        <Group>
                            <Rect x={20} y={100} width={120} height={250} stroke="rgba(255,255,255,0.2)" strokeWidth={1.5} />
                            <Rect x={20} y={165} width={45} height={120} stroke="rgba(255,255,255,0.2)" strokeWidth={1.5} />
                            <Circle x={110} y={225} radius={2} fill="rgba(255,255,255,0.4)" />
                        </Group>

                        {/* Area Away */}
                        <Group>
                            <Rect x={660} y={100} width={120} height={250} stroke="rgba(255,255,255,0.2)" strokeWidth={1.5} />
                            <Rect x={735} y={165} width={45} height={120} stroke="rgba(255,255,255,0.2)" strokeWidth={1.5} />
                            <Circle x={690} y={225} radius={2} fill="rgba(255,255,255,0.4)" />
                        </Group>

                        {/* Corner arcs */}
                        <Circle x={20} y={20} radius={15} stroke="rgba(255,255,255,0.2)" strokeWidth={1.5} startAngle={0} endAngle={90} />
                        <Circle x={780} y={20} radius={15} stroke="rgba(255,255,255,0.2)" strokeWidth={1.5} startAngle={90} endAngle={180} />
                        <Circle x={20} y={430} radius={15} stroke="rgba(255,255,255,0.2)" strokeWidth={1.5} startAngle={270} endAngle={360} />
                        <Circle x={780} y={430} radius={15} stroke="rgba(255,255,255,0.2)" strokeWidth={1.5} startAngle={180} endAngle={270} />

                        {/* Drawings */}
                        {drawings.map((draw) => (
                            draw.type === 'line' ? (
                                <Line
                                    key={draw.id}
                                    points={draw.points}
                                    stroke={draw.color}
                                    strokeWidth={3}
                                    tension={0.5}
                                    lineCap="round"
                                />
                            ) : (
                                <Arrow
                                    key={draw.id}
                                    points={draw.points}
                                    stroke={draw.color}
                                    fill={draw.color}
                                    strokeWidth={3}
                                    pointerLength={10}
                                    pointerWidth={10}
                                />
                            )
                        ))}

                        {/* Players */}
                        {players.map((player) => (
                            <Group
                                key={player.id}
                                x={player.x}
                                y={player.y}
                                draggable={tool === 'move'}
                                onDragEnd={(e) => {
                                    const newPlayers = players.map(p =>
                                        p.id === player.id ? { ...p, x: e.target.x(), y: e.target.y() } : p
                                    );
                                    setPlayers(newPlayers);
                                }}
                            >
                                <Circle
                                    radius={15}
                                    fill={player.team === 'home' ? '#2563eb' : '#dc2626'}
                                    stroke="white"
                                    strokeWidth={2}
                                    shadowBlur={10}
                                    shadowOpacity={0.4}
                                />
                                <Text
                                    text={player.number}
                                    fontSize={12}
                                    fontStyle="bold"
                                    fill="white"
                                    x={-4}
                                    y={-6}
                                    listening={false}
                                />
                            </Group>
                        ))}
                    </Layer>
                </Stage>
            </div>
            <div className="px-4 py-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
                <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest text-center">
                    TIP: Selecciona "Dibujar" para marcar movimientos. Pulsa el icono de Descargar para guardar tu pizarra.
                </p>
            </div>
        </div>
    );
}
