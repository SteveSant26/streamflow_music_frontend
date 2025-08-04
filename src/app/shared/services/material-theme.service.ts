import { Injectable, signal, computed, inject, PLATFORM_ID, effect } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ThemeRepository } from '@app/domain/repositories/theme.repository';
import { ThemeEntity } from '@app/domain/entities/theme.entity';
import { MATERIAL_THEMES } from '@app/shared/config/material-theme.config';

@Injectable({
  providedIn: 'root'
})
export class MaterialThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly themeRepository = inject(ThemeRepository);

  // Señal para el tema actual
  private readonly _currentTheme = signal<ThemeEntity>(ThemeEntity.createSystem());

  // Señal para detectar si el sistema prefiere modo oscuro
  private readonly _systemPrefersDark = signal<boolean>(false);

  constructor() {
    this.initializeTheme();
    this.setupSystemThemeListener();
    
    // Effect reactivo para aplicar el tema automáticamente cuando cambia
    effect(() => {
      this.applyTheme();
    });
  }

  // Getters públicos como computed signals
  readonly currentTheme = this._currentTheme.asReadonly();

  readonly effectiveTheme = computed(() => {
    const current = this._currentTheme();
    if (current.isSystemTheme()) {
      return this._systemPrefersDark() ? 'dark' : 'light';
    }
    return current.isDark ? 'dark' : 'light';
  });

  readonly isDarkMode = computed(() => {
    return this.effectiveTheme() === 'dark';
  });

  readonly currentThemeConfig = computed(() => {
    const theme = this.effectiveTheme();
    return MATERIAL_THEMES[theme];
  });

  // Métodos para obtener colores específicos
  readonly primaryColor = computed(() => this.currentThemeConfig().primary);
  readonly surfaceColor = computed(() => this.currentThemeConfig().surface);
  readonly backgroundColor = computed(() => this.currentThemeConfig().background);

  /**
   * Establece un nuevo tema
   */
  setTheme(themeType: 'light' | 'dark' | 'system'): void {
    let newTheme: ThemeEntity;
    
    switch (themeType) {
      case 'light':
        newTheme = ThemeEntity.createLight();
        break;
      case 'dark':
        newTheme = ThemeEntity.createDark();
        break;
      case 'system':
        newTheme = ThemeEntity.createSystem();
        break;
      default:
        newTheme = ThemeEntity.createSystem();
    }
    
    this._currentTheme.set(newTheme);
    this.themeRepository.saveTheme(newTheme);
    // applyTheme() se ejecutará automáticamente por el effect
  }

  /**
   * Obtiene el tema actual
   */
  getTheme(): ThemeEntity {
    return this._currentTheme();
  }

  /**
   * Inicializa el tema desde el repositorio
   */
  private initializeTheme(): void {
    const savedTheme = this.themeRepository.getStoredTheme();
    if (savedTheme) {
      this._currentTheme.set(savedTheme);
    }
    this.detectSystemTheme();
    this.applyTheme();
  }

  /**
   * Detecta la preferencia del sistema
   */
  private detectSystemTheme(): void {
    if (isPlatformBrowser(this.platformId)) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this._systemPrefersDark.set(prefersDark);
    }
  }

  /**
   * Configura el listener para cambios en el tema del sistema
   */
  private setupSystemThemeListener(): void {
    if (isPlatformBrowser(this.platformId)) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = (e: MediaQueryListEvent) => {
        this._systemPrefersDark.set(e.matches);
        if (this._currentTheme().isSystemTheme()) {
          this.applyTheme();
        }
      };

      // Usar el método moderno addEventListener
      mediaQuery.addEventListener('change', handleChange);
    }
  }

  /**
   * Aplica el tema actual al DOM
   */
  private applyTheme(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const effectiveTheme = this.effectiveTheme();
    const themeConfig = MATERIAL_THEMES[effectiveTheme];
    
    // Aplicar las variables CSS personalizadas al documento
    const root = document.documentElement;
    
    // Material Design System Color variables
    root.style.setProperty('--md-sys-color-primary', themeConfig.primary);
    root.style.setProperty('--md-sys-color-on-primary', themeConfig.onPrimary);
    root.style.setProperty('--md-sys-color-primary-container', themeConfig.primaryContainer);
    root.style.setProperty('--md-sys-color-on-primary-container', themeConfig.onPrimaryContainer);
    
    root.style.setProperty('--md-sys-color-secondary', themeConfig.secondary);
    root.style.setProperty('--md-sys-color-on-secondary', themeConfig.onSecondary);
    root.style.setProperty('--md-sys-color-secondary-container', themeConfig.secondaryContainer);
    root.style.setProperty('--md-sys-color-on-secondary-container', themeConfig.onSecondaryContainer);
    
    root.style.setProperty('--md-sys-color-tertiary', themeConfig.secondary);
    root.style.setProperty('--md-sys-color-on-tertiary', themeConfig.onSecondary);
    
    root.style.setProperty('--md-sys-color-error', themeConfig.error);
    root.style.setProperty('--md-sys-color-on-error', themeConfig.onError);
    
    root.style.setProperty('--md-sys-color-surface', themeConfig.surface);
    root.style.setProperty('--md-sys-color-on-surface', themeConfig.onSurface);
    root.style.setProperty('--md-sys-color-surface-variant', themeConfig.surfaceVariant);
    root.style.setProperty('--md-sys-color-on-surface-variant', themeConfig.onSurfaceVariant);
    
    root.style.setProperty('--md-sys-color-background', themeConfig.background);
    root.style.setProperty('--md-sys-color-on-background', themeConfig.onBackground);
    
    root.style.setProperty('--md-sys-color-outline', themeConfig.outline);
    root.style.setProperty('--md-sys-color-outline-variant', themeConfig.outlineVariant);

    // Variables para compatibilidad con Material Components
    root.style.setProperty('--mdc-theme-primary', themeConfig.primary);
    root.style.setProperty('--mdc-theme-secondary', themeConfig.secondary);
    root.style.setProperty('--mdc-theme-surface', themeConfig.surface);
    root.style.setProperty('--mdc-theme-background', themeConfig.background);
    root.style.setProperty('--mdc-theme-error', themeConfig.error);
    root.style.setProperty('--mdc-theme-on-primary', themeConfig.onPrimary);
    root.style.setProperty('--mdc-theme-on-secondary', themeConfig.onSecondary);
    root.style.setProperty('--mdc-theme-on-surface', themeConfig.onSurface);
    root.style.setProperty('--mdc-theme-on-error', themeConfig.onError);

    // Clases CSS en el body para compatibilidad con CSS existente
    document.body.classList.remove('light-theme', 'dark-theme', 'light', 'dark');
    document.body.classList.add(`${effectiveTheme}-theme`, effectiveTheme);
    
    // Agregar atributo data-theme para selectores CSS
    document.body.setAttribute('data-theme', effectiveTheme);
    document.documentElement.setAttribute('data-theme', effectiveTheme);
    
    console.log(`🎨 Tema aplicado: ${effectiveTheme}`, themeConfig);
  }
}
