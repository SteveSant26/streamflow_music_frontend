export interface MaterialThemeConfig {
  primary: string;
  secondary: string;
  surface: string;
  background: string;
  error: string;
  onPrimary: string;
  onSecondary: string;
  onSurface: string;
  onBackground: string;
  onError: string;
  surfaceVariant: string;
  onSurfaceVariant: string;
  outline: string;
  outlineVariant: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
}

export const LIGHT_THEME: MaterialThemeConfig = {
  // Primary colors - Púrpura elegante más refinado
  primary: '#6366f1',
  onPrimary: '#ffffff',
  primaryContainer: '#e0e7ff',
  onPrimaryContainer: '#1e1b4b',

  // Secondary colors - Azul celeste premium
  secondary: '#0ea5e9',
  onSecondary: '#ffffff',
  secondaryContainer: '#e0f2fe',
  onSecondaryContainer: '#0c4a6e',

  // Surface colors - Blancos y grises más refinados
  surface: '#ffffff',
  onSurface: '#1e293b',
  surfaceVariant: '#f8fafc',
  onSurfaceVariant: '#64748b',

  // Background colors - Fondo premium
  background: '#fefefe',
  onBackground: '#0f172a',

  // Error colors - Rojo elegante
  error: '#dc2626',
  onError: '#ffffff',

  // Outline colors - Contornos sutiles y elegantes
  outline: '#e2e8f0',
  outlineVariant: '#f1f5f9',
};

export const DARK_THEME: MaterialThemeConfig = {
  // Primary colors - Sophisticated indigo with depth
  primary: '#6366f1',
  onPrimary: '#ffffff',
  primaryContainer: '#1e1b4b',
  onPrimaryContainer: '#c7d2fe',

  // Secondary colors - Refined purple accent
  secondary: '#a855f7',
  onSecondary: '#ffffff',
  secondaryContainer: '#2e1065',
  onSecondaryContainer: '#e9d5ff',

  // Surface colors - Deep blacks with sophisticated contrast
  surface: '#111111',
  onSurface: '#f8fafc',
  surfaceVariant: '#1a1a1a',
  onSurfaceVariant: '#d1d5db',

  // Background colors - Pure black foundation with elegance
  background: '#0a0a0a',
  onBackground: '#f9fafb',

  // Error colors - Refined red with sophistication
  error: '#f87171',
  onError: '#ffffff',

  // Outline colors - Subtle and elegant boundaries
  outline: '#374151',
  outlineVariant: '#1f2937',
};

export const MATERIAL_THEMES = {
  light: LIGHT_THEME,
  dark: DARK_THEME,
} as const;
