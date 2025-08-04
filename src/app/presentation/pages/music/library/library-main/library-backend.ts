import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs';

// Domain
import { LegacyPlaylist as Playlist } from '@app/domain/entities/playlist.entity';
import { ArtistListItem as Artist } from '@app/domain/entities/artist.entity';
import { AlbumListItem as Album } from '@app/domain/entities/album.entity';

// Use Cases
import { GetUserPlaylistsUseCase } from '@app/domain/usecases/playlist/playlist.usecases';
import { GetPopularArtistsUseCase } from '@app/domain/usecases/artist.usecases';
import { GetPopularAlbumsUseCase } from '@app/domain/usecases/album.usecases';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, MatIconModule, MatProgressSpinnerModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './library.html',
  styleUrl: './library.css',
})
export class LibraryComponent implements OnInit {
  // Inyección de dependencias
  private readonly router = inject(Router);
  private readonly getUserPlaylistsUseCase = inject(GetUserPlaylistsUseCase);
  private readonly getPopularArtistsUseCase = inject(GetPopularArtistsUseCase);
  private readonly getPopularAlbumsUseCase = inject(GetPopularAlbumsUseCase);

  // Estado
  activeTab: 'playlists' | 'artists' | 'albums' = 'playlists';
  showCreateModal = false;
  selectedImageFile: File | null = null;
  imagePreviewUrl: string | null = null;

  // Form data para nueva playlist
  newPlaylist = {
    name: '',
    description: '',
    isPrivate: false,
  };

  // Signals para datos
  playlists = signal<Playlist[]>([]);
  artists = signal<Artist[]>([]);
  albums = signal<Album[]>([]);

  // Signals para loading states
  playlistsLoading = signal(false);
  artistsLoading = signal(false);
  albumsLoading = signal(false);

  // Signals para errors
  playlistsError = signal<string | null>(null);
  artistsError = signal<string | null>(null);
  albumsError = signal<string | null>(null);

  ngOnInit() {
    this.loadUserPlaylists();
    this.loadPopularArtists();
    this.loadPopularAlbums();
  }

  private loadUserPlaylists() {
    this.playlistsLoading.set(true);
    this.playlistsError.set(null);

    this.getUserPlaylistsUseCase.execute().pipe(
      finalize(() => this.playlistsLoading.set(false))
    ).subscribe({
      next: (playlists) => this.playlists.set(playlists),
      error: (error) => {
        console.error('Error loading playlists:', error);
        this.playlistsError.set('No se pudieron cargar las playlists');
      }
    });
  }

  private loadPopularArtists() {
    this.artistsLoading.set(true);
    this.artistsError.set(null);

    this.getPopularArtistsUseCase.execute({ limit: 20 }).pipe(
      finalize(() => this.artistsLoading.set(false))
    ).subscribe({
      next: (artists) => this.artists.set(artists),
      error: (error) => {
        console.error('Error loading artists:', error);
        this.artistsError.set('No se pudieron cargar los artistas');
      }
    });
  }

  private loadPopularAlbums() {
    this.albumsLoading.set(true);
    this.albumsError.set(null);

    this.getPopularAlbumsUseCase.execute({ limit: 20 }).pipe(
      finalize(() => this.albumsLoading.set(false))
    ).subscribe({
      next: (albums) => this.albums.set(albums),
      error: (error) => {
        console.error('Error loading albums:', error);
        this.albumsError.set('No se pudieron cargar los álbumes');
      }
    });
  }

  // Métodos de la UI
  setActiveTab(tab: 'playlists' | 'artists' | 'albums') {
    this.activeTab = tab;
  }

  openCreateModal() {
    this.showCreateModal = true;
  }

  closeCreateModal() {
    this.showCreateModal = false;
    this.resetForm();
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.selectedImageFile = file;

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreviewUrl = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  createPlaylist() {
    if (!this.newPlaylist.name.trim()) {
      return;
    }

    // TODO: Implementar creación de playlist con UseCase
    console.log('Creating playlist:', this.newPlaylist);
    console.log('Selected image:', this.selectedImageFile);

    // Por ahora, cerrar el modal
    this.closeCreateModal();
  }

  private resetForm() {
    this.newPlaylist = {
      name: '',
      description: '',
      isPrivate: false,
    };
    this.selectedImageFile = null;
    this.imagePreviewUrl = null;
  }

  navigateToPlaylist(playlistId: string) {
    this.router.navigate(['/music/playlist', playlistId]);
  }

  navigateToArtist(artistId: string) {
    this.router.navigate(['/music/artist', artistId]);
  }

  navigateToAlbum(albumId: string) {
    this.router.navigate(['/music/album', albumId]);
  }

  // Métodos para refrescar datos
  refreshPlaylists() {
    this.loadUserPlaylists();
  }

  refreshArtists() {
    this.loadPopularArtists();
  }

  refreshAlbums() {
    this.loadPopularAlbums();
  }
}
