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

  // Signals para datos - usando datos del backend
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

  // Computed properties para compatibilidad con templates
  get mockPlaylists() { return this.playlists(); }
  get mockArtists() { return this.artists(); }
  get mockAlbums() { return this.albums(); }
  get isEmpty() { 
    return this.playlists().length === 0 && 
           this.artists().length === 0 && 
           this.albums().length === 0; 
  }

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

  // Métodos de la UI - compatibilidad con templates
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

  closeModal() {
    this.closeCreateModal();
  }

  onModalBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.closeCreateModal();
    }
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.selectedImageFile = file;

      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreviewUrl = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  triggerImageUpload() {
    const input = document.getElementById('imageInput') as HTMLInputElement;
    input?.click();
  }

  removeImage() {
    this.selectedImageFile = null;
    this.imagePreviewUrl = null;
  }

  createPlaylist() {
    if (!this.newPlaylist.name.trim()) {
      return;
    }

    console.log('Creating playlist:', this.newPlaylist);
    console.log('Selected image:', this.selectedImageFile);
    this.closeCreateModal();
  }

  savePlaylist() {
    this.createPlaylist();
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

  // Métodos de navegación
  navigateToPlaylist(playlistId: string) {
    this.router.navigate(['/music/playlist', playlistId]);
  }

  playPlaylist(playlist: Playlist) {
    this.navigateToPlaylist(playlist.id);
  }

  startPlayingPlaylist(playlist: Playlist, event: Event) {
    event.stopPropagation();
    console.log('Starting to play playlist:', playlist.name);
    // TODO: Implementar reproducción con UseCase
  }

  navigateToArtist(artistId: string) {
    this.router.navigate(['/music/artist', artistId]);
  }

  viewArtist(artist: Artist) {
    this.navigateToArtist(artist.id);
  }

  toggleFollowArtist(artist: Artist) {
    // TODO: Implementar seguimiento de artista con UseCase
    console.log('Toggle follow artist:', artist.name);
  }

  navigateToAlbum(albumId: string) {
    this.router.navigate(['/music/album', albumId]);
  }

  playAlbum(album: Album) {
    console.log('Playing album:', album.title);
    // TODO: Implementar reproducción con UseCase
  }

  exploreMusic() {
    this.router.navigate(['/music/discover']);
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
