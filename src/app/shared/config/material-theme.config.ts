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
  primary: '#1DB954',
  secondary: '#1ED760',
  surface: '#ffffff',
  background: '#fafafa',
  error: '#ff5252',
  onPrimary: '#ffffff',
  onSecondary: '#000000',
  onSurface: '#1a1a1a',
  onBackground: '#1a1a1a',
  onError: '#ffffff',
  surfaceVariant: '#f5f5f5',
  onSurfaceVariant: '#666666',
  outline: '#e0e0e0',
  outlineVariant: '#f0f0f0',
  primaryContainer: '#e8f7ee',
  onPrimaryContainer: '#0a4d1a',
  secondaryContainer: '#e9f8ec',
  onSecondaryContainer: '#0b4f1c',
};

export const DARK_THEME: MaterialThemeConfig = {
  primary: '#1DB954',
  secondary: '#1ED760',
  surface: '#1a1a1a',
  background: '#121212',
  error: '#ff5252',
  onPrimary: '#ffffff',
  onSecondary: '#000000',
  onSurface: '#ffffff',
  onBackground: '#ffffff',
  onError: '#ffffff',
  surfaceVariant: '#2a2a2a',
  onSurfaceVariant: '#cccccc',
  outline: '#404040',
  outlineVariant: '#333333',
  primaryContainer: '#0a4d1a',
  onPrimaryContainer: '#e8f7ee',
  secondaryContainer: '#0b4f1c',
  onSecondaryContainer: '#e9f8ec',
};

export const MATERIAL_THEMES = {
  light: LIGHT_THEME,
  dark: DARK_THEME,
} as const;
