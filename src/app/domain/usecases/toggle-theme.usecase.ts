import { Injectable, inject } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { ThemeRepository } from '../repositories/theme.repository';

@Injectable({
  providedIn: 'root'
})
export class ToggleThemeUseCase {
  private readonly themeRepository = inject(ThemeRepository);

  execute(): Observable<void> {
    return this.themeRepository.getCurrentTheme().pipe(
      switchMap((currentTheme) => {
        const newTheme = currentTheme.toggle();
        return this.themeRepository.setTheme(newTheme);
      })
    );
  }
}
