import React, { useEffect } from 'react';
import { Trophy, Trash2, RotateCw, X, Sparkles } from 'lucide-react';
import { WheelItem } from '../types';
import { fireWinnerConfetti } from '../utils/confetti';
import { soundFx } from '../utils/audio';

interface WinnerModalProps {
  winner: WheelItem | null;
  isOpen: boolean;
  onClose: () => void;
  onRemoveWinner: (id: string) => void;
  onSpinAgain: () => void;
}

export const WinnerModal: React.FC<WinnerModalProps> = ({
  winner,
  isOpen,
  onClose,
  onRemoveWinner,
  onSpinAgain
}) => {
  useEffect(() => {
    if (isOpen && winner) {
      fireWinnerConfetti();
    }
  }, [isOpen, winner]);

  if (!isOpen || !winner) return null;

  const handleEliminate = () => {
    onRemoveWinner(winner.id);
    onClose();
  };

  const handleSpinAgain = () => {
    onClose();
    setTimeout(() => {
      onSpinAgain();
    }, 150);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-amber-500/40 rounded-3xl w-full max-w-md shadow-2xl p-7 text-center relative overflow-hidden flex flex-col items-center"
        role="dialog"
        aria-modal="true"
        aria-labelledby="winner-title"
      >
        {/* Subtle decorative background glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close icon */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Trophy icon emblem */}
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-4 text-amber-400 shadow-lg shadow-amber-500/10 animate-bounce">
          <Trophy className="w-9 h-9" />
        </div>

        {/* Title */}
        <span className="text-xs uppercase tracking-widest font-bold text-amber-400 font-mono">
          ¡Tenemos un ganador!
        </span>

        {/* Winner Name in large, bold, high-contrast typography */}
        <div className="my-5 px-4 py-3.5 bg-slate-800/80 border border-slate-700/80 rounded-2xl w-full max-w-sm">
          <h2
            id="winner-title"
            className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight break-words font-display"
          >
            {winner.text}
          </h2>
        </div>

        {/* Confetti button */}
        <button
          onClick={() => {
            fireWinnerConfetti();
            soundFx.playWin();
          }}
          className="inline-flex items-center gap-1.5 text-xs text-amber-300 hover:text-amber-200 mb-6 underline underline-offset-4 decoration-amber-400/40 hover:decoration-amber-300 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Celebrar de nuevo (¡Más confeti!)
        </button>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full">
          <button
            onClick={handleSpinAgain}
            className="w-full sm:flex-1 py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5 transition-all"
          >
            <RotateCw className="w-4 h-4" />
            <span>Girar de nuevo</span>
          </button>

          <button
            onClick={handleEliminate}
            className="w-full sm:flex-1 py-3 px-4 bg-slate-800 hover:bg-rose-950/50 hover:text-rose-300 hover:border-rose-800/60 border border-slate-700 text-slate-200 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all"
            title="Quita esta opción de la ruleta para las siguientes tiradas"
          >
            <Trash2 className="w-4 h-4" />
            <span>Eliminar opción</span>
          </button>
        </div>
      </div>
    </div>
  );
};
