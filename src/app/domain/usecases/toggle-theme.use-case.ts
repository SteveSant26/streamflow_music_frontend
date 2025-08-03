import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ThemeEntity } from '../entities/theme.entity';
import { ThemeRepository } from '../repositories/theme.repository';

@Injectable()
export class ToggleThemeUseCase {
  constructor(private readonly themeRepository: ThemeRepository) {}

  execute(currentTheme: ThemeEntity): Observable<void> {
    const toggledTheme = currentTheme.toggle();
    return this.themeRepository.setTheme(toggledTheme);
  }
}
