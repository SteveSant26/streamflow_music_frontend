import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AlbumListItem } from '../../../../domain/entities/album.entity';
import { ArtistListItem } from '../../../../domain/entities/artist.entity';
import { GenreListItem } from '../../../../domain/entities/genre.entity';
import { GetPopularAlbumsUseCase } from '../../../../domain/usecases/album.usecases';
import { GetPopularArtistsUseCase } from '../../../../domain/usecases/artist.usecases';
import { GetPopularGenresUseCase } from '../../../../domain/usecases/genre.usecases';
import { MaterialThemeService } from '../../../../shared/services/material-theme.service';

@Component({
  selector: 'app-discover',
  standalone: true,
  imports: [
    CommonModule,
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
  private themeService = inject(MaterialThemeService);
  private getPopularAlbumsUseCase = inject(GetPopularAlbumsUseCase);
  private getPopularArtistsUseCase = inject(GetPopularArtistsUseCase);
  private getPopularGenresUseCase = inject(GetPopularGenresUseCase);

  // Signals
  isDarkTheme = this.themeService.isDarkMode;
  popularAlbums = signal<AlbumListItem[]>([]);
  popularArtists = signal<ArtistListItem[]>([]);
  popularGenres = signal<GenreListItem[]>([]);
  
  isLoadingAlbums = signal(false);
  isLoadingArtists = signal(false);
  isLoadingGenres = signal(false);
  
  albumsError = signal<string | null>(null);
  artistsError = signal<string | null>(null);
  genresError = signal<string | null>(null);

  ngOnInit() {
    this.loadPopularAlbums();
    this.loadPopularArtists();
    this.loadPopularGenres();
  }

  toggleTheme() {
    this.themeService.setTheme(this.themeService._isDarkMode() ? 'light' : 'dark');
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
}
