export interface WheelItem {
  id: string;
  text: string;
  color?: string;
  active: boolean;
  weight?: number;
  timesWon?: number;
}

export type ColorThemeId = 'vibrant' | 'rainbow' | 'neon' | 'pastel' | 'casino' | 'sunset' | 'emerald';

export interface ColorTheme {
  id: ColorThemeId;
  name: string;
  colors: string[];
}

export interface SpinResult {
  item: WheelItem;
  timestamp: number;
}

export type SpinDuration = 3 | 5 | 8;
