import React from 'react';
import { X, HelpCircle, CheckCircle, Flame, Keyboard, ListPlus } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg shadow-2xl p-6 text-slate-100 flex flex-col gap-4 relative"
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-title"
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-400" />
            <h3 id="help-title" className="text-lg font-bold text-white">
              Guía de Uso de la Ruleta
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

        <div className="space-y-3.5 text-xs text-slate-300">
          <div className="flex items-start gap-3 bg-slate-950/40 p-3 rounded-xl border border-slate-800">
            <ListPlus className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-white text-sm mb-0.5">Cargar Nombres o Palabras</h4>
              <p>Puedes escribir opciones una por una o pulsar en <strong className="text-amber-400">"Carga Masiva"</strong> para pegar listas completas separadas por saltos de línea o comas. La ruleta tiene un <strong className="text-white">tope de 30 opciones</strong>.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-slate-950/40 p-3 rounded-xl border border-slate-800">
            <Keyboard className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-white text-sm mb-0.5">Control y Atajos</h4>
              <p>Haz clic en el botón <strong className="text-amber-400">"¡GIRAR RULETA!"</strong>, en el centro de la ruleta, o simplemente presiona la tecla <strong className="text-white bg-slate-800 px-1.5 py-0.5 rounded font-mono">Espacio</strong> en tu teclado.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-slate-950/40 p-3 rounded-xl border border-slate-800">
            <Flame className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-white text-sm mb-0.5">Modo Eliminación (Sorteos y Rifas)</h4>
              <p>Activa el <strong className="text-rose-400">"Eliminar ganador al salir"</strong> si estás realizando un sorteo con múltiples premios o turnos, para que la opción elegida no vuelva a repetirse.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-slate-950/40 p-3 rounded-xl border border-slate-800">
            <CheckCircle className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-white text-sm mb-0.5">Personalización</h4>
              <p>Cambia el tema de colores (Vibrante, Neón, Pastel, Casino, etc.), ajusta la velocidad del giro (3s, 5s u 8s de suspenso) y revisa el historial completo de giros.</p>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all"
          >
            ¡Entendido!
          </button>
        </div>
      </div>
    </div>
  );
};
