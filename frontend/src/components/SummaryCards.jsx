import React from 'react';
import { List, TrendingUp, Wallet, CheckSquare } from 'lucide-react';

const SummaryCards = ({ entries, stats }) => {

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(val || 0);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

            {/* Expense Card */}
            <div className="glass-card p-6 rounded-3xl relative overflow-hidden group hover:border-error/20 transition-all duration-300">
                <div className="flex flex-col h-full justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-error/10 flex items-center justify-center text-error group-hover:rotate-12 transition-transform">
                            <TrendingUp size={24} />
                        </div>
                        <span className="text-xs text-error font-bold uppercase tracking-wider bg-error/5 px-3 py-1 rounded-full">
                            Este Mes
                        </span>
                    </div>
                    <div>
                        <h3 className="text-zinc-500 text-sm font-medium mb-1">Gastos Totales</h3>
                        <p className="text-4xl font-display font-bold text-white tracking-tight">{formatCurrency(stats?.total_expenses_month)}</p>
                    </div>
                </div>
            </div>

            {/* Tasks Card */}
            <div className="glass-card p-6 rounded-3xl relative overflow-hidden group hover:border-warning/20 transition-all duration-300">
                <div className="flex flex-col h-full justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-warning/10 flex items-center justify-center text-warning group-hover:rotate-12 transition-transform">
                            <CheckSquare size={24} />
                        </div>
                        <span className="text-xs text-warning font-bold uppercase tracking-wider bg-warning/5 px-3 py-1 rounded-full">
                            Por Hacer
                        </span>
                    </div>
                    <div>
                        <h3 className="text-zinc-500 text-sm font-medium mb-1">Pendientes</h3>
                        <p className="text-4xl font-display font-bold text-white tracking-tight">{stats?.pending_tasks || 0}</p>
                    </div>
                </div>
            </div>

            {/* Net Balance / Insight Placeholder (Could be expanded later) */}
            {/* <div className="md:col-span-2 glass-card p-4 rounded-2xl flex items-center justify-between opacity-50">
                 <span className="text-xs text-zinc-500">Implementar visualización de presupuesto mensual...</span>
                 <Wallet size={16} className="text-zinc-600"/>
            </div> */}

        </div>
    );
};

export default SummaryCards;
