import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ThemeEntity } from '../entities/theme.entity';
import { ThemeRepository } from '../repositories/theme.repository';

@Injectable({
  providedIn: 'root'
})
export class SetThemeUseCase {
  private readonly themeRepository = inject(ThemeRepository);

  execute(theme: ThemeEntity): Observable<void> {
    return this.themeRepository.setTheme(theme);
  }
}
