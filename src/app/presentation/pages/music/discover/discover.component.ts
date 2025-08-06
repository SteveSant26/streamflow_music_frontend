import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AlbumListItem } from '../../../../domain/entities/album.entity';
import { ArtistListItem } from '../../../../domain/entities/artist.entity';
import { GenreListItem } from '../../../../domain/entities/genre.entity';
import { Song } from '../../../../domain/entities/song.entity';
import { GetPopularAlbumsUseCase } from '../../../../domain/usecases/album.usecases';
import { GetPopularArtistsUseCase } from '../../../../domain/usecases/artist.usecases';
import { GetPopularGenresUseCase } from '../../../../domain/usecases/genre.usecases';
import { GetRandomSongsUseCase } from '../../../../domain/usecases/song/song.usecases';
import { MaterialThemeService } from '../../../../shared/services/material-theme.service';
import { AudioPlayerService } from '../../../../infrastructure/services/audio-player.service';

@Component({
  selector: 'app-discover',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './discover.component.html',
  styleUrl: './discover.component.css'
})
export class DiscoverPageComponent implements OnInit {
  private readonly themeService = inject(MaterialThemeService);
  private readonly getPopularAlbumsUseCase = inject(GetPopularAlbumsUseCase);
  private readonly getPopularArtistsUseCase = inject(GetPopularArtistsUseCase);
  private readonly getPopularGenresUseCase = inject(GetPopularGenresUseCase);
  private readonly getRandomSongsUseCase = inject(GetRandomSongsUseCase);
  private readonly audioPlayerService = inject(AudioPlayerService);

  // Signals
  isDarkTheme = this.themeService._isDarkMode;
  popularAlbums = signal<AlbumListItem[]>([]);
  popularArtists = signal<ArtistListItem[]>([]);
  popularGenres = signal<GenreListItem[]>([]);
  randomSongs = signal<Song[]>([]);
  
  isLoadingAlbums = signal(false);
  isLoadingArtists = signal(false);
  isLoadingGenres = signal(false);
  isLoadingRandomSongs = signal(false);
  
  albumsError = signal<string | null>(null);
  artistsError = signal<string | null>(null);
  genresError = signal<string | null>(null);
  randomSongsError = signal<string | null>(null);

  ngOnInit() {
    this.loadPopularAlbums();
    this.loadPopularArtists();
    this.loadPopularGenres();
    this.loadRandomSongs();
  }

  toggleTheme() {
    const currentTheme = this.themeService.getTheme();
    const newTheme = currentTheme.isDark ? 'light' : 'dark';
    this.themeService.setTheme(newTheme);
  }

  private loadPopularAlbums() {
    this.isLoadingAlbums.set(true);
    this.albumsError.set(null);

    this.getPopularAlbumsUseCase.execute({ limit: 8 }).subscribe({
      next: (albums) => {
        this.popularAlbums.set(albums);
        this.isLoadingAlbums.set(false);
      },
      error: (error) => {
        console.error('Error loading popular albums:', error);
        this.albumsError.set('No se pudieron cargar los álbumes populares');
        this.isLoadingAlbums.set(false);
      }
    });
  }

  private loadPopularArtists() {
    this.isLoadingArtists.set(true);
    this.artistsError.set(null);

    this.getPopularArtistsUseCase.execute({ limit: 8 }).subscribe({
      next: (artists) => {
        this.popularArtists.set(artists);
        this.isLoadingArtists.set(false);
      },
      error: (error) => {
        console.error('Error loading popular artists:', error);
        this.artistsError.set('No se pudieron cargar los artistas populares');
        this.isLoadingArtists.set(false);
      }
    });
  }

  private loadPopularGenres() {
    this.isLoadingGenres.set(true);
    this.genresError.set(null);

    this.getPopularGenresUseCase.execute({ limit: 10 }).subscribe({
      next: (genres) => {
        this.popularGenres.set(genres);
        this.isLoadingGenres.set(false);
      },
      error: (error) => {
        console.error('Error loading popular genres:', error);
        this.genresError.set('No se pudieron cargar los géneros populares');
        this.isLoadingGenres.set(false);
      }
    });
  }

  private loadRandomSongs() {
    this.isLoadingRandomSongs.set(true);
    this.randomSongsError.set(null);

    this.getRandomSongsUseCase.execute(1, 6).subscribe({
      next: (songs) => {
        this.randomSongs.set(songs);
        this.isLoadingRandomSongs.set(false);
      },
      error: (error) => {
        console.error('Error loading random songs:', error);
        this.randomSongsError.set('No se pudieron cargar las canciones aleatorias');
        this.isLoadingRandomSongs.set(false);
      }
    });
  }

  playRandomSong(song: Song) {
    const playlist = this.randomSongs();
    const songIndex = playlist.findIndex(s => s.id === song.id);
    this.audioPlayerService.playSong(song, playlist, songIndex);
  }

  formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}
