import React, { useState } from 'react';
import client from '../api/client';
import { Clock, CheckCircle, DollarSign, StickyNote, Trash2, ArrowRight, Circle, CheckSquare, Loader } from 'lucide-react';

const EntryList = ({ entries, onUpdate }) => {
    const [processingId, setProcessingId] = useState(null);

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (!window.confirm("¿Segura que quieres eliminar esto?")) return;

        setProcessingId(id);
        try {
            await client.delete(`entries/${id}/`);
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error("Error deleting entry:", error);
            alert("No se pudo eliminar.");
        } finally {
            setProcessingId(null);
        }
    };

    const handleToggleComplete = async (entry, e) => {
        e.stopPropagation();
        setProcessingId(entry.id);
        try {
            await client.patch(`entries/${entry.id}/`, { is_completed: !entry.is_completed });
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error("Error updating entry:", error);
        } finally {
            setProcessingId(null);
        }
    };

    if (!entries || entries.length === 0) {
        return (
            <div className="text-center py-20">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="text-zinc-600" size={24} />
                </div>
                <p className="text-zinc-500 font-medium">Todo limpio.</p>
                <p className="text-zinc-600 text-sm mt-1">No tienes tareas ni gastos recientes.</p>
            </div>
        );
    }

    const getTypeConfig = (type) => {
        switch (type) {
            case 'EXPENSE': return { color: 'text-error', bg: 'bg-error/10', icon: DollarSign };
            case 'TASK': return { color: 'text-warning', bg: 'bg-warning/10', icon: CheckCircle };
            default: return { color: 'text-primary', bg: 'bg-primary/10', icon: StickyNote };
        }
    };

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(val || 0);
    };

    return (
        <div className="space-y-3">
            {entries.map((entry) => {
                // Skip NOTES if we want to hide them completely, but user said "remove ability to add", not necessarily view historic ones.
                // But for "Functional" feel, maybe we filter them out? 
                // Let's keep them readable but de-emphasized if they exist.

                const { color, bg, icon: Icon } = getTypeConfig(entry.type);
                const isCompleted = entry.is_completed;
                const isProcessing = processingId === entry.id;

                return (
                    <div key={entry.id} className={`group p-4 rounded-xl border border-transparent hover:border-white/5 hover:bg-white/[0.02] transition-all duration-200 flex items-start gap-4 select-none relative
                        ${isCompleted ? 'opacity-50' : 'opacity-100'}`}>

                        {/* Loading Overlay */}
                        {isProcessing && (
                            <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center rounded-xl backdrop-blur-sm">
                                <Loader size={20} className="animate-spin text-white" />
                            </div>
                        )}

                        {/* Icon / Checkbox */}
                        {entry.type === 'TASK' ? (
                            <button
                                onClick={(e) => handleToggleComplete(entry, e)}
                                className={`mt-1 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors
                                ${isCompleted ? 'bg-success/20 text-success' : 'bg-white/5 text-zinc-500 hover:bg-white/10 hover:text-zinc-300'}`}
                            >
                                {isCompleted ? <CheckSquare size={18} /> : <Circle size={18} />}
                            </button>
                        ) : (
                            <div className={`mt-1 w-10 h-10 rounded-full ${bg} flex items-center justify-center flex-shrink-0`}>
                                <Icon size={18} className={color} />
                            </div>
                        )}

                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                                <h4 className={`font-semibold truncate pr-4 text-base ${isCompleted ? 'text-zinc-500 line-through decoration-zinc-500' : 'text-zinc-200'}`}>
                                    {entry.title || "Sin título"}
                                </h4>
                                <span className="text-xs text-zinc-500 flex-shrink-0 pt-1">
                                    {new Date(entry.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                </span>
                            </div>

                            <p className={`text-sm mt-1 line-clamp-2 leading-relaxed ${isCompleted ? 'text-zinc-600' : 'text-zinc-500'}`}>
                                {entry.text}
                            </p>

                            {/* Meta Data */}
                            <div className="flex items-center gap-3 mt-3">
                                {entry.type === 'EXPENSE' && (
                                    <span className="text-sm font-medium text-zinc-300">
                                        {formatCurrency(entry.amount)}
                                    </span>
                                )}
                                {entry.type === 'TASK' && entry.due_date && (
                                    <span className={`text-xs flex items-center gap-1 ${new Date(entry.due_date) < new Date() && !isCompleted ? 'text-error font-bold' : 'text-zinc-400'}`}>
                                        <Clock size={12} />
                                        {new Date(entry.due_date).toLocaleDateString()}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Delete Action */}
                        <div className="self-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <button
                                onClick={(e) => handleDelete(entry.id, e)}
                                className="p-2 text-zinc-600 hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                                title="Eliminar"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default EntryList;
