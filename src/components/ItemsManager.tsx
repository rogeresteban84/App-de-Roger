import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Shuffle, 
  SortAsc, 
  CheckSquare, 
  Square, 
  FileText, 
  Sparkles,
  Edit2, 
  Check,
  RotateCcw
} from 'lucide-react';
import { WheelItem, ColorThemeId } from '../types';
import { getItemColor } from '../utils/colors';
import { PRESET_COLLECTIONS } from '../utils/presets';
import { soundFx } from '../utils/audio';

interface ItemsManagerProps {
  items: WheelItem[];
  themeId: ColorThemeId;
  onAddItem: (text: string) => void;
  onRemoveItem: (id: string) => void;
  onToggleItem: (id: string) => void;
  onUpdateItemText: (id: string, text: string) => void;
  onShuffle: () => void;
  onSortAlphabetical: () => void;
  onClearAll: () => void;
  onOpenBulkModal: () => void;
  onLoadPreset: (presetItems: string[]) => void;
}

export const ItemsManager: React.FC<ItemsManagerProps> = ({
  items,
  themeId,
  onAddItem,
  onRemoveItem,
  onToggleItem,
  onUpdateItemText,
  onShuffle,
  onSortAlphabetical,
  onClearAll,
  onOpenBulkModal,
  onLoadPreset
}) => {
  const [inputText, setInputText] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string>('');

  const isAtLimit = items.length >= 30;
  const activeCount = items.filter(i => i.active).length;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isAtLimit) return;
    onAddItem(inputText.trim());
    setInputText('');
    soundFx.playClick();
  };

  const startEditing = (item: WheelItem) => {
    setEditingId(item.id);
    setEditingText(item.text);
  };

  const saveEditing = (id: string) => {
    if (editingText.trim()) {
      onUpdateItemText(id, editingText.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col h-full shadow-xl">
      {/* Header with 30-item limit counter */}
      <div className="flex flex-col gap-2 pb-4 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white tracking-tight">
              Opciones de la Ruleta
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-md font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
              {items.length} / 30
            </span>
          </div>

          <button
            onClick={onOpenBulkModal}
            className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/30 transition-colors"
            title="Cargar varias opciones a la vez"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Carga Masiva</span>
          </button>
        </div>

        {/* Progress bar towards 30 items */}
        <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              isAtLimit ? 'bg-rose-500' : items.length >= 24 ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${(items.length / 30) * 100}%` }}
          />
        </div>

        {isAtLimit && (
          <p className="text-xs text-rose-400 font-medium">
            Has alcanzado el tope máximo de 30 opciones permitidas.
          </p>
        )}
      </div>

      {/* Input Form for adding a new item */}
      <form onSubmit={handleAdd} className="mt-4 flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={isAtLimit ? "Límite de 30 alcanzado" : "Escribe un nombre o palabra..."}
          disabled={isAtLimit}
          maxLength={40}
          className="flex-1 bg-slate-950/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        />
        <button
          type="submit"
          disabled={isAtLimit || !inputText.trim()}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 text-slate-950 disabled:text-slate-500 font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-1 shrink-0 disabled:shadow-none"
        >
          <Plus className="w-4 h-4" />
          <span>Añadir</span>
        </button>
      </form>

      {/* Quick Action Toolbar (Presets, Shuffle, Sort, Clear) */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 py-2 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-1 text-slate-400">
          <span>Activas: </span>
          <strong className="text-slate-200 font-mono">{activeCount}</strong>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => { onShuffle(); soundFx.playClick(); }}
            disabled={items.length < 2}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Mezclar orden aleatoriamente"
          >
            <Shuffle className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => { onSortAlphabetical(); soundFx.playClick(); }}
            disabled={items.length < 2}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Ordenar alfabéticamente (A-Z)"
          >
            <SortAsc className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              if (confirm('¿Deseas vaciar todas las opciones de la ruleta?')) {
                onClearAll();
                soundFx.playClick();
              }
            }}
            disabled={items.length === 0}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Vaciar toda la lista"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quick Presets Carousel */}
      <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
        <span className="text-slate-500 text-[11px] shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400/80" />
          Presets:
        </span>
        {PRESET_COLLECTIONS.map(p => (
          <button
            key={p.id}
            onClick={() => {
              onLoadPreset(p.items);
              soundFx.playClick();
            }}
            className="px-2 py-0.5 rounded-md bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-300 hover:text-white text-[11px] whitespace-nowrap transition-colors"
            title={p.description}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Scrollable list of items */}
      <div className="mt-3 flex-1 overflow-y-auto pr-1 space-y-1.5 min-h-[220px] max-h-[380px]">
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 text-xs">
            <RotateCcw className="w-8 h-8 mb-2 text-slate-600" />
            <p className="font-semibold text-slate-400">No hay opciones cargadas</p>
            <p className="mt-1">Agrega palabras arriba o usa un preset para comenzar.</p>
          </div>
        ) : (
          items.map((item, index) => {
            const sliceColor = getItemColor(index, items.length, themeId, item.color);
            const isEditing = editingId === item.id;

            return (
              <div
                key={item.id}
                className={`group flex items-center justify-between gap-2 px-3 py-2 rounded-xl border transition-all ${
                  item.active
                    ? 'bg-slate-800/60 border-slate-700/60 hover:border-slate-600'
                    : 'bg-slate-900/40 border-slate-800/80 opacity-60'
                }`}
              >
                {/* Active Toggle & Color dot */}
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <button
                    type="button"
                    onClick={() => onToggleItem(item.id)}
                    className="text-slate-400 hover:text-white shrink-0 transition-colors"
                    title={item.active ? 'Desactivar de la ruleta' : 'Activar en la ruleta'}
                  >
                    {item.active ? (
                      <CheckSquare className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-500" />
                    )}
                  </button>

                  <span
                    className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: sliceColor }}
                  />

                  {/* Text or Inline Edit Input */}
                  {isEditing ? (
                    <div className="flex items-center gap-1 flex-1">
                      <input
                        type="text"
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEditing(item.id);
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                        autoFocus
                        className="w-full bg-slate-950 border border-amber-400/80 rounded px-2 py-0.5 text-xs text-white focus:outline-none"
                      />
                      <button
                        onClick={() => saveEditing(item.id)}
                        className="p-1 text-emerald-400 hover:text-emerald-300"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <span 
                      className={`text-xs font-medium truncate cursor-pointer select-none ${
                        item.active ? 'text-slate-200' : 'text-slate-500 line-through'
                      }`}
                      onDoubleClick={() => startEditing(item)}
                      title="Doble clic para editar texto"
                    >
                      {item.text}
                    </span>
                  )}
                </div>

                {/* Right controls: times won badge, edit, delete */}
                <div className="flex items-center gap-1.5 shrink-0 opacity-80 group-hover:opacity-100">
                  {item.timesWon && item.timesWon > 0 ? (
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30" title={`Ha ganado ${item.timesWon} veces`}>
                      ★ {item.timesWon}
                    </span>
                  ) : null}

                  {!isEditing && (
                    <button
                      onClick={() => startEditing(item)}
                      className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 transition-colors"
                      title="Editar"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                  )}

                  <button
                    onClick={() => { onRemoveItem(item.id); soundFx.playClick(); }}
                    className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-700/50 transition-colors"
                    title="Eliminar de la lista"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
