import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, finalize } from 'rxjs';
import { Router } from '@angular/router';

import { Song } from '../../../../domain/entities/song.entity';
import { MaterialThemeService } from '../../../../shared/services/material-theme.service';
import { MusicsTable } from '../../../components/music/musics-table/musics-table';
import { 
  GetMostPopularSongsUseCase,
  GetRandomSongsUseCase 
} from '../../../../domain/usecases/song/song.usecases';

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
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomePageComponent implements OnInit {
  private readonly themeService = inject(MaterialThemeService);
  private readonly getMostPopularSongsUseCase = inject(GetMostPopularSongsUseCase);
  private readonly getRandomSongsUseCase = inject(GetRandomSongsUseCase);
  private readonly router = inject(Router);

  // Observable para el tema
  isDarkTheme$ = this.themeService.isDarkMode$;

  // Signals para el estado
  mostPopularSongs = signal<Song[]>([]);
  randomSongs = signal<Song[]>([]);
  isLoadingPopular = signal(false);
  isLoadingRandom = signal(false);
  errorPopular = signal<string | null>(null);
  errorRandom = signal<string | null>(null);

  ngOnInit() {
    this.loadMostPopularSongs();
    this.loadRandomSongs();
  }

  private loadMostPopularSongs() {
    this.isLoadingPopular.set(true);
    this.errorPopular.set(null);

    this.getMostPopularSongsUseCase.execute({ limit: 10 }).pipe(
      finalize(() => this.isLoadingPopular.set(false))
    ).subscribe({
      next: (songs) => this.mostPopularSongs.set(songs),
      error: (error) => {
        console.error('Error loading popular songs:', error);
        this.errorPopular.set('No se pudieron cargar las canciones populares');
      }
    });
  }

  private loadRandomSongs() {
    this.isLoadingRandom.set(true);
    this.errorRandom.set(null);

    this.getRandomSongsUseCase.execute({ limit: 10 }).pipe(
      finalize(() => this.isLoadingRandom.set(false))
    ).subscribe({
      next: (songs) => this.randomSongs.set(songs),
      error: (error) => {
        console.error('Error loading random songs:', error);
        this.errorRandom.set('No se pudieron cargar las canciones aleatorias');
      }
    });
  }

  onSongSelect(song: Song) {
    // Navegación a la página de detalles de la canción
    this.router.navigate(['/song', song.id]);
  }

  onPlaySong(song: Song) {
    // Aquí puedes implementar la lógica para reproducir la canción
    console.log('Playing song:', song);
  }

  refresh() {
    this.loadMostPopularSongs();
    this.loadRandomSongs();
  }
}
