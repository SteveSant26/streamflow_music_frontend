import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ThemeEntity } from '../../entities/theme.entity';
import { ThemeRepository } from '../../repositories/theme.repository';

@Injectable({
  providedIn: 'root'
})
export class GetCurrentThemeUseCase {
  private readonly themeRepository = inject(ThemeRepository);

  execute(): Observable<ThemeEntity> {
    return this.themeRepository.getCurrentTheme();
  }
}

@Injectable({
  providedIn: 'root'
})
export class SetThemeUseCase {
  private readonly themeRepository = inject(ThemeRepository);

  execute(theme: ThemeEntity): Observable<void> {
    return this.themeRepository.setTheme(theme);
  }
}

@Injectable({
  providedIn: 'root'
})
export class ToggleThemeUseCase {
  private readonly getCurrentThemeUseCase = inject(GetCurrentThemeUseCase);
  private readonly setThemeUseCase = inject(SetThemeUseCase);

  execute(): Observable<void> {
    return new Observable(observer => {
      this.getCurrentThemeUseCase.execute().subscribe({
        next: (currentTheme) => {
          const toggledTheme = currentTheme.toggle();
          this.setThemeUseCase.execute(toggledTheme).subscribe({
            next: () => {
              observer.next();
              observer.complete();
            },
            error: (error) => observer.error(error)
          });
        },
        error: (error) => observer.error(error)
      });
    });
  }
}

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

@Injectable({
  providedIn: 'root'
})
export class ResetToSystemThemeUseCase {
  private readonly themeRepository = inject(ThemeRepository);

  execute(): Observable<void> {
    const systemTheme = this.themeRepository.getSystemTheme();
    return this.themeRepository.setTheme(systemTheme);
  }
}
