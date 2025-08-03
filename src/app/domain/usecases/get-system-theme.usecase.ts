import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ThemeEntity } from '../entities/theme.entity';
import { ThemeRepository } from '../repositories/theme.repository';

@Injectable({
  providedIn: 'root'
})
export class GetSystemThemeUseCase {
  private readonly themeRepository = inject(ThemeRepository);

  execute(): ThemeEntity {
    return this.themeRepository.getSystemTheme();
  }

  watchChanges(): Observable<ThemeEntity> {
    return this.themeRepository.watchSystemThemeChanges();
  }
}
