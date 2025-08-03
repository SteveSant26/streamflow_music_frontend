import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MaterialThemeService } from '../theme/material-theme.service';
import { ThemeType } from '../../domain/entities/theme.entity';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatMenuModule
  ],
  template: `
    <button 
      mat-icon-button 
      [matTooltip]="tooltipText()"
      [matMenuTriggerFor]="themeMenu"
      class="theme-toggle-button">
      <mat-icon>{{ currentIcon() }}</mat-icon>
    </button>

    <mat-menu #themeMenu="matMenu" class="theme-menu">
      <button 
        mat-menu-item 
        (click)="setTheme('light')"
        [class.active]="themeService.themeType() === 'light'">
        <mat-icon>light_mode</mat-icon>
        <span>Tema Claro</span>
      </button>
      
      <button 
        mat-menu-item 
        (click)="setTheme('dark')"
        [class.active]="themeService.themeType() === 'dark'">
        <mat-icon>dark_mode</mat-icon>
        <span>Tema Oscuro</span>
      </button>
      
      <button 
        mat-menu-item 
        (click)="setTheme('system')"
        [class.active]="themeService.themeType() === 'system'">
        <mat-icon>settings_brightness</mat-icon>
        <span>Sistema</span>
      </button>
    </mat-menu>
  `,
  styles: [`
    .theme-toggle-button {
      color: var(--mat-text-primary);
      transition: all 0.3s cubic-bezier(0.3, 0, 0, 1);
    }

    .theme-toggle-button:hover {
      color: var(--mat-primary-main);
      transform: scale(1.1);
    }

    .theme-menu {
      background-color: var(--mat-background-paper);
      border-radius: 8px;
      box-shadow: var(--mat-shadow-elevated);
    }

    .theme-menu .mat-mdc-menu-item {
      display: flex;
      align-items: center;
      gap: 12px;
      color: var(--mat-text-primary);
      transition: all 0.3s cubic-bezier(0.3, 0, 0, 1);
    }

    .theme-menu .mat-mdc-menu-item:hover {
      background-color: var(--mat-action-hover);
    }

    .theme-menu .mat-mdc-menu-item.active {
      background-color: var(--mat-action-selected);
      color: var(--mat-primary-main);
    }

    .theme-menu .mat-mdc-menu-item.active mat-icon {
      color: var(--mat-primary-main);
    }

    .theme-menu mat-icon {
      color: var(--mat-text-secondary);
      margin-right: 0;
    }
  `]
})
export class ThemeToggleComponent {
  readonly themeService = inject(MaterialThemeService);

  // Computed properties para iconos y tooltips
  readonly currentIcon = computed(() => {
    switch (this.themeService.themeType()) {
      case ThemeType.LIGHT:
        return 'light_mode';
      case ThemeType.DARK:
        return 'dark_mode';
      case ThemeType.SYSTEM:
        return 'settings_brightness';
      default:
        return 'light_mode';
    }
  });

  readonly tooltipText = computed(() => {
    switch (this.themeService.themeType()) {
      case ThemeType.LIGHT:
        return 'Cambiar a tema oscuro';
      case ThemeType.DARK:
        return 'Cambiar a tema del sistema';
      case ThemeType.SYSTEM:
        return 'Cambiar a tema claro';
      default:
        return 'Cambiar tema';
    }
  });

  setTheme(type: 'light' | 'dark' | 'system'): void {
    switch (type) {
      case 'light':
        this.themeService.setTheme(ThemeType.LIGHT);
        break;
      case 'dark':
        this.themeService.setTheme(ThemeType.DARK);
        break;
      case 'system':
        this.themeService.setTheme(ThemeType.SYSTEM);
        break;
    }
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
