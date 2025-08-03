import { Injectable } from '@angular/core';
import { Observable, switchMap, tap } from 'rxjs';
import { ThemeEntity } from '../../domain/entities/theme.entity';
import { ThemeRepository } from '../../domain/repositories/theme.repository';

@Injectable()
export class ThemeService {
  constructor(private readonly themeRepository: ThemeRepository) {}

  getCurrentTheme(): Observable<ThemeEntity> {
    return this.themeRepository.getCurrentTheme();
  }

  isDarkMode(): Observable<boolean> {
    return this.getCurrentTheme().pipe(
      tap((theme) => console.log('Current theme:', theme)),
      switchMap((theme) => [theme.isDark]),
    );
  }

  toggleTheme(): Observable<void> {
    return this.getCurrentTheme().pipe(
      switchMap((currentTheme) => {
        console.log('Toggling from:', currentTheme);
        const newTheme = currentTheme.toggle();
        console.log('Toggling to:', newTheme);
        return this.themeRepository.setTheme(newTheme);
      }),
    );
  }
}
