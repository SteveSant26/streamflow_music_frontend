import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ThemeEntity } from '../entities/theme.entity';
import { ThemeRepository } from '../repositories/theme.repository';

@Injectable()
export class GetCurrentThemeUseCase {
  constructor(private readonly themeRepository: ThemeRepository) {}

  execute(): Observable<ThemeEntity> {
    return this.themeRepository.getCurrentTheme();
  }
}
