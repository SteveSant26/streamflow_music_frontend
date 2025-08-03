import { Provider } from '@angular/core';
import { ThemeRepository } from '../../domain/repositories/theme.repository';
import { LocalStorageThemeRepository } from '../../infrastructure/repositories/local-storage-theme.repository';
import { ThemeService } from '../services/theme.service';
import { GetCurrentThemeUseCase } from '../../domain/usecases/get-current-theme.usecase';
import { SetThemeUseCase } from '../../domain/usecases/set-theme.usecase';
import { ToggleThemeUseCase } from '../../domain/usecases/toggle-theme.usecase';
import { GetSystemThemeUseCase } from '../../domain/usecases/get-system-theme.usecase';
import { ResetToSystemThemeUseCase } from '../../domain/usecases/reset-to-system-theme.usecase';

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
