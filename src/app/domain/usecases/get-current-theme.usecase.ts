import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ThemeEntity } from '../entities/theme.entity';
import { ThemeRepository } from '../repositories/theme.repository';

@Injectable({
  providedIn: 'root'
})
export class GetCurrentThemeUseCase {
  private readonly themeRepository = inject(ThemeRepository);

  execute(): Observable<ThemeEntity> {
    return this.themeRepository.getCurrentTheme();
  }
}
