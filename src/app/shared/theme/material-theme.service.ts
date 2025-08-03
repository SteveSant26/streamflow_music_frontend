import { Injectable, signal, effect, computed, inject } from '@angular/core';
import { LIGHT_THEME, DARK_THEME } from './material-theme.config';
import { ThemeType, ThemeEntity } from '../../domain/entities/theme.entity';
import { ThemeRepository } from '../../domain/repositories/theme.repository';

@Injectable({
  providedIn: 'root'
})
export class MaterialThemeService {
  private readonly themeRepository = inject(ThemeRepository);
  
  // Señales para el tema actual
  private readonly _currentTheme = signal<ThemeEntity>(new ThemeEntity(ThemeType.LIGHT, false, 'light'));
  private readonly _themeConfig = signal<any>(LIGHT_THEME);
  
  // Computed para obtener el tema
  readonly themeConfig = computed(() => this._themeConfig());
  readonly currentTheme = computed(() => this._currentTheme());
  readonly isDarkMode = computed(() => this._currentTheme().isDark);
  readonly themeType = computed(() => this._currentTheme().type);
  
  constructor() {
    // Efecto para actualizar el tema cuando cambie el tema actual
    effect(() => {
      const theme = this._currentTheme();
      this.updateThemeConfig(theme);
    });
    
    // Efecto para aplicar la clase CSS del tema
    effect(() => {
      const isDark = this.isDarkMode();
      this.applyThemeClass(isDark);
    });
    
    // Inicializar después del constructor
    setTimeout(() => this.initialize(), 0);
  }
  
  private initialize(): void {
    try {
      const savedTheme = this.themeRepository.getStoredTheme();
      if (savedTheme) {
        this._currentTheme.set(savedTheme);
      } else {
        this._currentTheme.set(new ThemeEntity(ThemeType.LIGHT, false, 'light'));
      }
    } catch (error) {
      console.warn('Error loading theme from repository, using default:', error);
      // Usar tema por defecto si hay error
      this._currentTheme.set(new ThemeEntity(ThemeType.LIGHT, false, 'light'));
    }
  }
  
  private updateThemeConfig(theme: ThemeEntity): void {
    const themeConfig = theme.isDark ? DARK_THEME : LIGHT_THEME;
    this._themeConfig.set(themeConfig);
  }
  
  private applyThemeClass(isDark: boolean): void {
    const body = document.body;
    body.classList.remove('light', 'dark');
    body.classList.add(isDark ? 'dark' : 'light');
    
    // También actualizar el atributo data-theme para compatibilidad
    body.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }
  
  // Métodos públicos para cambiar el tema
  setTheme(type: ThemeType): void {
    try {
      let theme: ThemeEntity;
      
      switch (type) {
        case ThemeType.LIGHT: {
          theme = new ThemeEntity(ThemeType.LIGHT, false, 'light');
          break;
        }
        case ThemeType.DARK: {
          theme = new ThemeEntity(ThemeType.DARK, true, 'dark');
          break;
        }
        case ThemeType.SYSTEM: {
          const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          theme = new ThemeEntity(ThemeType.SYSTEM, systemPrefersDark, 'system');
          break;
        }
        default: {
          theme = new ThemeEntity(ThemeType.LIGHT, false, 'light');
        }
      }
      
      this._currentTheme.set(theme);
      this.themeRepository.saveTheme(theme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  }
  
  toggleTheme(): void {
    const current = this._currentTheme();
    const newType = current.isDark ? ThemeType.LIGHT : ThemeType.DARK;
    this.setTheme(newType);
  }
  
  // Métodos para obtener colores específicos del tema actual
  getPrimaryColor(): string {
    const theme = this._themeConfig();
    return theme.palette?.primary?.main || '#000000';
  }
  
  getBackgroundColor(): string {
    const theme = this._themeConfig();
    return theme.palette?.background?.default || '#ffffff';
  }
  
  getTextColor(): string {
    const theme = this._themeConfig();
    return theme.palette?.text?.primary || '#000000';
  }
  
  getSecondaryTextColor(): string {
    const theme = this._themeConfig();
    return theme.palette?.text?.secondary || '#6a6a6a';
  }
  
  getSurfaceColor(): string {
    const theme = this._themeConfig();
    return theme.palette?.background?.paper || '#ffffff';
  }
  
  // Método para escuchar cambios del tema del sistema
  private setupSystemThemeListener(): void {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    mediaQuery.addEventListener('change', (e) => {
      const current = this._currentTheme();
      if (current.type === ThemeType.SYSTEM) {
        const updatedTheme = new ThemeEntity(ThemeType.SYSTEM, e.matches, 'system');
        this._currentTheme.set(updatedTheme);
        this.themeRepository.setTheme(updatedTheme);
      }
    });
  }
  
  // Método para inicializar el listener del sistema
  initSystemThemeListener(): void {
    this.setupSystemThemeListener();
  }
}
