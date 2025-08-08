import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MusicSectionComponent } from '../../../components/music-section/music-section';
import { ViewModeService } from '../../../shared/services/view-mode.service';
import { SkeletonGroupComponent } from '../../../shared/components/skeleton-group/skeleton-group.component';
import { SkeletonService } from '../../../shared/services/skeleton.service';
import type { SkeletonGroupConfig } from '../../../shared/components/skeleton-group/skeleton-group.component';
import { AlbumListItem } from '../../../../domain/entities/album.entity';
import { ArtistListItem } from '../../../../domain/entities/artist.entity';
import { GenreListItem } from '../../../../domain/entities/genre.entity';
import { Song } from '../../../../domain/entities/song.entity';
import { GetPopularAlbumsUseCase } from '../../../../domain/usecases/album.usecases';
import { GetPopularArtistsUseCase } from '../../../../domain/usecases/artist.usecases';
import { GetPopularGenresUseCase } from '../../../../domain/usecases/genre.usecases';
import { GetRandomSongsUseCase, GetMostPopularSongsUseCase } from '../../../../domain/usecases/song/song.usecases';
import { MaterialThemeService } from '../../../../shared/services/material-theme.service';
import { PlaylistService } from '../../../../infrastructure/services/playlist.service';

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
    MatProgressSpinnerModule,
    TranslateModule,
    SkeletonGroupComponent
  ],
  templateUrl: './discover.component.html',
  styleUrl: './discover.component.css'
})
export class DiscoverPageComponent implements OnInit {
  private readonly themeService = inject(MaterialThemeService);
  private readonly viewModeService = inject(ViewModeService);
  private readonly skeletonService = inject(SkeletonService);
  private readonly getPopularAlbumsUseCase = inject(GetPopularAlbumsUseCase);
  private readonly getPopularArtistsUseCase = inject(GetPopularArtistsUseCase);
  private readonly getPopularGenresUseCase = inject(GetPopularGenresUseCase);
  private readonly getRandomSongsUseCase = inject(GetRandomSongsUseCase);
  private readonly getMostPopularSongsUseCase = inject(GetMostPopularSongsUseCase);
  private readonly playlistService = inject(PlaylistService);
  private readonly translate = inject(TranslateService);

  // Signals
  isDarkTheme = this.themeService._isDarkMode;
  viewMode = this.viewModeService.viewMode;
  popularAlbums = signal<AlbumListItem[]>([]);
  popularArtists = signal<ArtistListItem[]>([]);
  popularGenres = signal<GenreListItem[]>([]);
  popularSongs = signal<Song[]>([]);
  randomSongs = signal<Song[]>([]);
  
  isLoadingAlbums = signal(false);
  isLoadingArtists = signal(false);
  isLoadingGenres = signal(false);
  isLoadingPopularSongs = signal(false);
  isLoadingRandomSongs = signal(false);
  
  albumsError = signal<string | null>(null);
  artistsError = signal<string | null>(null);
  genresError = signal<string | null>(null);
  popularSongsError = signal<string | null>(null);
  randomSongsError = signal<string | null>(null);

  // Skeleton configurations
  albumsSkeletonConfig: SkeletonGroupConfig = this.skeletonService.getPreset('albums');
  artistsSkeletonConfig: SkeletonGroupConfig = this.skeletonService.getPreset('artists');
  genresSkeletonConfig: SkeletonGroupConfig = this.skeletonService.getPreset('genres');
  songsSkeletonConfig: SkeletonGroupConfig = this.skeletonService.getPreset('songs');

  // Button configurations for music section
  popularSongsPrimaryButton = {
    text: 'HOME.VIEW_ALL',
    action: () => {
      console.log('🎵 Navigate to all popular songs');
      // Navigate to songs page - will be implemented when songs page is ready
    },
    ariaLabel: 'Ver todas las canciones populares'
  };
  

  popularSongsActionButtons = [
    {
      icon: 'refresh',
      action: () => this.loadPopularSongs(),
      ariaLabel: 'Recargar canciones populares'
    }
  ];

  randomSongsPrimaryButton = {
    text: 'HOME.VIEW_ALL',
    action: () => {
      console.log('🎵 Navigate to all random songs');
      // Navigate to songs page - will be implemented when songs page is ready
    },
    ariaLabel: 'Ver todas las canciones aleatorias'
  };

  randomSongsActionButtons = [
    {
      icon: 'refresh',
      action: () => this.loadRandomSongs(),
      ariaLabel: 'Recargar música aleatoria'
    }
  ];

  ngOnInit() {
    this.loadPopularAlbums();
    this.loadPopularArtists();
    this.loadPopularGenres();
    this.loadPopularSongs();
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
        this.translate.get('DISCOVER.MESSAGE_ALBUM').subscribe(translatedMessage => {
          this.albumsError.set(translatedMessage);
        });
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
        this.translate.get('DISCOVER.MESSAGE_ARTIST').subscribe(translatedMessage => {
          this.artistsError.set(translatedMessage);
        });
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
        this.translate.get('DISCOVER.MESSAGE_GENRE').subscribe(translatedMessage => {
          this.genresError.set(translatedMessage);
        });
        this.isLoadingGenres.set(false);
      }
    });
  }

  private loadPopularSongs() {
    this.isLoadingPopularSongs.set(true);
    this.popularSongsError.set(null);

    this.getMostPopularSongsUseCase.execute(1, 6).subscribe({
      next: (songs) => {
        this.popularSongs.set(songs);
        this.isLoadingPopularSongs.set(false);
      },
      error: (error) => {
        console.error('Error loading popular songs:', error);
        this.translate.get('DISCOVER.MESSAGE_POPULAR_SONG').subscribe(translatedMessage => {
          this.popularSongsError.set(translatedMessage);
        });
        this.isLoadingPopularSongs.set(false);
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
        this.translate.get('DISCOVER.MESSAGE_RANDOM_SONG').subscribe(translatedMessage => {
          this.randomSongsError.set(translatedMessage);
        });
        this.isLoadingRandomSongs.set(false);
      }
    });
  }

  playPopularSong(song: Song) {
    const playlist = this.popularSongs();
    const songIndex = playlist.findIndex(s => s.id === song.id);
    this.playlistService.createPlaylist(playlist, 'Canciones Populares', songIndex);
    this.playlistService.togglePlayback();
  }

  playRandomSong(song: Song) {
    const playlist = this.randomSongs();
    const songIndex = playlist.findIndex(s => s.id === song.id);
    this.playlistService.createPlaylist(playlist, 'Música Aleatoria', songIndex);
    this.playlistService.togglePlayback();
  }

  onPopularSongSelected(song: Song) {
    console.log('🎵 Discover: Popular song selected:', song.title);
    this.playPopularSong(song);
  }

  onRetryPopularSongs() {
    console.log('🔄 Discover: Retrying popular songs load');
    this.loadPopularSongs();
  }

  onRandomSongSelected(song: Song) {
    console.log('🎵 Discover: Random song selected:', song.title);
    this.playRandomSong(song);
  }

  onRetryRandomSongs() {
    console.log('🔄 Discover: Retrying random songs load');
    this.loadRandomSongs();
  }

  toggleViewMode() {
    this.viewModeService.toggleViewMode();
  }

  // Métodos para acciones de canciones
  onAddToQueue(song: Song) {
    console.log('🎵 Discover: Add to queue requested for:', song.title);
    // Implementar lógica de agregar a cola
  }

  onAddToPlaylist(song: Song) {
    console.log('📋 Discover: Add to playlist requested for:', song.title);
    // Implementar lógica de agregar a playlist
  }

  onAddToFavorites(song: Song) {
    console.log('❤️ Discover: Add to favorites requested for:', song.title);
    // Implementar lógica de agregar a favoritos
  }

  onMoreOptions(song: Song) {
    console.log('⚙️ Discover: More options requested for:', song.title);
    // Implementar menú de más opciones
  }

  formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}
