import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MaterialThemeService } from '../../services/material-theme.service';

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
        [class.active]="isThemeActive('light')">
        <mat-icon>light_mode</mat-icon>
        <span>Tema Claro</span>
      </button>
      
      <button 
        mat-menu-item 
        (click)="setTheme('dark')"
        [class.active]="isThemeActive('dark')">
        <mat-icon>dark_mode</mat-icon>
        <span>Tema Oscuro</span>
      </button>
      
      <button 
        mat-menu-item 
        (click)="setTheme('system')"
        [class.active]="isThemeActive('system')">
        <mat-icon>settings_brightness</mat-icon>
        <span>Sistema</span>
      </button>
    </mat-menu>
  `,
  styles: [`
    .theme-toggle-button {
      color: var(--mdc-theme-on-surface);
      transition: all 0.3s cubic-bezier(0.3, 0, 0, 1);
    }

    .theme-toggle-button:hover {
      color: var(--mdc-theme-primary);
      transform: scale(1.1);
    }

    .theme-menu {
      background-color: var(--mdc-theme-surface);
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }

    .theme-menu .mat-mdc-menu-item {
      display: flex;
      align-items: center;
      gap: 12px;
      color: var(--mdc-theme-on-surface);
      transition: all 0.3s cubic-bezier(0.3, 0, 0, 1);
    }

    .theme-menu .mat-mdc-menu-item:hover {
      background-color: var(--mdc-theme-surface-variant);
    }

    .theme-menu .mat-mdc-menu-item.active {
      background-color: var(--mdc-theme-primary-container);
      color: var(--mdc-theme-on-primary-container);
    }

    .theme-menu .mat-mdc-menu-item.active mat-icon {
      color: var(--mdc-theme-primary);
    }

    .theme-menu mat-icon {
      color: var(--mdc-theme-on-surface-variant);
      margin-right: 0;
    }
  `]
})
export class ThemeToggleComponent {
  readonly themeService = inject(MaterialThemeService);

  // Computed properties para iconos y tooltips
  readonly currentIcon = computed(() => {
    const theme = this.themeService.currentTheme();
    if (theme.isSystemTheme()) {
      return 'settings_brightness';
    }
    return theme.isDark ? 'dark_mode' : 'light_mode';
  });

  readonly tooltipText = computed(() => {
    const theme = this.themeService.currentTheme();
    if (theme.isSystemTheme()) {
      return 'Cambiar a tema claro';
    }
    return theme.isDark ? 'Cambiar a tema del sistema' : 'Cambiar a tema oscuro';
  });

  setTheme(type: 'light' | 'dark' | 'system'): void {
    this.themeService.setTheme(type);
  }

  isThemeActive(type: 'light' | 'dark' | 'system'): boolean {
    const theme = this.themeService.currentTheme();
    
    if (type === 'system') {
      return theme.isSystemTheme();
    }
    
    if (type === 'light') {
      return !theme.isDark && !theme.isSystemTheme();
    }
    
    if (type === 'dark') {
      return theme.isDark && !theme.isSystemTheme();
    }
    
    return false;
  }
}
