import { Provider } from '@angular/core';
import { ThemeRepository } from '../domain/repositories/theme.repository';
import { LocalStorageThemeRepository } from '../infrastructure/repositories/local-storage-theme.repository';
import { ThemeService } from '../application/services/theme.service';

export const THEME_PROVIDERS: Provider[] = [
  {
    provide: ThemeRepository,
    useClass: LocalStorageThemeRepository
  },
  ThemeService
];
