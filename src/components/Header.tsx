import React from 'react';
import { CircleDot, PlusCircle, HelpCircle } from 'lucide-react';

interface HeaderProps {
  onQuickReset: () => void;
  onOpenHelp: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onQuickReset,
  onOpenHelp
}) => {
  return (
    <header className="w-full bg-slate-900/95 border-b border-slate-800 sticky top-0 z-40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark (single text element) */}
        <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/20">
            <CircleDot className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="text-lg font-extrabold text-white tracking-tight font-display">
            Ruleta de Decisiones
          </span>
        </div>

        {/* Zone 2: 4-5 concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
          <button
            onClick={onOpenHelp}
            className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Cómo Usar</span>
          </button>
          <span className="text-slate-600">·</span>
          <span className="text-slate-400 whitespace-nowrap shrink-0">
            Máx 30 opciones
          </span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-400 whitespace-nowrap shrink-0">
            Sonidos & Confeti
          </span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-400 whitespace-nowrap shrink-0">
            Sorteos Justos
          </span>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onQuickReset}
            className="px-3.5 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0"
            title="Reiniciar con una nueva ruleta"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Nueva Ruleta</span>
          </button>
        </div>
      </div>
    </header>
  );
};
