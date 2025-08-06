import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { ROUTES_CONFIG_MUSIC } from '@app/config';

// Domain imports
import { GetArtistByIdUseCase } from '@app/domain/usecases/artist.usecases';
import { GetAlbumsByArtistUseCase } from '@app/domain/usecases/album.usecases';
import { Artist } from '@app/domain/entities/artist.entity';
import { AlbumListItem } from '@app/domain/entities/album.entity';

@Component({
  selector: 'app-artist',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatCardModule, MatProgressSpinnerModule],
  templateUrl: './artist.html',
  styleUrls: ['./artist.css']
})
export class ArtistComponent implements OnInit {
  private readonly getArtistByIdUseCase = inject(GetArtistByIdUseCase);
  private readonly getAlbumsByArtistUseCase = inject(GetAlbumsByArtistUseCase);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  // States
  artist = signal<Artist | null>(null);
  albums = signal<AlbumListItem[]>([]);
  
  // Loading states
  artistLoading = signal(false);
  albumsLoading = signal(false);
  
  // Error states
  artistError = signal<string | null>(null);
  albumsError = signal<string | null>(null);

  // UI states
  isFollowing = signal(false);

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const artistId = params['id'];
      if (artistId) {
        this.loadArtistData(artistId);
      }
    });
  }

  private async loadArtistData(artistId: string): Promise<void> {
    await Promise.all([
      this.loadArtist(artistId),
      this.loadArtistAlbums(artistId)
    ]);
  }

  private async loadArtist(artistId: string): Promise<void> {
    this.artistLoading.set(true);
    this.artistError.set(null);
    
    try {
      const result = this.getArtistByIdUseCase.execute(artistId) as any;
      if (result.success && result.data) {
        this.artist.set(result.data);
      } else {
        this.artistError.set(result.error || 'Error al cargar el artista');
      }
    } catch (error) {
      this.artistError.set('Error de conexión al cargar el artista');
      console.error('Error loading artist:', error);
    } finally {
      this.artistLoading.set(false);
    }
  }

  private async loadArtistAlbums(artistId: string): Promise<void> {
    this.albumsLoading.set(true);
    this.albumsError.set(null);
    
    try {
      const result = this.getAlbumsByArtistUseCase.execute({ artist_id: artistId, limit: 20 }) as any;
      if (result.success && result.data) {
        this.albums.set(result.data);
      } else {
        this.albumsError.set(result.error || 'Error al cargar los álbumes');
      }
    } catch (error) {
      this.albumsError.set('Error de conexión al cargar los álbumes');
      console.error('Error loading albums:', error);
    } finally {
      this.albumsLoading.set(false);
    }
  }

  toggleFollow(): void {
    this.isFollowing.set(!this.isFollowing());
  }

  navigateToAlbum(albumId: string): void {
    this.router.navigate([ROUTES_CONFIG_MUSIC.ALBUM.getLinkWithId(albumId)]);
  }

  onImageError(event: any): void {
    event.target.src = '/assets/default-artist.png';
  }

  refreshData(): void {
    const artistId = this.route.snapshot.params['id'];
    if (artistId) {
      this.loadArtistData(artistId);
    }
  }
}
