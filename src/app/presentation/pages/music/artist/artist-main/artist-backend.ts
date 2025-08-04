import {
  Component,
  OnInit,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { finalize, switchMap } from 'rxjs';

// Domain
import { Artist } from '@app/domain/entities/artist.entity';
import { AlbumListItem } from '@app/domain/entities/album.entity';

// Use Cases
import { GetArtistByIdUseCase } from '@app/domain/usecases/artist.usecases';
import { GetAlbumsByArtistUseCase } from '@app/domain/usecases/album.usecases';

@Component({
  selector: 'app-artist',
  standalone: true,
  imports: [
    CommonModule, 
    TranslateModule, 
    MatProgressSpinnerModule, 
    MatButtonModule, 
    MatIconModule
  ],
  templateUrl: './artist.html',
  styleUrls: ['./artist.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtistComponent implements OnInit {
  // Inyección de dependencias
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly getArtistByIdUseCase = inject(GetArtistByIdUseCase);
  private readonly getAlbumsByArtistUseCase = inject(GetAlbumsByArtistUseCase);

  // Signals para datos
  artist = signal<Artist | null>(null);
  albums = signal<AlbumListItem[]>([]);

  // Signals para loading states
  artistLoading = signal(false);
  albumsLoading = signal(false);

  // Signals para errors
  artistError = signal<string | null>(null);
  albumsError = signal<string | null>(null);

  // Estado de seguimiento
  isFollowing = signal(false);

  ngOnInit() {
    this.route.params.pipe(
      switchMap(params => {
        const artistId = params['id'];
        this.loadArtist(artistId);
        this.loadArtistAlbums(artistId);
        return [];
      })
    ).subscribe();
  }

  private loadArtist(artistId: string) {
    this.artistLoading.set(true);
    this.artistError.set(null);

    this.getArtistByIdUseCase.execute(artistId).pipe(
      finalize(() => this.artistLoading.set(false))
    ).subscribe({
      next: (artist) => {
        this.artist.set(artist);
        this.isFollowing.set(artist.is_verified || false); // temporal
      },
      error: (error) => {
        console.error('Error loading artist:', error);
        this.artistError.set('No se pudo cargar la información del artista');
      }
    });
  }

  private loadArtistAlbums(artistId: string) {
    this.albumsLoading.set(true);
    this.albumsError.set(null);

    this.getAlbumsByArtistUseCase.execute({ 
      artist_id: artistId, 
      limit: 20 
    }).pipe(
      finalize(() => this.albumsLoading.set(false))
    ).subscribe({
      next: (albums) => this.albums.set(albums),
      error: (error) => {
        console.error('Error loading artist albums:', error);
        this.albumsError.set('No se pudieron cargar los álbumes del artista');
      }
    });
  }

  toggleFollow() {
    // TODO: Implementar seguimiento de artista con UseCase
    this.isFollowing.set(!this.isFollowing());
    console.log('Toggle follow artist:', this.artist()?.id);
  }

  playArtist() {
    // TODO: Implementar reproducción de artista con UseCase
    console.log('Play artist:', this.artist()?.id);
  }

  navigateToAlbum(albumId: string) {
    this.router.navigate(['/music/album', albumId]);
  }

  goBack() {
    this.router.navigate(['/music/library']);
  }

  refreshData() {
    const artistId = this.route.snapshot.params['id'];
    if (artistId) {
      this.loadArtist(artistId);
      this.loadArtistAlbums(artistId);
    }
  }
}
