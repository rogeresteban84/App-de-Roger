import React from 'react';
import { 
  Volume2, 
  VolumeX, 
  Clock, 
  Palette, 
  History, 
  Flame
} from 'lucide-react';
import { ColorThemeId, SpinDuration } from '../types';
import { COLOR_THEMES } from '../utils/colors';

interface SettingsBarProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  duration: SpinDuration;
  onChangeDuration: (dur: SpinDuration) => void;
  themeId: ColorThemeId;
  onChangeTheme: (theme: ColorThemeId) => void;
  autoEliminate: boolean;
  onToggleAutoEliminate: () => void;
  historyCount: number;
  onOpenHistory: () => void;
}

export const SettingsBar: React.FC<SettingsBarProps> = ({
  soundEnabled,
  onToggleSound,
  duration,
  onChangeDuration,
  themeId,
  onChangeTheme,
  autoEliminate,
  onToggleAutoEliminate,
  historyCount,
  onOpenHistory
}) => {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs shadow-md">
      {/* Left controls: Theme & Duration */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Color Palette Selector */}
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-slate-400" />
          <span className="text-slate-400 font-medium hidden sm:inline">Tema:</span>
          <select
            value={themeId}
            onChange={(e) => onChangeTheme(e.target.value as ColorThemeId)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-amber-400 cursor-pointer"
          >
            {COLOR_THEMES.map(t => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* Spin Duration */}
        <div className="flex items-center gap-1.5 bg-slate-950/60 p-1 rounded-lg border border-slate-800">
          <Clock className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
          <button
            onClick={() => onChangeDuration(3)}
            className={`px-2 py-0.5 rounded font-medium transition-colors ${
              duration === 3 ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
            title="Giro rápido (3 segundos)"
          >
            3s
          </button>
          <button
            onClick={() => onChangeDuration(5)}
            className={`px-2 py-0.5 rounded font-medium transition-colors ${
              duration === 5 ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
            title="Giro normal (5 segundos)"
          >
            5s
          </button>
          <button
            onClick={() => onChangeDuration(8)}
            className={`px-2 py-0.5 rounded font-medium transition-colors ${
              duration === 8 ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
            title="Giro con suspenso (8 segundos)"
          >
            8s
          </button>
        </div>

        {/* Auto-Eliminate Mode Toggle */}
        <button
          onClick={onToggleAutoEliminate}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all ${
            autoEliminate
              ? 'bg-rose-500/10 border-rose-500/40 text-rose-300'
              : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-300'
          }`}
          title="Elimina automáticamente de la ruleta a quien gane"
        >
          <Flame className={`w-3.5 h-3.5 ${autoEliminate ? 'text-rose-400' : 'text-slate-500'}`} />
          <span>Eliminar ganador al salir</span>
        </button>
      </div>

      {/* Right controls: Sound & History */}
      <div className="flex items-center gap-3">
        {/* Sound FX Toggle */}
        <button
          onClick={onToggleSound}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-colors ${
            soundEnabled
              ? 'bg-slate-800 border-slate-700 text-slate-200'
              : 'bg-slate-950 border-slate-800 text-slate-500'
          }`}
          title={soundEnabled ? 'Silenciar sonidos' : 'Activar efectos de sonido'}
        >
          {soundEnabled ? (
            <Volume2 className="w-3.5 h-3.5 text-amber-400" />
          ) : (
            <VolumeX className="w-3.5 h-3.5" />
          )}
          <span className="hidden sm:inline">{soundEnabled ? 'Sonido' : 'Silencio'}</span>
        </button>

        {/* History Modal Trigger */}
        <button
          onClick={onOpenHistory}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-colors"
          title="Ver historial de ganadores"
        >
          <History className="w-3.5 h-3.5 text-amber-400" />
          <span>Historial</span>
          {historyCount > 0 && (
            <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold font-mono">
              {historyCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
