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
  templateUrl: './home.html',
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
  private readonly router = inject(Router);

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

  navigateToDiscover(): void {
    this.router.navigate(['/discover']);
  }
}
