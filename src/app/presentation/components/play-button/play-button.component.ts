import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Song } from '@app/domain/entities/song.entity';
import { PlaylistService } from '@app/infrastructure/services/playlist.service';
import { PlaySongUseCase } from '@app/domain/usecases/song/song.usecases';

@Component({
  selector: 'app-play-button',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  template: `
    <button 
      mat-icon-button
      (click)="togglePlay()"
      [disabled]="!song"
      [matTooltip]="isCurrentSongPlaying() ? 'Pausar' : 'Reproducir'"
      class="play-btn"
      [class.playing]="isCurrentSongPlaying()"
      [class.compact]="compact"
    >
      <mat-icon>{{ isCurrentSongPlaying() ? 'pause' : 'play_arrow' }}</mat-icon>
    </button>
  `,
  styles: [`
    .play-btn {
      color: var(--primary-color, #1976d2);
      transition: all 0.2s ease;
    }

    .play-btn:hover {
      background-color: rgba(25, 118, 210, 0.1);
      transform: scale(1.05);
    }

    .play-btn.playing {
      color: var(--accent-color, #ff4081);
    }

    .play-btn:disabled {
      color: rgba(0, 0, 0, 0.26);
      cursor: not-allowed;
    }

    .play-btn.compact {
      width: 32px;
      height: 32px;
      min-width: 32px;
    }
  `]
})
export class PlayButtonComponent {
  @Input() song: Song | null = null;
  @Input() compact: boolean = false;

  private readonly playlistService = inject(PlaylistService);
  private readonly playSongUseCase = inject(PlaySongUseCase);

  togglePlay(): void {
    if (!this.song) return;

    const state = this.playlistService.getCurrentState();
    
    if (state.currentSong?.id === this.song.id) {
      // Si es la misma canción, toggle play/pause
      this.playlistService.togglePlayback();
    } else {
      // Si es una canción diferente, reproducirla
      this.playSongUseCase.execute(this.song.id, true).subscribe({
        next: (song) => {
          console.log(`Reproduciendo: ${song.title}`);
          // Crear una nueva playlist con esta canción
          this.playlistService.createPlaylist([song], 'Current Song', 0);
          // Iniciar reproducción
          this.playlistService.togglePlayback();
        },
        error: (error) => {
          console.error('Error al reproducir canción:', error);
        }
      });
    }
  }

  isCurrentSongPlaying(): boolean {
    if (!this.song) return false;
    
    const state = this.playlistService.getCurrentState();
    return state.currentSong?.id === this.song.id && state.isPlaying;
  }
}
