import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { ThemeService } from '../../../shared/services/theme.service';
import { ThemeEntity, ThemeType } from '../../../domain/entities/theme.entity';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  templateUrl: './theme-toggle.html',
  styleUrls: ['./theme-toggle.css'],
  imports: [CommonModule, MatIconModule, MatButtonModule],
})
export class ThemeToggleComponent implements OnInit, OnDestroy {
  isDarkMode$!: Observable<boolean>;
  currentTheme$!: Observable<ThemeEntity>;
  themeType$!: Observable<ThemeType>;
  isSystemTheme$!: Observable<boolean>;
  
  showOptions = false;

  private readonly destroy$ = new Subject<void>();

  constructor(private readonly themeService: ThemeService) {}

  ngOnInit(): void {
    this.currentTheme$ = this.themeService.getCurrentTheme();
    this.isDarkMode$ = this.themeService.isDarkMode();
    this.themeType$ = this.themeService.getThemeType();
    this.isSystemTheme$ = this.themeService.isSystemTheme();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme().subscribe({
      next: () => console.log('Theme toggled successfully'),
      error: (error) => console.error('Error toggling theme:', error),
    });
  }

  setLightTheme(): void {
    this.themeService.setLightTheme().subscribe({
      next: () => {
        console.log('Light theme set successfully');
        this.showOptions = false;
      },
      error: (error) => console.error('Error setting light theme:', error),
    });
  }

  setDarkTheme(): void {
    this.themeService.setDarkTheme().subscribe({
      next: () => {
        console.log('Dark theme set successfully');
        this.showOptions = false;
      },
      error: (error) => console.error('Error setting dark theme:', error),
    });
  }

  setSystemTheme(): void {
    this.themeService.setSystemTheme().subscribe({
      next: () => {
        console.log('System theme set successfully');
        this.showOptions = false;
      },
      error: (error) => console.error('Error setting system theme:', error),
    });
  }

  toggleOptions(): void {
    this.showOptions = !this.showOptions;
  }

  getThemeIcon(): Observable<string> {
    return this.themeType$.pipe(
      map((type: ThemeType) => {
        switch (type) {
          case ThemeType.LIGHT:
            return 'wb_sunny';
          case ThemeType.DARK:
            return 'nights_stay';
          case ThemeType.SYSTEM:
          default:
            return 'settings_brightness';
        }
      })
    );
  }

  getToggleAriaLabel(): Observable<string> {
    return this.isDarkMode$.pipe(
      map((isDark: boolean) => isDark ? 'Switch to light mode' : 'Switch to dark mode')
    );
  }
}
