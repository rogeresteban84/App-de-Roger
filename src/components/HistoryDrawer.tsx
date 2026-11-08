import React from 'react';
import { X, History, Trash2, Award } from 'lucide-react';
import { SpinResult } from '../types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: SpinResult[];
  onClearHistory: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onClearHistory
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md shadow-2xl p-6 text-slate-100 flex flex-col gap-4 relative max-h-[85vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="history-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-amber-400" />
            <h3 id="history-title" className="text-lg font-bold text-white">
              Historial de Ganadores
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

        {/* List of spins */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-[200px] max-h-[400px]">
          {history.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-center text-slate-500 text-xs">
              <Award className="w-8 h-8 mb-2 text-slate-600" />
              <p className="font-semibold text-slate-400">Aún no hay giros registrados</p>
              <p className="mt-1">Gira la ruleta para ver aquí a los ganadores seleccionados.</p>
            </div>
          ) : (
            history.map((record, index) => {
              const timeString = new Date(record.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              });

              return (
                <div
                  key={`${record.item.id}-${record.timestamp}-${index}`}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center font-bold text-[10px] shrink-0 font-mono">
                      #{history.length - index}
                    </span>
                    <span className="font-bold text-white truncate text-sm">
                      {record.item.text}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 shrink-0 ml-2">
                    {timeString}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
          <span className="text-slate-400">
            Total de giros: <strong className="text-white font-mono">{history.length}</strong>
          </span>

          <button
            onClick={() => {
              if (confirm('¿Deseas borrar todo el historial?')) {
                onClearHistory();
              }
            }}
            disabled={history.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Limpiar historial</span>
          </button>
        </div>
      </div>
    </div>
  );
};
