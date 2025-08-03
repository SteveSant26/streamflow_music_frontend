import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ThemeService } from '../application/services/theme.service';
import { ThemeEntity } from '../domain/entities/theme.entity';

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
  
  private destroy$ = new Subject<void>();

  constructor(private readonly themeService: ThemeService) {}

  ngOnInit(): void {
    this.currentTheme$ = this.themeService.getCurrentTheme();
    this.isDarkMode$ = this.themeService.isDarkMode();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  toggleTheme(): void {
    this.themeService.toggleTheme()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => console.log('Theme toggled successfully'),
        error: (error) => console.error('Error toggling theme:', error)
      });
  }
}