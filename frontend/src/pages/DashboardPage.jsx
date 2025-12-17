import React, { useEffect, useState } from 'react';
import client from '../api/client';
import EntryForm from '../components/EntryForm';
import EntryList from '../components/EntryList';
import SummaryCards from '../components/SummaryCards';
import { LogOut, Zap, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
    const [entries, setEntries] = useState([]);
    const [stats, setStats] = useState({});
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const [entriesRes, statsRes] = await Promise.all([
                client.get('entries/'),
                client.get('stats/summary/')
            ]);
            setEntries(entriesRes.data);
            setStats(statsRes.data);
        } catch (error) {
            console.error("Error fetching data", error);
            if (error.response && error.response.status === 401) {
                navigate('/login');
            }
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
    };

    return (
        <div className="min-h-screen p-6 lg:p-8 max-w-[1600px] mx-auto flex flex-col">

            {/* Minimal Header */}
            <header className="flex justify-between items-center mb-8 bg-surface/30 backdrop-blur-xl p-4 rounded-2xl border border-white/5 sticky top-6 z-50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
                        <Zap size={20} className="text-white fill-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-display font-bold text-white leading-none">Mi Vida Automática</h1>
                        <p className="text-xs text-zinc-500 font-medium tracking-wide">ASSISTANT V2.1</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={handleLogout}
                        className="p-2 rounded-full hover:bg-white/5 text-zinc-400 hover:text-white transition-colors"
                        title="Cerrar Sesión"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </header>

            <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Left Column: Stats & Data Stream (Secondary) */}
                <div className="lg:col-span-5 space-y-8 order-2 lg:order-1 h-full flex flex-col">
                    <SummaryCards entries={entries} stats={stats} />

                    <div className="glass-panel rounded-3xl p-6 flex-1 flex flex-col min-h-[500px]">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-2">
                                <Activity size={18} className="text-primary" />
                                <h2 className="text-lg font-display font-bold text-white">Stream de Actividad</h2>
                            </div>
                            <span className="text-xs font-medium text-zinc-500 px-3 py-1 rounded-full bg-white/5 border border-white/5">
                                {entries.length} items
                            </span>
                        </div>
                        <div className="overflow-y-auto pr-2 custom-scrollbar flex-1">
                            <EntryList entries={entries} onUpdate={fetchData} />
                        </div>
                    </div>
                </div>

                {/* Right Column: Super Input (Primary focus) */}
                <div className="lg:col-span-7 order-1 lg:order-2 sticky top-28">
                    <div className="mb-4 text-center lg:text-left">
                        <h2 className="text-3xl lg:text-5xl font-display font-bold text-white mb-2">
                            Gestión Rápida
                        </h2>
                        <p className="text-zinc-400 text-lg">Registra gastos o tareas pendientes.</p>
                    </div>

                    <EntryForm onEntryCreated={fetchData} />

                    {/* Quick Suggestions / Footer */}
                    <div className="mt-8 flex gap-4 justify-center lg:justify-start opacity-50 hover:opacity-100 transition-opacity">
                        <button className="text-xs text-zinc-500 hover:text-primary transition-colors">Comandos de Voz</button>
                        <span className="text-zinc-700">•</span>
                        <button className="text-xs text-zinc-500 hover:text-primary transition-colors">Atajos de Teclado</button>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default DashboardPage;
