import React, { useState, useEffect, useCallback, useRef } from 'react';
import { WheelItem, ColorThemeId, SpinDuration, SpinResult } from './types';
import { Header } from './components/Header';
import { RouletteWheel } from './components/RouletteWheel';
import { ItemsManager } from './components/ItemsManager';
import { BulkImportModal } from './components/BulkImportModal';
import { WinnerModal } from './components/WinnerModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import { SettingsBar } from './components/SettingsBar';
import { HelpModal } from './components/HelpModal';
import { soundFx } from './utils/audio';

// Default initial items
const DEFAULT_ITEMS: WheelItem[] = [
  { id: '1', text: 'Carlos', active: true, timesWon: 0 },
  { id: '2', text: 'Sofía', active: true, timesWon: 0 },
  { id: '3', text: 'Mateo', active: true, timesWon: 0 },
  { id: '4', text: 'Valentina', active: true, timesWon: 0 },
  { id: '5', text: 'Lucas', active: true, timesWon: 0 },
  { id: '6', text: 'Camila', active: true, timesWon: 0 },
  { id: '7', text: 'Alejandro', active: true, timesWon: 0 },
  { id: '8', text: 'Lucía', active: true, timesWon: 0 }
];

export default function App() {
  // Items state (max 30 items)
  const [items, setItems] = useState<WheelItem[]>(() => {
    try {
      const saved = localStorage.getItem('ruleta_items');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.slice(0, 30);
        }
      }
    } catch {
      // Fallback
    }
    return DEFAULT_ITEMS;
  });

  // Settings
  const [themeId, setThemeId] = useState<ColorThemeId>(() => {
    return (localStorage.getItem('ruleta_theme') as ColorThemeId) || 'vibrant';
  });

  const [duration, setDuration] = useState<SpinDuration>(() => {
    const saved = localStorage.getItem('ruleta_duration');
    return saved ? (parseInt(saved, 10) as SpinDuration) : 5;
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('ruleta_sound');
    return saved !== null ? saved === 'true' : true;
  });

  const [autoEliminate, setAutoEliminate] = useState<boolean>(() => {
    return localStorage.getItem('ruleta_auto_eliminate') === 'true';
  });

  // History
  const [history, setHistory] = useState<SpinResult[]>(() => {
    try {
      const saved = localStorage.getItem('ruleta_history');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return [];
  });

  // Spin & Modals state
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [winner, setWinner] = useState<WheelItem | null>(null);
  const [isWinnerModalOpen, setIsWinnerModalOpen] = useState<boolean>(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);

  // Sync sound settings with audio manager
  useEffect(() => {
    soundFx.enabled = soundEnabled;
    localStorage.setItem('ruleta_sound', String(soundEnabled));
  }, [soundEnabled]);

  // Persist items
  useEffect(() => {
    localStorage.setItem('ruleta_items', JSON.stringify(items));
  }, [items]);

  // Persist theme
  useEffect(() => {
    localStorage.setItem('ruleta_theme', themeId);
  }, [themeId]);

  // Persist duration
  useEffect(() => {
    localStorage.setItem('ruleta_duration', String(duration));
  }, [duration]);

  // Persist auto eliminate
  useEffect(() => {
    localStorage.setItem('ruleta_auto_eliminate', String(autoEliminate));
  }, [autoEliminate]);

  // Persist history
  useEffect(() => {
    localStorage.setItem('ruleta_history', JSON.stringify(history));
  }, [history]);

  // Add Item (Enforces max 30)
  const handleAddItem = (text: string) => {
    if (items.length >= 30) return;
    const newItem: WheelItem = {
      id: crypto.randomUUID(),
      text: text.trim(),
      active: true,
      timesWon: 0
    };
    setItems(prev => [...prev, newItem].slice(0, 30));
  };

  // Remove Item
  const handleRemoveItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  // Toggle Item active/inactive
  const handleToggleItem = (id: string) => {
    setItems(prev =>
      prev.map(item => (item.id === id ? { ...item, active: !item.active } : item))
    );
  };

  // Update Item Text
  const handleUpdateItemText = (id: string, text: string) => {
    setItems(prev =>
      prev.map(item => (item.id === id ? { ...item, text } : item))
    );
  };

  // Shuffle order
  const handleShuffle = () => {
    setItems(prev => {
      const arr = [...prev];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    });
  };

  // Sort Alphabetical
  const handleSortAlphabetical = () => {
    setItems(prev =>
      [...prev].sort((a, b) => a.text.localeCompare(b.text, 'es', { sensitivity: 'base' }))
    );
  };

  // Clear All
  const handleClearAll = () => {
    setItems([]);
  };

  // Load Preset
  const handleLoadPreset = (presetTexts: string[]) => {
    const formatted: WheelItem[] = presetTexts.slice(0, 30).map(text => ({
      id: crypto.randomUUID(),
      text,
      active: true,
      timesWon: 0
    }));
    setItems(formatted);
  };

  // Bulk Import
  const handleBulkImport = (newItems: WheelItem[], mode: 'replace' | 'append') => {
    if (mode === 'replace') {
      setItems(newItems.slice(0, 30));
    } else {
      setItems(prev => {
        const combined = [...prev, ...newItems];
        return combined.slice(0, 30);
      });
    }
  };

  // Spin lifecycle callbacks
  const handleSpinStart = useCallback(() => {
    setIsSpinning(true);
    setIsWinnerModalOpen(false);
  }, []);

  const handleSpinEnd = useCallback((chosenWinner: WheelItem) => {
    setIsSpinning(false);
    setWinner(chosenWinner);
    setIsWinnerModalOpen(true);

    // Update win count for the item
    setItems(prev =>
      prev.map(it => (it.id === chosenWinner.id ? { ...it, timesWon: (it.timesWon || 0) + 1 } : it))
    );

    // Record in history
    setHistory(prev => [{ item: chosenWinner, timestamp: Date.now() }, ...prev]);

    // Handle auto eliminate mode if activated
    if (autoEliminate) {
      setTimeout(() => {
        setItems(prev => prev.filter(it => it.id !== chosenWinner.id));
      }, 500);
    }
  }, [autoEliminate]);

  // Keyboard shortcut: Spacebar to spin
  const triggerSpinRef = useRef<() => void>(() => {});
  triggerSpinRef.current = () => {
    if (isSpinning) return;
    const active = items.filter(i => i.active);
    if (active.length < 2) return;
    const canvasBtn = document.querySelector('canvas') as HTMLCanvasElement | null;
    if (canvasBtn) {
      canvasBtn.click();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input, textarea or if a modal is open
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
      ) {
        return;
      }
      if (isBulkModalOpen || isHistoryOpen || isHelpOpen) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        if (isWinnerModalOpen) {
          setIsWinnerModalOpen(false);
        } else {
          triggerSpinRef.current();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isBulkModalOpen, isHistoryOpen, isHelpOpen, isWinnerModalOpen]);

  const handleQuickReset = () => {
    if (confirm('¿Deseas reiniciar la ruleta con los nombres predeterminados?')) {
      setItems(DEFAULT_ITEMS);
      setHistory([]);
      soundFx.playClick();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* 3-Zone Top Bar */}
      <Header
        onQuickReset={handleQuickReset}
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        {/* App Title & Subtitle banner */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
              Ruleta Aleatoria de Opciones
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Personaliza tus nombres o palabras (hasta 30 opciones) y gira para tomar decisiones o realizar sorteos.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="font-mono text-amber-400 font-bold">{items.filter(i => i.active).length}</span>
            <span>opciones activas de</span>
            <span className="font-mono text-slate-200 font-bold">{items.length}/30</span>
          </div>
        </div>

        {/* 2-Column Split: Wheel Stage (Left) & Options Manager (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Wheel Stage Column */}
          <div className="lg:col-span-7 flex flex-col gap-6 items-center">
            {/* Roulette Canvas */}
            <div className="w-full bg-slate-900/60 border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center relative overflow-hidden backdrop-blur-sm">
              <RouletteWheel
                items={items}
                themeId={themeId}
                duration={duration}
                isSpinning={isSpinning}
                onSpinStart={handleSpinStart}
                onSpinEnd={handleSpinEnd}
              />
            </div>

            {/* Quick Settings Bar below wheel */}
            <div className="w-full">
              <SettingsBar
                soundEnabled={soundEnabled}
                onToggleSound={() => setSoundEnabled(prev => !prev)}
                duration={duration}
                onChangeDuration={setDuration}
                themeId={themeId}
                onChangeTheme={setThemeId}
                autoEliminate={autoEliminate}
                onToggleAutoEliminate={() => setAutoEliminate(prev => !prev)}
                historyCount={history.length}
                onOpenHistory={() => setIsHistoryOpen(true)}
              />
            </div>
          </div>

          {/* Items & Words Management Column */}
          <div className="lg:col-span-5 h-full">
            <ItemsManager
              items={items}
              themeId={themeId}
              onAddItem={handleAddItem}
              onRemoveItem={handleRemoveItem}
              onToggleItem={handleToggleItem}
              onUpdateItemText={handleUpdateItemText}
              onShuffle={handleShuffle}
              onSortAlphabetical={handleSortAlphabetical}
              onClearAll={handleClearAll}
              onOpenBulkModal={() => setIsBulkModalOpen(true)}
              onLoadPreset={handleLoadPreset}
            />
          </div>
        </div>
      </main>

      {/* Modals & Drawers */}
      <BulkImportModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        onImport={handleBulkImport}
        currentCount={items.length}
      />

      <WinnerModal
        winner={winner}
        isOpen={isWinnerModalOpen}
        onClose={() => setIsWinnerModalOpen(false)}
        onRemoveWinner={handleRemoveItem}
        onSpinAgain={() => triggerSpinRef.current()}
      />

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onClearHistory={() => setHistory([])}
      />

      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
}
