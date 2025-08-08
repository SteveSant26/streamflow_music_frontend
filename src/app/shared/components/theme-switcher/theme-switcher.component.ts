import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialThemeService } from '../../services/material-theme.service';

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    TranslateModule
  ],
  template: `
    <button 
      mat-icon-button 
      [matMenuTriggerFor]="themeMenu"
      [attr.aria-label]="'THEME.TOGGLE' | translate"
      class="theme-switcher-button"
      [class.dark-active]="isDarkMode()"
    >
      <mat-icon>{{ currentThemeIcon() }}</mat-icon>
    </button>

    <mat-menu #themeMenu="matMenu" class="theme-menu">
      <button 
        mat-menu-item 
        (click)="setLightTheme()"
        [class.active]="isLightActive()"
      >
        <mat-icon>wb_sunny</mat-icon>
        <span>{{ 'THEME.LIGHT' | translate }}</span>
      </button>

      <button 
        mat-menu-item 
        (click)="setDarkTheme()"
        [class.active]="isDarkActive()"
      >
        <mat-icon>nights_stay</mat-icon>
        <span>{{ 'THEME.DARK' | translate }}</span>
      </button>

      <button 
        mat-menu-item 
        (click)="setSystemTheme()"
        [class.active]="isSystemActive()"
      >
        <mat-icon>settings_brightness</mat-icon>
        <span>{{ 'THEME.SYSTEM' | translate }}</span>
      </button>
    </mat-menu>
  `,
  styles: [`
    .theme-switcher-button {
      transition: all 0.3s ease;
    }

    .theme-switcher-button:hover {
      transform: scale(1.1);
    }

    .theme-switcher-button.dark-active {
      color: var(--md-sys-color-primary);
    }

    .theme-menu .mat-mdc-menu-item.active {
      background-color: var(--md-sys-color-primary-container);
      color: var(--md-sys-color-on-primary-container);
    }

    .theme-menu .mat-mdc-menu-item.active mat-icon {
      color: var(--md-sys-color-on-primary-container);
    }

    .theme-menu .mat-mdc-menu-item {
      transition: all 0.2s ease;
    }

    .theme-menu .mat-mdc-menu-item:hover {
      background-color: var(--md-sys-color-surface-variant);
    }
  `]
})
export class ThemeSwitcherComponent {
  private readonly themeService = inject(MaterialThemeService);

  // Computed signals para el estado del tema
  readonly currentTheme = this.themeService.currentTheme;
  readonly effectiveTheme = this.themeService.effectiveTheme;
  readonly isDarkMode = this.themeService._isDarkMode;

  // Computed para el icono actual
  readonly currentThemeIcon = computed(() => {
    const theme = this.currentTheme();
    if (theme.isSystemTheme()) {
      return 'settings_brightness';
    }
    return theme.isDark ? 'nights_stay' : 'wb_sunny';
  });

  // Computed para saber qué opción está activa
  readonly isLightActive = computed(() => {
    const theme = this.currentTheme();
    return !theme.isSystemTheme() && !theme.isDark;
  });

  readonly isDarkActive = computed(() => {
    const theme = this.currentTheme();
    return !theme.isSystemTheme() && theme.isDark;
  });

  readonly isSystemActive = computed(() => {
    return this.currentTheme().isSystemTheme();
  });

  // Métodos para cambiar tema
  setLightTheme(): void {
    this.themeService.setTheme('light');
  }

  setDarkTheme(): void {
    this.themeService.setTheme('dark');
  }

  setSystemTheme(): void {
    this.themeService.setTheme('system');
  }
}
