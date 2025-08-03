import { inject } from '@angular/core';
import { ThemeService } from '../services/theme.service';
import { take, firstValueFrom } from 'rxjs';

export function initializeTheme() {
  return () => {
    const themeService = inject(ThemeService);
    
    // Asegurar que el tema se aplique al inicio de la aplicación
    return firstValueFrom(themeService.getCurrentTheme().pipe(take(1)));
  };
}
