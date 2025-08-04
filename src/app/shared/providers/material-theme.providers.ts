import { Provider } from '@angular/core';
import { MaterialThemeService } from '../services/material-theme.service';
import { ThemeRepository } from '../../domain/repositories/theme.repository';
import { LocalStorageThemeRepository } from '../../infrastructure/repositories/local-storage-theme.repository';

export const MATERIAL_THEME_PROVIDERS: Provider[] = [
  MaterialThemeService,
  {
    provide: ThemeRepository,
    useClass: LocalStorageThemeRepository
  }
];
