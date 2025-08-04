import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, finalize } from 'rxjs';
import { Router } from '@angular/router';

import { Song } from '../../domain/entities/song.entity';
import { MaterialThemeService } from '../../shared/services/material-theme.service';
import { MusicsTable } from '../../presentation/components/music/musics-table/musics-table';
import { 
  GetMostPopularSongsUseCase,
  GetRandomSongsUseCase 
} from '../../domain/usecases/song/song.usecases';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TranslateModule,
    MusicsTable
  ],
  template: `
    <div 
      [class]="(isDarkTheme$ | async) 
        ? 'min-h-screen bg-gray-900 text-white p-6' 
        : 'min-h-screen bg-gray-50 text-gray-900 p-6'"
    >
      <div class="max-w-7xl mx-auto space-y-8">
        <!-- Header -->
        <div class="text-center space-y-4">
          <h1 
            [class]="(isDarkTheme$ | async) 
              ? 'text-4xl font-bold text-white' 
              : 'text-4xl font-bold text-gray-900'"
          >
            {{ 'HOME.TITLE' | translate }}
          </h1>
          <p 
            [class]="(isDarkTheme$ | async) 
              ? 'text-lg text-gray-300' 
              : 'text-lg text-gray-600'"
          >
            {{ 'HOME.SUBTITLE' | translate }}
          </p>
        </div>

        <!-- Theme Toggle -->
        <div class="flex justify-center">
          <button
            mat-raised-button
            [color]="(isDarkTheme$ | async) ? 'accent' : 'primary'"
            (click)="toggleTheme()"
            class="flex items-center gap-2"
          >
            <mat-icon>
              {{ (isDarkTheme$ | async) ? 'light_mode' : 'dark_mode' }}
            </mat-icon>
            {{ (isDarkTheme$ | async) ? 'Modo Claro' : 'Modo Oscuro' }}
          </button>
        </div>

        <!-- Popular Songs Section -->
        <mat-card 
          [class]="(isDarkTheme$ | async) 
            ? 'bg-gray-800 border border-gray-700' 
            : 'bg-white border border-gray-200'"
        >
          <mat-card-header>
            <mat-card-title 
              [class]="(isDarkTheme$ | async) 
                ? 'text-white flex items-center gap-2' 
                : 'text-gray-900 flex items-center gap-2'"
            >
              <mat-icon>trending_up</mat-icon>
              {{ 'HOME.POPULAR_SONGS' | translate }}
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            @if (popularLoading()) {
              <div class="flex justify-center py-8">
                <mat-progress-spinner diameter="40" mode="indeterminate"></mat-progress-spinner>
              </div>
            } @else if (popularSongs().length > 0) {
              <app-musics-table [songs]="popularSongs()"></app-musics-table>
            } @else {
              <p 
                [class]="(isDarkTheme$ | async) 
                  ? 'text-gray-300 text-center py-8' 
                  : 'text-gray-600 text-center py-8'"
              >
                {{ 'HOME.NO_POPULAR_SONGS' | translate }}
              </p>
            }
          </mat-card-content>
          <mat-card-actions>
            <button
              mat-button
              (click)="loadPopularSongs()"
              [disabled]="popularLoading()"
              [class]="(isDarkTheme$ | async) ? 'text-green-400' : 'text-green-600'"
            >
              <mat-icon>refresh</mat-icon>
              {{ 'HOME.REFRESH' | translate }}
            </button>
          </mat-card-actions>
        </mat-card>

        <!-- Random Songs Section -->
        <mat-card 
          [class]="(isDarkTheme$ | async) 
            ? 'bg-gray-800 border border-gray-700' 
            : 'bg-white border border-gray-200'"
        >
          <mat-card-header>
            <mat-card-title 
              [class]="(isDarkTheme$ | async) 
                ? 'text-white flex items-center gap-2' 
                : 'text-gray-900 flex items-center gap-2'"
            >
              <mat-icon>shuffle</mat-icon>
              {{ 'HOME.RANDOM_SONGS' | translate }}
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            @if (randomLoading()) {
              <div class="flex justify-center py-8">
                <mat-progress-spinner diameter="40" mode="indeterminate"></mat-progress-spinner>
              </div>
            } @else if (randomSongs().length > 0) {
              <app-musics-table [songs]="randomSongs()"></app-musics-table>
            } @else {
              <p 
                [class]="(isDarkTheme$ | async) 
                  ? 'text-gray-300 text-center py-8' 
                  : 'text-gray-600 text-center py-8'"
              >
                {{ 'HOME.NO_RANDOM_SONGS' | translate }}
              </p>
            }
          </mat-card-content>
          <mat-card-actions>
            <button
              mat-button
              (click)="loadRandomSongs()"
              [disabled]="randomLoading()"
              [class]="(isDarkTheme$ | async) ? 'text-green-400' : 'text-green-600'"
            >
              <mat-icon>casino</mat-icon>
              {{ 'HOME.GET_RANDOM' | translate }}
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    mat-card {
      margin-bottom: 2rem;
    }
    
    mat-card-header {
      margin-bottom: 1rem;
    }
    
    .mat-mdc-card-content {
      padding-top: 0;
    }
  `]
})
export class HomePage implements OnInit {
  private readonly materialTheme = inject(MaterialThemeService);
  private readonly getMostPopularUseCase = inject(GetMostPopularSongsUseCase);
  private readonly getRandomSongsUseCase = inject(GetRandomSongsUseCase);

  // Signals for reactive state management
  popularSongs = signal<Song[]>([]);
  randomSongs = signal<Song[]>([]);
  popularLoading = signal<boolean>(false);
  randomLoading = signal<boolean>(false);

  isDarkTheme$: Observable<boolean> = this.materialTheme.isDarkMode();

  ngOnInit(): void {
    this.loadPopularSongs();
    this.loadRandomSongs();
  }

  toggleTheme(): void {
    // Get current effective theme and toggle between light and dark
    const isDark = this.materialTheme._isDarkMode();
    const newTheme = isDark ? 'light' : 'dark';
    this.materialTheme.setTheme(newTheme);
  }

  loadPopularSongs(): void {
    this.popularLoading.set(true);
    this.getMostPopularUseCase.execute(1, 10)
      .pipe(
        finalize(() => this.popularLoading.set(false))
      )
      .subscribe({
        next: (songs) => {
          this.popularSongs.set(songs);
          console.log('Popular songs loaded:', songs);
        },
        error: (error) => {
          console.error('Error loading popular songs:', error);
          this.popularSongs.set([]);
        }
      });
  }

  loadRandomSongs(): void {
    this.randomLoading.set(true);
    this.getRandomSongsUseCase.execute(1, 10)
      .pipe(
        finalize(() => this.randomLoading.set(false))
      )
      .subscribe({
        next: (songs) => {
          this.randomSongs.set(songs);
          console.log('Random songs loaded:', songs);
        },
        error: (error) => {
          console.error('Error loading random songs:', error);
          this.randomSongs.set([]);
        }
      });
  }
}
