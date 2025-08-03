import { Injectable, inject, OnDestroy } from '@angular/core';
import { Observable, map, distinctUntilChanged, takeUntil, Subject, switchMap, filter } from 'rxjs';
import { ThemeEntity, ThemeType } from '../../domain/entities/theme.entity';
import { GetCurrentThemeUseCase } from '../../domain/usecases/get-current-theme.usecase';
import { SetThemeUseCase } from '../../domain/usecases/set-theme.usecase';
import { ToggleThemeUseCase } from '../../domain/usecases/toggle-theme.usecase';
import { GetSystemThemeUseCase } from '../../domain/usecases/get-system-theme.usecase';
import { ResetToSystemThemeUseCase } from '../../domain/usecases/reset-to-system-theme.usecase';

@Injectable({
  providedIn: 'root',
})
export class ThemeService implements OnDestroy {
  private readonly getCurrentThemeUseCase = inject(GetCurrentThemeUseCase);
  private readonly setThemeUseCase = inject(SetThemeUseCase);
  private readonly toggleThemeUseCase = inject(ToggleThemeUseCase);
  private readonly getSystemThemeUseCase = inject(GetSystemThemeUseCase);
  private readonly resetToSystemThemeUseCase = inject(ResetToSystemThemeUseCase);
  
  private readonly destroy$ = new Subject<void>();

  constructor() {
    // Comentado temporalmente para evitar loops infinitos
    // this.initSystemThemeWatcher();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getCurrentTheme(): Observable<ThemeEntity> {
    return this.getCurrentThemeUseCase.execute().pipe(
      distinctUntilChanged((prev, curr) => prev.equals(curr))
    );
  }

  isDarkMode(): Observable<boolean> {
    return this.getCurrentTheme().pipe(
      map(theme => theme.isDark),
      distinctUntilChanged()
    );
  }

  setLightTheme(): Observable<void> {
    return this.setThemeUseCase.execute(ThemeEntity.createLight());
  }

  setDarkTheme(): Observable<void> {
    return this.setThemeUseCase.execute(ThemeEntity.createDark());
  }

  setSystemTheme(): Observable<void> {
    return this.resetToSystemThemeUseCase.execute();
  }

  toggleTheme(): Observable<void> {
    return this.toggleThemeUseCase.execute();
  }

  getThemeType(): Observable<ThemeType> {
    return this.getCurrentTheme().pipe(
      map(theme => theme.type),
      distinctUntilChanged()
    );
  }

  isSystemTheme(): Observable<boolean> {
    return this.getCurrentTheme().pipe(
      map(theme => theme.isSystemTheme()),
      distinctUntilChanged()
    );
  }

  private initSystemThemeWatcher(): void {
    // Solo reaccionar a cambios del sistema cuando el tema actual es 'system'
    this.getCurrentTheme().pipe(
      filter(theme => theme.isSystemTheme()),
      switchMap(() => this.getSystemThemeUseCase.watchChanges()),
      distinctUntilChanged((prev, curr) => prev.isDark === curr.isDark),
      takeUntil(this.destroy$)
    ).subscribe(systemTheme => {
      // Verificar una vez más que el tema actual sigue siendo del sistema antes de actualizar
      this.getCurrentTheme().pipe(
        takeUntil(this.destroy$)
      ).subscribe(currentTheme => {
        if (currentTheme.isSystemTheme() && currentTheme.isDark !== systemTheme.isDark) {
          this.setThemeUseCase.execute(systemTheme).subscribe();
        }
      });
    });
  }
}
