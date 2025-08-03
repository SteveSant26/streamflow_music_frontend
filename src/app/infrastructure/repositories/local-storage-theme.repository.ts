import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, fromEvent } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ThemeEntity, ThemeType } from '../../domain/entities/theme.entity';
import { ThemeRepository } from '../../domain/repositories/theme.repository';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageThemeRepository implements ThemeRepository {
  private readonly THEME_KEY = 'streamflow_theme';
  private readonly themeSubject = new BehaviorSubject<ThemeEntity>(this.getInitialTheme());
  private readonly systemThemeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  getCurrentTheme(): Observable<ThemeEntity> {
    return this.themeSubject.asObservable();
  }

  setTheme(theme: ThemeEntity): Observable<void> {
    this.saveTheme(theme);
    this.applyThemeToDOM(theme);
    this.themeSubject.next(theme);
    return of(void 0);
  }

  getStoredTheme(): ThemeEntity | null {
    try {
      const stored = localStorage.getItem(this.THEME_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return new ThemeEntity(
          parsed.type || (parsed.isDark ? ThemeType.DARK : ThemeType.LIGHT),
          parsed.isDark,
          parsed.name || parsed.type || (parsed.isDark ? ThemeType.DARK : ThemeType.LIGHT)
        );
      }
    } catch (error) {
      console.warn('Error reading theme from localStorage:', error);
    }
    return null;
  }

  saveTheme(theme: ThemeEntity): void {
    try {
      localStorage.setItem(
        this.THEME_KEY,
        JSON.stringify({
          type: theme.type,
          isDark: theme.isDark,
          name: theme.name,
        }),
      );
    } catch (error) {
      console.warn('Error saving theme to localStorage:', error);
    }
  }

  getSystemTheme(): ThemeEntity {
    const prefersDark = this.systemThemeMediaQuery.matches;
    return new ThemeEntity(ThemeType.SYSTEM, prefersDark, ThemeType.SYSTEM);
  }

  watchSystemThemeChanges(): Observable<ThemeEntity> {
    return fromEvent<MediaQueryListEvent>(this.systemThemeMediaQuery, 'change').pipe(
      startWith(this.systemThemeMediaQuery),
      map(() => this.getSystemTheme())
    );
  }

  clearStoredTheme(): void {
    try {
      localStorage.removeItem(this.THEME_KEY);
    } catch (error) {
      console.warn('Error clearing theme from localStorage:', error);
    }
  }

  private getInitialTheme(): ThemeEntity {
    // 1. Primero intenta obtener del localStorage
    const storedTheme = this.getStoredTheme();
    if (storedTheme) {
      // Si es un tema del sistema guardado, actualizamos con la preferencia actual
      if (storedTheme.isSystemTheme()) {
        const currentSystemTheme = this.getSystemTheme();
        this.applyThemeToDOM(currentSystemTheme);
        return currentSystemTheme;
      }
      this.applyThemeToDOM(storedTheme);
      return storedTheme;
    }

    // 2. Si no hay tema guardado, usar el tema del sistema
    const systemTheme = this.getSystemTheme();
    this.applyThemeToDOM(systemTheme);
    return systemTheme;
  }

  private applyThemeToDOM(theme: ThemeEntity): void {
    const body = document.body;
    const html = document.documentElement;

    // Remover todas las clases de tema
    body.classList.remove('dark', 'light');
    html.classList.remove('dark', 'light');

    if (theme.isDark) {
      body.classList.add('dark');
      html.classList.add('dark');
    } else {
      body.classList.add('light');
      html.classList.add('light');
    }

    // Aplicar atributo data para CSS que lo necesite
    body.setAttribute('data-theme', theme.isDark ? 'dark' : 'light');
    html.setAttribute('data-theme', theme.isDark ? 'dark' : 'light');
  }
}
