export const Colors = {
  light: {
    text: '#11181C',
    textSecondary: '#5B6270',
    background: '#FFFFFF',
    backgroundElement: '#F1F2F8',
    backgroundSelected: '#E1E3F0',
    tint: '#3B2FD0',
    accent: '#0EA5A4',
    onTint: '#FFFFFF',
    border: '#E3E5EE',
  },
  dark: {
    text: '#F3F4F8',
    textSecondary: '#A3A9BA',
    background: '#0E0F1A',
    backgroundElement: '#1A1C2E',
    backgroundSelected: '#262945',
    tint: '#8B84FF',
    accent: '#2DD4BF',
    onTint: '#0E0F1A',
    border: '#2A2D45',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = {
  small: 8,
  medium: 16,
  large: 24,
  pill: 999,
} as const;

export const MaxContentWidth = 640;
