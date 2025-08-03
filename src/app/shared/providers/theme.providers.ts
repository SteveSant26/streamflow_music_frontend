import { Provider } from '@angular/core';
import { ThemeRepository } from '../../domain/repositories/theme.repository';
import { LocalStorageThemeRepository } from '../../infrastructure/repositories/local-storage-theme.repository';
import { ThemeService } from '../services/theme.service';
import { 
  GetCurrentThemeUseCase, 
  SetThemeUseCase, 
  ToggleThemeUseCase, 
  GetSystemThemeUseCase, 
  ResetToSystemThemeUseCase 
} from '../../domain/usecases';

export const THEME_PROVIDERS: Provider[] = [
  {
    provide: ThemeRepository,
    useClass: LocalStorageThemeRepository,
  },
  ThemeService,
  GetCurrentThemeUseCase,
  SetThemeUseCase,
  ToggleThemeUseCase,
  GetSystemThemeUseCase,
  ResetToSystemThemeUseCase,
];
