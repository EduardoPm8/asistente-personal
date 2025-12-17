import React, { useState } from 'react';
import client from '../api/client';
import { Send, DollarSign, Calendar, FileText, CheckCircle, Loader, Mic, Hash, Sparkles, Smile, Frown, Meh, Tag } from 'lucide-react';

const EntryForm = ({ onEntryCreated }) => {
    const [type, setType] = useState('TASK'); // Default to TASK, no NOTE allowed
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [amount, setAmount] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [sentiment, setSentiment] = useState('neutral');

    // Mock features for UI demo
    const [isRecording, setIsRecording] = useState(false);
    const [tags, setTags] = useState([]);
    const [currentTag, setCurrentTag] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let finalText = text;
            if (tags.length > 0) finalText += `\n\nTags: ${tags.map(t => `#${t}`).join(' ')}`;
            // Mood is less relevant without notes, but kept for context if user wants

            const data = {
                type,
                title,
                text: finalText,
                amount: type === 'EXPENSE' ? parseFloat(amount) : null,
                due_date: type === 'TASK' ? dueDate : null
            };
            await client.post('entries/', data);

            setTitle('');
            setText('');
            setAmount('');
            setDueDate('');
            setTags([]);
            if (onEntryCreated) onEntryCreated();
        } catch (error) {
            console.error("Error creating entry:", error);
            alert("Error al guardar.");
        } finally {
            setLoading(false);
        }
    };

    const handleAddTag = (e) => {
        if (e.key === 'Enter' && currentTag.trim()) {
            e.preventDefault();
            setTags([...tags, currentTag.trim()]);
            setCurrentTag('');
        }
    };

    const getTypeClasses = (selected) => {
        const isActive = type === selected;
        let activeColor = 'text-zinc-500 border-transparent hover:bg-white/5 saturate-0';

        if (isActive) {
            if (selected === 'EXPENSE') activeColor = 'border-error text-error bg-error/5 shadow-[0_0_20px_-10px_var(--color-error)] saturate-100';
            else activeColor = 'border-warning text-warning bg-warning/5 shadow-[0_0_20px_-10px_var(--color-warning)] saturate-100';
        }

        return `flex-1 py-4 text-sm font-bold transition-all duration-300 border-b-2 flex flex-col items-center justify-center gap-2 uppercase tracking-wider ${activeColor}`;
    };

    return (
        <div className="glass-panel rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative">

            {/* Ambient Glow */}
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 blur-[80px] transition-colors duration-500
                ${type === 'EXPENSE' ? 'bg-error' : 'bg-warning'}`}>
            </div>

            {/* Type Selector - 2 COLUMNS ONLY */}
            <div className="flex border-b border-white/5 bg-black/20 backdrop-blur-md">
                <button type="button" onClick={() => setType('TASK')} className={getTypeClasses('TASK')}>
                    <CheckCircle size={24} /> <span>Tarea / Recordatorio</span>
                </button>
                <button type="button" onClick={() => setType('EXPENSE')} className={getTypeClasses('EXPENSE')}>
                    <DollarSign size={24} /> <span>Gasto / Compra</span>
                </button>
            </div>

            <div className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Main Input Area */}
                    <div className="space-y-6">
                        <input
                            type="text"
                            placeholder={type === 'EXPENSE' ? "¿Qué compraste?" : "¿Qué hay que hacer?"}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-transparent border-b-2 border-white/10 px-2 py-4 text-2xl font-medium text-white placeholder-zinc-600 focus:outline-none focus:border-white/30 transition-all font-display"
                            autoFocus
                        />

                        {type === 'EXPENSE' && (
                            <div className="flex items-center gap-4 animate-slide-up">
                                <span className="text-2xl text-zinc-500 font-light">$</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full bg-transparent text-5xl font-bold text-error placeholder-zinc-800 focus:outline-none tracking-tight"
                                    required
                                />
                            </div>
                        )}

                        {type === 'TASK' && (
                            <div className="animate-slide-up bg-surfaceHighlight/50 p-4 rounded-xl border border-white/5 flex flex-col gap-2">
                                <label className="text-xs text-warning uppercase tracking-widest font-bold flex items-center gap-2">
                                    <Calendar size={12} /> Fecha Límite
                                </label>
                                <input
                                    type="datetime-local"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    className="w-full bg-transparent text-zinc-200 focus:outline-none [color-scheme:dark] text-lg font-mono"
                                    required
                                />
                            </div>
                        )}

                        <textarea
                            placeholder="Detalles adicionales..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            rows="2"
                            className="w-full bg-transparent text-zinc-400 placeholder-zinc-700 focus:outline-none focus:text-zinc-200 transition-all resize-none text-sm"
                        />
                    </div>

                    {/* Simple Toolbar */}
                    <div className="flex flex-wrap items-center gap-3 py-2 border-t border-white/5 pt-4">
                        <div className="flex items-center gap-2 text-zinc-500">
                            <Tag size={16} />
                        </div>

                        {/* Tag Input */}
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Añadir etiqueta..."
                                className="bg-transparent text-sm text-zinc-300 placeholder-zinc-600 focus:outline-none w-full"
                                value={currentTag}
                                onChange={(e) => setCurrentTag(e.target.value)}
                                onKeyDown={handleAddTag}
                            />
                        </div>
                    </div>

                    {/* Tags Display */}
                    {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag, i) => (
                                <span key={i} className="text-xs font-medium text-white bg-white/10 px-2 py-1 rounded-md">#{tag}</span>
                            ))}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-5 px-6 rounded-2xl font-bold flex justify-center items-center gap-3 transition-all transform hover:scale-[1.01] active:scale-[0.99] shadow-xl
                            ${type === 'EXPENSE' ? 'bg-gradient-to-r from-error to-pink-600 shadow-error/20' :
                                'bg-gradient-to-r from-warning to-orange-500 shadow-warning/20'}`}
                    >
                        {loading ? <Loader className="animate-spin text-white" /> :
                            <>
                                <span className="text-white text-lg tracking-wide uppercase">
                                    {type === 'EXPENSE' ? 'Registrar Gasto' : 'Crear Tarea'}
                                </span>
                                <Send size={20} className="text-white" />
                            </>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EntryForm;
