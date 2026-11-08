import { ColorTheme, ColorThemeId } from '../types';

export const COLOR_THEMES: ColorTheme[] = [
  {
    id: 'vibrant',
    name: 'Vibrante Clásico',
    colors: [
      '#ef4444', '#f97316', '#f59e0b', '#10b981',
      '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6',
      '#ec4899', '#14b8a6', '#84cc16', '#e11d48'
    ]
  },
  {
    id: 'neon',
    name: 'Neón Cyber',
    colors: [
      '#06b6d4', '#ec4899', '#8b5cf6', '#10b981',
      '#f59e0b', '#3b82f6', '#d946ef', '#14b8a6',
      '#f43f5e', '#6366f1', '#22c55e', '#a855f7'
    ]
  },
  {
    id: 'pastel',
    name: 'Pastel Moderno',
    colors: [
      '#fda4af', '#fcd34d', '#86efac', '#7dd3fc',
      '#c4b5fd', '#f0abfc', '#fdba74', '#6ee7b7',
      '#93c5fd', '#cbd5e1', '#f9a8d4', '#a7f3d0'
    ]
  },
  {
    id: 'casino',
    name: 'Casino Royale',
    colors: [
      '#b91c1c', '#1e293b', '#b45309', '#0f766e',
      '#991b1b', '#334155', '#d97706', '#115e59',
      '#7f1d1d', '#475569', '#f59e0b', '#134e4a'
    ]
  },
  {
    id: 'sunset',
    name: 'Atardecer Cálido',
    colors: [
      '#ea580c', '#f59e0b', '#e11d48', '#c026d3',
      '#fb923c', '#fbbf24', '#f43f5e', '#d946ef',
      '#f97316', '#eab308', '#be123c', '#a21caf'
    ]
  },
  {
    id: 'emerald',
    name: 'Océano & Esmeralda',
    colors: [
      '#0284c7', '#0d9488', '#059669', '#2563eb',
      '#06b6d4', '#10b981', '#3b82f6', '#14b8a6',
      '#0369a1', '#047857', '#1d4ed8', '#0f766e'
    ]
  }
];

export function getItemColor(index: number, total: number, themeId: ColorThemeId = 'vibrant', customColor?: string): string {
  if (customColor) return customColor;
  const theme = COLOR_THEMES.find(t => t.id === themeId) || COLOR_THEMES[0];
  const palette = theme.colors;
  
  // If palette has fewer colors than total, we cycle through palette while ensuring adjacent colors differ
  const color = palette[index % palette.length];
  // If last item would collide with first item in a full circle, slightly shift
  if (index === total - 1 && total > 1 && color === palette[0]) {
    return palette[(index + 1) % palette.length];
  }
  return color;
}
