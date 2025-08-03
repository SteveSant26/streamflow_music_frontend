import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ThemeEntity } from '../../domain/entities/theme.entity';
import { ThemeRepository } from '../../domain/repositories/theme.repository';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageThemeRepository implements ThemeRepository {
  private readonly THEME_KEY = 'streamflow_theme';
  private themeSubject = new BehaviorSubject<ThemeEntity>(
    this.getInitialTheme(),
  );

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
        return new ThemeEntity(parsed.isDark, parsed.name);
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
          isDark: theme.isDark,
          name: theme.name,
        }),
      );
    } catch (error) {
      console.warn('Error saving theme to localStorage:', error);
    }
  }

  private getInitialTheme(): ThemeEntity {
    // 1. Try to get from localStorage
    const storedTheme = this.getStoredTheme();
    if (storedTheme) {
      this.applyThemeToDOM(storedTheme);
      return storedTheme;
    }

    // 2. Check system preference
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches;
    const systemTheme = prefersDark
      ? ThemeEntity.createDark()
      : ThemeEntity.createLight();

    this.applyThemeToDOM(systemTheme);
    return systemTheme;
  }

  private applyThemeToDOM(theme: ThemeEntity): void {
    const body = document.body;
    const html = document.documentElement;

    if (theme.isDark) {
      body.classList.add('dark');
      html.classList.add('dark');
      body.style.setProperty('--theme-bg', '#232323');
      body.style.setProperty('--theme-text', '#f9fafb');
      body.style.setProperty('--theme-card-bg', '#374151');
      body.style.setProperty('--theme-border', '#4b5563');
      body.style.setProperty('--theme-hover', '#4b5563');
    } else {
      body.classList.remove('dark');
      html.classList.remove('dark');
      body.style.setProperty('--theme-bg', '#f9fafb');
      body.style.setProperty('--theme-text', '#232323');
      body.style.setProperty('--theme-card-bg', '#ffffff');
      body.style.setProperty('--theme-border', '#e5e7eb');
      body.style.setProperty('--theme-hover', '#f3f4f6');
    }
  }
}
