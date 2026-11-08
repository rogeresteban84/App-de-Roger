import React, { useEffect, useRef, useState, useCallback } from 'react';
import { WheelItem, ColorThemeId, SpinDuration } from '../types';
import { getItemColor } from '../utils/colors';
import { soundFx } from '../utils/audio';

interface RouletteWheelProps {
  items: WheelItem[];
  themeId: ColorThemeId;
  duration: SpinDuration;
  isSpinning: boolean;
  onSpinStart: () => void;
  onSpinEnd: (winner: WheelItem) => void;
}

// Helper to determine if text on a hex color should be dark or white
function getContrastColor(hexColor: string): string {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  // Perceived brightness formula
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 145 ? '#0f172a' : '#ffffff';
}

export const RouletteWheel: React.FC<RouletteWheelProps> = ({
  items,
  themeId,
  duration,
  isSpinning,
  onSpinStart,
  onSpinEnd
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [currentAngle, setCurrentAngle] = useState<number>(0);
  const angleRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);
  const flapperDeflectionRef = useRef<number>(0);

  const activeItems = items.filter(it => it.active);

  // Draw the entire wheel on canvas
  const drawWheel = useCallback((angle: number, flapperDeflection: number = 0) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = 560;
    const height = 560;

    // Set internal resolution for crisp high-DPI rendering
    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;
    const radius = width / 2 - 28;

    // Outer drop shadow glow
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius + 12, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 12;
    ctx.fill();
    ctx.restore();

    // Metallic Outer Rim Bezel
    ctx.save();
    const rimGradient = ctx.createRadialGradient(cx, cy, radius - 2, cx, cy, radius + 14);
    rimGradient.addColorStop(0, '#1e293b');
    rimGradient.addColorStop(0.5, '#334155');
    rimGradient.addColorStop(0.85, '#64748b');
    rimGradient.addColorStop(1, '#0f172a');
    ctx.beginPath();
    ctx.arc(cx, cy, radius + 14, 0, Math.PI * 2);
    ctx.fillStyle = rimGradient;
    ctx.fill();

    // Outer decorative rim border
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.stroke();
    ctx.restore();

    const total = activeItems.length;

    if (total === 0) {
      // Empty placeholder wheel state
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = '#1e293b';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#475569';
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.font = '600 16px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Agrega al menos 1 opción para girar', cx, cy);
      ctx.restore();
      return;
    }

    const sliceAngle = (Math.PI * 2) / total;

    // Draw Slices
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);

    for (let i = 0; i < total; i++) {
      const item = activeItems[i];
      const startAngle = i * sliceAngle;
      const endAngle = startAngle + sliceAngle;
      const sliceColor = getItemColor(i, total, themeId, item.color);

      // Slice sector
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = sliceColor;
      ctx.fill();

      // Hairline slice separator
      ctx.lineWidth = total > 18 ? 1 : 1.5;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.stroke();

      // Draw text radially along slice
      ctx.save();
      const midAngle = startAngle + sliceAngle / 2;
      ctx.rotate(midAngle);

      const textColor = getContrastColor(sliceColor);
      ctx.fillStyle = textColor;

      // Font size scales with total count
      let fontSize = 16;
      if (total > 24) fontSize = 10;
      else if (total > 18) fontSize = 11;
      else if (total > 12) fontSize = 13;
      else if (total > 6) fontSize = 15;

      ctx.font = `700 ${fontSize}px "Plus Jakarta Sans", system-ui, sans-serif`;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';

      // Text truncation based on radius and center hub size
      const maxTextWidth = radius - 75;
      let displayText = item.text;
      if (ctx.measureText(displayText).width > maxTextWidth) {
        while (displayText.length > 3 && ctx.measureText(displayText + '…').width > maxTextWidth) {
          displayText = displayText.slice(0, -1);
        }
        displayText = displayText + '…';
      }

      ctx.fillText(displayText, radius - 20, 0);
      ctx.restore();
    }

    // Outer boundary rim line inside rotation
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.stroke();

    ctx.restore(); // restore center translation

    // Draw perimeter golden/chrome pegs at slice boundaries
    ctx.save();
    for (let i = 0; i < total; i++) {
      const pegAngle = angle + i * sliceAngle;
      const pegX = cx + (radius + 6) * Math.cos(pegAngle);
      const pegY = cy + (radius + 6) * Math.sin(pegAngle);

      ctx.beginPath();
      ctx.arc(pegX, pegY, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#f8fafc';
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 3;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(pegX, pegY, 2, 0, Math.PI * 2);
      ctx.fillStyle = '#cbd5e1';
      ctx.fill();
    }
    ctx.restore();

    // Center Hub (Spindle / Spin Button)
    ctx.save();
    const hubRadius = total > 18 ? 44 : 52;

    // Hub outer shadow ring
    ctx.beginPath();
    ctx.arc(cx, cy, hubRadius + 4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
    ctx.shadowBlur = 12;
    ctx.fill();

    // Hub gradient background
    const hubGrad = ctx.createLinearGradient(cx - hubRadius, cy - hubRadius, cx + hubRadius, cy + hubRadius);
    hubGrad.addColorStop(0, '#1e293b');
    hubGrad.addColorStop(0.5, '#0f172a');
    hubGrad.addColorStop(1, '#020617');

    ctx.beginPath();
    ctx.arc(cx, cy, hubRadius, 0, Math.PI * 2);
    ctx.fillStyle = hubGrad;
    ctx.fill();

    // Hub rim border
    ctx.lineWidth = 3;
    const borderGrad = ctx.createLinearGradient(cx, cy - hubRadius, cx, cy + hubRadius);
    borderGrad.addColorStop(0, '#f59e0b');
    borderGrad.addColorStop(1, '#d97706');
    ctx.strokeStyle = borderGrad;
    ctx.stroke();

    // Hub inner emblem & text
    ctx.fillStyle = '#ffffff';
    ctx.font = `800 ${total > 18 ? 12 : 14}px "Outfit", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 4;
    ctx.fillText(isSpinning ? '...' : 'GIRAR', cx, cy);

    ctx.restore();

    // Top Pointer / Flapper Indicator at 12 o'clock (pointing down)
    ctx.save();
    const flapperLength = 34;
    const flapperWidth = 20;
    const pointerTopY = cy - radius - 16;

    ctx.translate(cx, pointerTopY);
    ctx.rotate(flapperDeflection);

    // Flapper needle shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 4;

    // Pointer body
    ctx.beginPath();
    ctx.moveTo(0, flapperLength); // tip pointing down into the wheel
    ctx.lineTo(-flapperWidth / 2, 0);
    ctx.arc(0, 0, flapperWidth / 2, Math.PI, 0, false);
    ctx.lineTo(flapperWidth / 2, 0);
    ctx.closePath();

    const pointerGrad = ctx.createLinearGradient(0, 0, 0, flapperLength);
    pointerGrad.addColorStop(0, '#fbbf24');
    pointerGrad.addColorStop(0.5, '#f59e0b');
    pointerGrad.addColorStop(1, '#d97706');
    ctx.fillStyle = pointerGrad;
    ctx.fill();

    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    // Pointer pivot pin
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#1e293b';
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#fbbf24';
    ctx.stroke();

    ctx.restore();
    ctx.restore();
  }, [activeItems, themeId, isSpinning]);

  // Initial draw & redraw when active items / theme / angle change
  useEffect(() => {
    drawWheel(currentAngle, flapperDeflectionRef.current);
  }, [drawWheel, currentAngle]);

  // Spin trigger logic
  const handleSpin = () => {
    if (isSpinning || activeItems.length < 2) return;

    onSpinStart();

    // 1. Pick a random winner from activeItems
    const total = activeItems.length;
    const winnerIndex = Math.floor(Math.random() * total);
    const winningItem = activeItems[winnerIndex];

    const sliceAngle = (Math.PI * 2) / total;

    // Pointer is at the top: angle = -PI/2 (or 3*PI/2)
    // To land slice `winnerIndex` under pointer:
    // angle + winnerIndex * sliceAngle + sliceAngle/2 = 3*PI/2 (mod 2*PI)
    // Add small random jitter (-30% to +30% of slice width) to avoid always landing dead center
    const jitter = (Math.random() - 0.5) * 0.6 * sliceAngle;
    const targetSliceCenter = winnerIndex * sliceAngle + sliceAngle / 2 + jitter;
    
    // Normalized desired final modulo angle
    const targetBaseAngle = (3 * Math.PI / 2 - targetSliceCenter) % (Math.PI * 2);
    const positiveBaseAngle = (targetBaseAngle + Math.PI * 2) % (Math.PI * 2);

    // Number of full rotations based on duration (duration: 3s -> ~6 revs, 5s -> ~10 revs, 8s -> ~16 revs)
    const baseRevolutions = duration === 3 ? 6 : duration === 5 ? 10 : 16;
    const totalSpins = baseRevolutions * Math.PI * 2;

    const startAngle = angleRef.current % (Math.PI * 2);
    const targetFinalAngle = angleRef.current + (totalSpins + (positiveBaseAngle - (angleRef.current % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2));

    const totalDurationMs = duration * 1000;
    const startTime = performance.now();
    let lastPegIndex = -1;

    // Quintic ease-out for ultra smooth realistic roulette slowdown
    const easeOutQuint = (t: number): number => {
      return 1 - Math.pow(1 - t, 5);
    };

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / totalDurationMs, 1);
      const easedProgress = easeOutQuint(progress);

      const angle = startAngle + (targetFinalAngle - startAngle) * easedProgress;
      angleRef.current = angle;
      setCurrentAngle(angle);

      // Peg hit calculation for sound and pointer bounce
      // Flapper pointer is at top (3*PI/2). Local angle:
      const localPointerAngle = (3 * Math.PI / 2 - angle) % (Math.PI * 2);
      const normAngle = (localPointerAngle + Math.PI * 2) % (Math.PI * 2);
      const currentPegIndex = Math.floor(normAngle / sliceAngle);

      if (currentPegIndex !== lastPegIndex) {
        lastPegIndex = currentPegIndex;
        // Pitch rises slightly at high speed, drops as it slows
        const speed = (1 - progress);
        soundFx.playTick(0.8 + speed * 0.5);

        // Flapper deflects based on rotation direction and speed
        flapperDeflectionRef.current = Math.min(0.35, 0.1 + speed * 0.25);
      } else {
        // Return flapper pointer back to 0
        flapperDeflectionRef.current *= 0.85;
      }

      drawWheel(angle, flapperDeflectionRef.current);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Done spinning!
        flapperDeflectionRef.current = 0;
        drawWheel(targetFinalAngle, 0);
        soundFx.playWin();
        onSpinEnd(winningItem);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center select-none relative w-full max-w-[560px] mx-auto">
      {/* Canvas Container with subtle depth */}
      <div 
        className="relative aspect-square w-full max-w-[500px] cursor-pointer"
        onClick={handleSpin}
        title={activeItems.length >= 2 ? (isSpinning ? 'Girando...' : 'Haz clic para girar') : 'Agrega al menos 2 opciones'}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full block touch-none"
        />
      </div>

      {/* Primary Big Spin CTA */}
      <div className="mt-6 flex flex-col items-center gap-2">
        <button
          onClick={handleSpin}
          disabled={isSpinning || activeItems.length < 2}
          className={`px-8 py-3.5 text-base font-bold tracking-wide rounded-xl shadow-lg transition-all duration-200 transform active:scale-95 whitespace-nowrap ${
            isSpinning
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed shadow-none'
              : activeItems.length < 2
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              : 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-amber-500/20 hover:shadow-amber-500/30 hover:-translate-y-0.5'
          }`}
        >
          {isSpinning ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
              Girando ruleta...
            </span>
          ) : (
            '¡GIRAR RULETA!'
          )}
        </button>

        <span className="text-xs text-slate-400">
          {activeItems.length < 2
            ? 'Activa o añade al menos 2 opciones para girar'
            : 'O presiona la tecla ESPACIO para girar'}
        </span>
      </div>
    </div>
  );
};
