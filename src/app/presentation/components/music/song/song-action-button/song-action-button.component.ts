import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog } from '@angular/material/dialog';

import { Song } from '../../../../../domain/entities/song.entity';
import { PlayerUseCase } from '../../../../../domain/usecases/player/player.usecases';
import { PlaySongUseCase } from '../../../../../domain/usecases/song/song.usecases'; // ← AGREGADO
import { AddSongToPlaylistDialogComponent } from '../../playlist/add-song-to-playlist-dialog/add-song-to-playlist-dialog.component';

@Component({
  selector: 'app-song-action-button',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    MatDividerModule
  ],
  template: `
    <div class="song-actions">
      <!-- Actions menu with current playing indicator -->
      <button 
        mat-icon-button 
        [matMenuTriggerFor]="actionsMenu"
        [matTooltip]="isCurrentSongPlaying() ? 'Canción reproduciéndose' : 'Opciones de reproducción'"
        [class]="isCurrentSongPlaying() ? 'currently-playing' : 'play-btn'">
        <mat-icon [class.text-green-500]="isCurrentSongPlaying()" 
                  [class.animate-pulse]="isCurrentSongPlaying()">
          {{ isCurrentSongPlaying() ? 'volume_up' : 'play_arrow' }}
        </mat-icon>
      </button>

      <mat-menu #actionsMenu="matMenu" class="song-actions-menu">
        <button mat-menu-item (click)="playSong()">
          <mat-icon>{{ isCurrentSongPlaying() ? 'pause' : 'play_arrow' }}</mat-icon>
          <span>{{ isCurrentSongPlaying() ? 'Pausar' : 'Reproducir ahora' }}</span>
        </button>
        
        <button mat-menu-item (click)="playNext()">
          <mat-icon>skip_next</mat-icon>
          <span>Reproducir siguiente</span>
        </button>
        
        <button mat-menu-item (click)="addToQueue()">
          <mat-icon>queue</mat-icon>
          <span>Agregar a cola</span>
        </button>
        
        <mat-divider></mat-divider>
        
        <button mat-menu-item (click)="addToPlaylist()">
          <mat-icon>playlist_add</mat-icon>
          <span>Agregar a playlist</span>
        </button>
        
        <button mat-menu-item (click)="addToFavorites()">
          <mat-icon>favorite_border</mat-icon>
          <span>Agregar a favoritos</span>
        </button>
        
        <mat-divider></mat-divider>
        
        <button mat-menu-item (click)="shareSong()">
          <mat-icon>share</mat-icon>
          <span>Compartir</span>
        </button>
        
        <button mat-menu-item (click)="viewInfo()">
          <mat-icon>info</mat-icon>
          <span>Ver información</span>
        </button>
      </mat-menu>
    </div>
  `,
  styles: [`
    .song-actions {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .play-btn {
      color: var(--primary-color, #1976d2);
      background: var(--primary-container, rgba(25, 118, 210, 0.1));
      transition: all 0.2s ease;
    }

    .play-btn:hover {
      background: var(--primary-color, #1976d2);
      color: white;
      transform: scale(1.05);
    }

    .more-btn {
      color: var(--on-surface-variant, #666);
      opacity: 0.7;
      transition: opacity 0.2s ease;
    }

    .more-btn:hover {
      opacity: 1;
    }

    .song-actions-menu {
      max-width: 250px;
    }

    .song-actions-menu button {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      min-height: 48px;
      padding: 0 16px;
    }

    .song-actions-menu mat-icon {
      color: var(--on-surface-variant, #666);
      margin-right: 0;
    }

    /* Responsive behavior */
    @media (max-width: 768px) {
      .song-actions {
        gap: 0.125rem;
      }

      .play-btn,
      .more-btn {
        width: 36px;
        height: 36px;
      }

      .play-btn mat-icon,
      .more-btn mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
      }
    }

    /* Dark mode support */
    :host-context(.dark-theme) .play-btn {
      background: var(--primary-container-dark, rgba(129, 199, 255, 0.1));
    }

    :host-context(.dark-theme) .more-btn {
      color: var(--on-surface-variant-dark, #b3b3b3);
    }

    :host-context(.dark-theme) .song-actions-menu mat-icon {
      color: var(--on-surface-variant-dark, #b3b3b3);
    }
  `]
})
export class SongActionButtonComponent {
  @Input({ required: true }) song!: Song;
  @Input() showQuickPlay: boolean = true;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';

  private readonly playerUseCase = inject(PlayerUseCase);
  private readonly playSongUseCase = inject(PlaySongUseCase); // ← AGREGADO
  private readonly dialog = inject(MatDialog);

  isCurrentSongPlaying(): boolean {
    const currentState = this.playerUseCase.getCurrentPlayerState();
    return currentState.currentSong?.id === this.song.id && currentState.isPlaying;
  }

  playSong() {
    const currentState = this.playerUseCase.getCurrentPlayerState();
    
    // Si es la misma canción, toggle play/pause
    if (currentState.currentSong?.id === this.song.id) {
      this.playerUseCase.togglePlayPause();
      console.log('Toggled play/pause for current song:', this.song.title);
    } else {
      // ✅ CORREGIDO: Usar PlaySongUseCase en lugar de llamada directa para evitar duplicación
      console.log('🎵 Usando PlaySongUseCase.executeSimple() para evitar audios duplicados');
      this.playSongUseCase.executeSimple(this.song.id).subscribe({
        next: (song) => {
          console.log('✅ Song started playing through proper flow:', song.title);
        },
        error: (error) => {
          console.error('❌ Error playing song:', error);
        }
      });
    }
  }

  playNext() {
    console.log('Play next:', this.song.title);
  }

  addToQueue() {
    console.log('Add to queue:', this.song.title);
  }

  addToPlaylist() {
    const dialogRef = this.dialog.open(AddSongToPlaylistDialogComponent, {
      data: { song: this.song },
      width: '500px',
      maxWidth: '90vw',
      disableClose: false,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.success) {
        console.log(`Song added to playlist: ${result.playlist.name}`);
      }
    });
  }

  addToFavorites() {
    console.log('Add to favorites:', this.song.title);
  }

  shareSong() {
    if (navigator.share) {
      navigator.share({
        title: this.song.title,
        text: `Escucha "${this.song.title}" de ${this.song.artist_name}`,
        url: window.location.href
      }).catch(err => console.log('Error sharing:', err));
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        console.log('Link copied to clipboard');
      });
    }
  }

  viewInfo() {
    console.log('View info for:', this.song.title);
  }
}
