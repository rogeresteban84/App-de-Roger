import React, { useState } from 'react';
import { X, FileText, Check, AlertCircle } from 'lucide-react';
import { WheelItem } from '../types';

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (newItems: WheelItem[], mode: 'replace' | 'append') => void;
  currentCount: number;
}

export const BulkImportModal: React.FC<BulkImportModalProps> = ({
  isOpen,
  onClose,
  onImport,
  currentCount
}) => {
  const [text, setText] = useState<string>('');
  const [mode, setMode] = useState<'replace' | 'append'>('replace');

  if (!isOpen) return null;

  // Parse lines or comma-separated items
  const parsedItems = text
    .split(/[\n,;]+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);

  // Calculate final count depending on mode
  const availableSlots = 30 - (mode === 'append' ? currentCount : 0);
  const itemsToTake = parsedItems.slice(0, Math.max(0, mode === 'replace' ? 30 : availableSlots));
  const willExceed = mode === 'replace' ? parsedItems.length > 30 : currentCount + parsedItems.length > 30;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (itemsToTake.length === 0) return;

    const formatted: WheelItem[] = itemsToTake.map((txt) => ({
      id: crypto.randomUUID(),
      text: txt,
      active: true,
      timesWon: 0
    }));

    onImport(formatted, mode);
    setText('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg shadow-2xl p-6 text-slate-100 flex flex-col gap-4 relative"
        role="dialog"
        aria-modal="true"
        aria-labelledby="bulk-import-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <h3 id="bulk-import-title" className="text-lg font-bold text-white">
              Carga Masiva de Opciones
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Instructions */}
        <p className="text-sm text-slate-300">
          Pega o escribe tu lista de nombres o palabras. Puedes separar cada elemento con un salto de línea (Enter), coma (,) o punto y coma (;).
        </p>

        {/* Textarea */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Ejemplo:&#10;Carlos&#10;María&#10;Sofía&#10;Juan Pérez&#10;Lucas"
              rows={7}
              className="w-full bg-slate-950/70 border border-slate-700 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 font-mono transition-colors"
              autoFocus
            />
          </div>

          {/* Mode Selector */}
          <div className="flex items-center gap-4 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400 font-medium">Modo de carga:</span>
            <label className="flex items-center gap-2 cursor-pointer text-slate-200 hover:text-white">
              <input
                type="radio"
                name="import-mode"
                checked={mode === 'replace'}
                onChange={() => setMode('replace')}
                className="text-amber-500 focus:ring-amber-400"
              />
              <span>Reemplazar lista actual</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-slate-200 hover:text-white">
              <input
                type="radio"
                name="import-mode"
                checked={mode === 'append'}
                onChange={() => setMode('append')}
                className="text-amber-500 focus:ring-amber-400"
              />
              <span>Añadir a la actual ({currentCount}/30)</span>
            </label>
          </div>

          {/* Counter and Warning */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-300">
              <span>Detectadas: </span>
              <strong className="font-mono text-amber-400">{parsedItems.length}</strong>
              <span>· A importar: </span>
              <strong className="font-mono text-emerald-400">{itemsToTake.length}</strong>
              <span className="text-slate-500">(Tope máximo: 30)</span>
            </div>

            {willExceed && (
              <div className="flex items-center gap-1 text-amber-400 text-xs">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Se limitará a 30 opciones</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={itemsToTake.length === 0}
              className={`px-5 py-2 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all ${
                itemsToTake.length === 0
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
              }`}
            >
              <Check className="w-4 h-4" />
              Cargar {itemsToTake.length} Opciones
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
