import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AlbumListItem } from '../../domain/entities/album.entity';
import { ArtistListItem } from '../../domain/entities/artist.entity';
import { GenreListItem } from '../../domain/entities/genre.entity';
import { GetPopularAlbumsUseCase } from '../../domain/usecases/album.usecases';
import { GetPopularArtistsUseCase } from '../../domain/usecases/artist.usecases';
import { GetPopularGenresUseCase } from '../../domain/usecases/genre.usecases';
import { MaterialThemeService } from '../../shared/services/material-theme.service';

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
  template: `
    <div class="discover-container" [class.dark-theme]="isDarkTheme()">
      <!-- Header -->
      <div class="discover-header">
        <h1>Descubrir Música</h1>
        <button mat-icon-button (click)="toggleTheme()">
          <mat-icon>{{ isDarkTheme() ? 'light_mode' : 'dark_mode' }}</mat-icon>
        </button>
      </div>

      <!-- Albums Populares -->
      <section class="discover-section">
        <h2>Álbumes Populares</h2>
        <div class="loading-container" *ngIf="isLoadingAlbums()">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
        <div class="error-message" *ngIf="albumsError()">
          Error al cargar álbumes: {{ albumsError() }}
        </div>
        <div class="albums-grid" *ngIf="!isLoadingAlbums() && !albumsError()">
          <mat-card *ngFor="let album of popularAlbums()" class="album-card">
            <img mat-card-image [src]="album.cover_url || '/assets/default-album.png'" 
                 [alt]="album.title" class="album-cover">
            <mat-card-content>
              <h3>{{ album.title }}</h3>
              <p>{{ album.artist_name }}</p>
              <p class="album-info">{{ album.total_tracks }} canciones</p>
              <p class="release-date">{{ album.release_date | date:'MMM yyyy' }}</p>
            </mat-card-content>
            <mat-card-actions>
              <button mat-button color="primary">
                <mat-icon>play_arrow</mat-icon>
                Reproducir
              </button>
            </mat-card-actions>
          </mat-card>
        </div>
      </section>

      <!-- Artistas Populares -->
      <section class="discover-section">
        <h2>Artistas Populares</h2>
        <div class="loading-container" *ngIf="isLoadingArtists()">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
        <div class="error-message" *ngIf="artistsError()">
          Error al cargar artistas: {{ artistsError() }}
        </div>
        <div class="artists-grid" *ngIf="!isLoadingArtists() && !artistsError()">
          <mat-card *ngFor="let artist of popularArtists()" class="artist-card">
            <img mat-card-image [src]="artist.image_url || '/assets/default-artist.png'" 
                 [alt]="artist.name" class="artist-image">
            <mat-card-content>
              <h3>{{ artist.name }}
                <mat-icon *ngIf="artist.is_verified" class="verified-icon">verified</mat-icon>
              </h3>
              <p class="artist-info">{{ artist.followers_count | number }} seguidores</p>
              <p class="artist-country" *ngIf="artist.country">{{ artist.country }}</p>
            </mat-card-content>
            <mat-card-actions>
              <button mat-button color="primary">Ver Perfil</button>
            </mat-card-actions>
          </mat-card>
        </div>
      </section>

      <!-- Géneros Populares -->
      <section class="discover-section">
        <h2>Géneros Populares</h2>
        <div class="loading-container" *ngIf="isLoadingGenres()">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
        <div class="error-message" *ngIf="genresError()">
          Error al cargar géneros: {{ genresError() }}
        </div>
        <div class="genres-container" *ngIf="!isLoadingGenres() && !genresError()">
          <mat-chip-set>
            <mat-chip *ngFor="let genre of popularGenres()" 
                     [style.background-color]="genre.color || '#e0e0e0'"
                     class="genre-chip">
              {{ genre.name }}
            </mat-chip>
          </mat-chip-set>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .discover-container {
      padding: 2rem;
      min-height: 100vh;
      background-color: var(--background-color, #fafafa);
      color: var(--text-color, #333);
      transition: all 0.3s ease;
    }

    .discover-container.dark-theme {
      --background-color: #121212;
      --text-color: #ffffff;
      --card-background: #1e1e1e;
      --border-color: #333;
    }

    .discover-container:not(.dark-theme) {
      --background-color: #fafafa;
      --text-color: #333;
      --card-background: #ffffff;
      --border-color: #e0e0e0;
    }

    .discover-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .discover-header h1 {
      margin: 0;
      color: var(--text-color);
    }

    .discover-section {
      margin-bottom: 3rem;
    }

    .discover-section h2 {
      margin-bottom: 1rem;
      color: var(--text-color);
    }

    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 200px;
    }

    .error-message {
      color: #f44336;
      text-align: center;
      padding: 1rem;
      background-color: rgba(244, 67, 54, 0.1);
      border-radius: 4px;
      margin: 1rem 0;
    }

    .albums-grid, .artists-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1rem;
    }

    .album-card, .artist-card {
      background-color: var(--card-background);
      color: var(--text-color);
      border: 1px solid var(--border-color);
    }

    .album-cover, .artist-image {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }

    .album-card h3, .artist-card h3 {
      margin: 0.5rem 0;
      font-size: 1.1rem;
      font-weight: 500;
    }

    .album-info, .artist-info, .artist-country {
      color: var(--text-color);
      opacity: 0.7;
      font-size: 0.9rem;
      margin: 0.25rem 0;
    }

    .release-date {
      color: var(--text-color);
      opacity: 0.6;
      font-size: 0.85rem;
    }

    .verified-icon {
      color: #1976d2;
      font-size: 1rem;
      margin-left: 0.25rem;
    }

    .genres-container {
      margin-top: 1rem;
    }

    .genre-chip {
      margin: 0.25rem;
      color: #333;
      font-weight: 500;
    }

    mat-card-actions {
      padding: 8px 16px;
    }

    mat-card-content {
      padding: 16px;
    }

    @media (max-width: 768px) {
      .discover-container {
        padding: 1rem;
      }

      .albums-grid, .artists-grid {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      }

      .discover-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }
    }
  `]
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
