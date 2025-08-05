import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { GlobalPlayerStateService } from '@app/infrastructure/services';
import { PlaylistService } from '@app/infrastructure/services/playlist.service';
import { GlobalPlaylistModalService } from '@app/shared/services/global-playlist-modal.service';
import { PlayerState } from '@app/domain/entities/player-state.entity';
import { Playlist } from '@app/domain/entities/song.entity';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-global-playlist-modal',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './global-playlist-modal.html',
  styleUrls: ['./global-playlist-modal.css'],
})
export class GlobalPlaylistModalComponent implements OnInit, OnDestroy {
  isVisible = false;
  currentPlaylist: Playlist | null = null;
  currentSong: any = null;
  private readonly destroy$ = new Subject<void>();

  private readonly globalPlayerState = inject(GlobalPlayerStateService);
  private readonly playlistService = inject(PlaylistService);
  private readonly modalService = inject(GlobalPlaylistModalService);
  private readonly cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.setupSubscriptions();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSubscriptions(): void {
    // Suscribirse al estado de visibilidad del modal
    this.modalService.isVisible$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isVisible) => {
        this.isVisible = isVisible;
        this.cdr.detectChanges();
      });

    // Suscribirse al estado del player para obtener la canción actual
    this.globalPlayerState
      .getPlayerState$()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (playerState: PlayerState) => {
          if (playerState.currentSong) {
            this.currentSong = {
              id: playerState.currentSong.id,
              title: playerState.currentSong.title,
              artist: playerState.currentSong.artist_name || 'Unknown Artist',
              isPlaying: playerState.isPlaying,
            };
          } else {
            this.currentSong = null;
          }
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error in player state subscription:', error);
        }
      });

    // Suscribirse a la playlist actual
    this.playlistService.currentPlaylist$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (playlist: Playlist | null) => {
          this.currentPlaylist = playlist;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error in playlist subscription:', error);
        }
      });
  }

  show(): void {
    this.modalService.show();
  }

  hide(): void {
    this.modalService.hide();
  }

  toggle(): void {
    this.modalService.toggle();
  }

  selectSongFromPlaylist(index: number): void {
    console.log('🎵 Seleccionando canción desde playlist global:', index);
    this.playlistService.selectSong(index);
    
    // Iniciar reproducción después de seleccionar
    setTimeout(() => {
      this.playlistService.togglePlayback();
    }, 100);
  }

  getPlaylistContextInfo(): string {
    if (!this.currentPlaylist) return '';
    
    switch (this.currentPlaylist.contextType) {
      case 'search':
        return `Búsqueda: ${this.currentPlaylist.searchQuery || 'Sin query'}`;
      case 'random':
        return 'Canciones Aleatorias';
      case 'popular':
        return 'Canciones Populares';
      case 'album':
        return `Álbum`;
      case 'artist':
        return `Artista`;
      case 'user_playlist':
        return 'Mi Playlist';
      default:
        return 'Playlist';
    }
  }

  canLoadMore(): boolean {
    return this.currentPlaylist?.canLoadMore === true;
  }

  trackByIndex(index: number): number {
    return index;
  }
}
