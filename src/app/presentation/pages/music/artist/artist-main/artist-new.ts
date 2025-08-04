import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, ActivatedRoute } from '@angular/router';

// Domain imports
import { GetArtistByIdUseCase } from '@app/domain/usecases/artist.usecases';
import { GetAlbumsByArtistUseCase } from '@app/domain/usecases/album.usecases';
import { Artist as DomainArtist } from '@app/domain/entities/artist.entity';
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
  artist = signal<DomainArtist | null>(null);
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
      this.getArtistByIdUseCase.execute(artistId).subscribe({
        next: (artist) => {
          this.artist.set(artist);
          this.artistLoading.set(false);
        },
        error: (error) => {
          this.artistError.set('Error al cargar información del artista');
          console.error('Error loading artist:', error);
          this.artistLoading.set(false);
        }
      });
    } catch (error) {
      this.artistError.set('Error de conexión al cargar artista');
      console.error('Error loading artist:', error);
      this.artistLoading.set(false);
    }
  }

  private async loadArtistAlbums(artistId: string): Promise<void> {
    this.albumsLoading.set(true);
    this.albumsError.set(null);
    
    try {
      this.getAlbumsByArtistUseCase.execute({ artist_id: artistId, limit: 20 }).subscribe({
        next: (albums) => {
          this.albums.set(albums);
          this.albumsLoading.set(false);
        },
        error: (error) => {
          this.albumsError.set('Error al cargar álbumes del artista');
          console.error('Error loading albums:', error);
          this.albumsLoading.set(false);
        }
      });
    } catch (error) {
      this.albumsError.set('Error de conexión al cargar álbumes');
      console.error('Error loading albums:', error);
      this.albumsLoading.set(false);
    }
  }

  refreshData(): void {
    const artistId = this.route.snapshot.params['id'];
    if (artistId) {
      this.loadArtistData(artistId);
    }
  }

  playArtist(): void {
    console.log('Playing artist:', this.artist()?.name);
    // Implementar lógica de reproducción
  }

  toggleFollow(): void {
    this.isFollowing.update(current => !current);
    console.log(this.isFollowing() ? 'Following' : 'Unfollowing', this.artist()?.name);
    // Implementar lógica de seguir/no seguir
  }

  navigateToAlbum(albumId: string): void {
    this.router.navigate(['/music/album', albumId]);
  }

  goBack(): void {
    this.router.navigate(['/music/library']);
  }

  onImageError(event: any): void {
    event.target.src = '/assets/default-artist.png';
  }

  onImageLoad(event: any): void {
    // Image loaded successfully
  }
}
