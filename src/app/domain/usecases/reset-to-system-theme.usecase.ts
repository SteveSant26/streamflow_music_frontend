import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ThemeRepository } from '../repositories/theme.repository';

@Injectable({
  providedIn: 'root'
})
export class ResetToSystemThemeUseCase {
  private readonly themeRepository = inject(ThemeRepository);

  execute(): Observable<void> {
    // Limpia el tema guardado y vuelve al tema del sistema
    this.themeRepository.clearStoredTheme();
    const systemTheme = this.themeRepository.getSystemTheme();
    return this.themeRepository.setTheme(systemTheme);
  }
}
