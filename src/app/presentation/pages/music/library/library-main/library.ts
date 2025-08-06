import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { ROUTES_CONFIG_MUSIC } from '@app/config';

// Domain imports
import { GetUserPlaylistsUseCase } from '@app/domain/usecases/playlist/playlist.usecases';
import { GetPopularArtistsUseCase } from '@app/domain/usecases/artist.usecases';
import { GetPopularAlbumsUseCase } from '@app/domain/usecases/album.usecases';
import { Playlist } from '@app/domain/entities/playlist.entity';
import { ArtistListItem } from '@app/domain/entities/artist.entity';
import { AlbumListItem } from '@app/domain/entities/album.entity';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatCardModule, MatProgressSpinnerModule],
  templateUrl: './library.html',
  styleUrls: ['./library.css']
})
export class LibraryComponent implements OnInit {
  private readonly getUserPlaylistsUseCase = inject(GetUserPlaylistsUseCase);
  private readonly getPopularArtistsUseCase = inject(GetPopularArtistsUseCase);
  private readonly getPopularAlbumsUseCase = inject(GetPopularAlbumsUseCase);
  private readonly router = inject(Router);

  // States
  playlists = signal<Playlist[]>([]);
  artists = signal<ArtistListItem[]>([]);
  albums = signal<AlbumListItem[]>([]);
  
  // Loading states
  playlistsLoading = signal(false);
  artistsLoading = signal(false);
  albumsLoading = signal(false);
  
  // Error states
  playlistsError = signal<string | null>(null);
  artistsError = signal<string | null>(null);
  albumsError = signal<string | null>(null);

  ngOnInit(): void {
    this.loadUserContent();
  }

  private async loadUserContent(): Promise<void> {
    await Promise.all([
      this.loadUserPlaylists(),
      this.loadPopularArtists(),
      this.loadPopularAlbums()
    ]);
  }

  private async loadUserPlaylists(): Promise<void> {
    this.playlistsLoading.set(true);
    this.playlistsError.set(null);
    
    try {
      const result = this.getUserPlaylistsUseCase.execute() as any;
      if (result.success && result.data) {
        this.playlists.set(result.data);
      } else {
        this.playlistsError.set(result.error || 'Error al cargar playlists');
      }
    } catch (error) {
      this.playlistsError.set('Error de conexión al cargar playlists');
      console.error('Error loading playlists:', error);
    } finally {
      this.playlistsLoading.set(false);
    }
  }

  private async loadPopularArtists(): Promise<void> {
    this.artistsLoading.set(true);
    this.artistsError.set(null);
    
    try {
      const result = this.getPopularArtistsUseCase.execute({ limit: 10 }) as any;
      if (result.success && result.data) {
        this.artists.set(result.data);
      } else {
        this.artistsError.set(result.error || 'Error al cargar artistas');
      }
    } catch (error) {
      this.artistsError.set('Error de conexión al cargar artistas');
      console.error('Error loading artists:', error);
    } finally {
      this.artistsLoading.set(false);
    }
  }

  private async loadPopularAlbums(): Promise<void> {
    this.albumsLoading.set(true);
    this.albumsError.set(null);
    
    try {
      const result = this.getPopularAlbumsUseCase.execute({ limit: 10 }) as any;
      if (result.success && result.data) {
        this.albums.set(result.data);
      } else {
        this.albumsError.set(result.error || 'Error al cargar álbumes');
      }
    } catch (error) {
      this.albumsError.set('Error de conexión al cargar álbumes');
      console.error('Error loading albums:', error);
    } finally {
      this.albumsLoading.set(false);
    }
  }

  refreshData(): void {
    this.loadUserContent();
  }

  navigateToArtist(artistId: string): void {
    this.router.navigate([ROUTES_CONFIG_MUSIC.ARTIST.getLinkWithId(artistId)]);
  }

  navigateToAlbum(albumId: string): void {
    this.router.navigate([ROUTES_CONFIG_MUSIC.ALBUM.getLinkWithId(albumId)]);
  }

  navigateToPlaylist(playlistId: string): void {
    this.router.navigate([ROUTES_CONFIG_MUSIC.PLAYLIST.getLinkWithId(playlistId)]);
  }

  onImageError(event: any): void {
    event.target.src = '/assets/default-placeholder.png';
  }

  onImageLoad(event: any): void {
    // Image loaded successfully
  }
}
