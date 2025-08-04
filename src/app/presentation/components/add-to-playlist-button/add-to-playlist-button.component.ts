import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Song } from '@app/domain/entities/song.entity';
import { PlaylistService } from '@app/infrastructure/services/playlist.service';

@Component({
  selector: 'app-add-to-playlist-button',
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
      (click)="addToPlaylist()"
      [disabled]="!song"
      matTooltip="Agregar a playlist"
      class="add-to-playlist-btn"
      [class.compact]="compact"
    >
      <mat-icon>{{ compact ? 'playlist_add' : 'add' }}</mat-icon>
    </button>
  `,
  styles: [`
    .add-to-playlist-btn {
      color: var(--primary-color, #1976d2);
      transition: all 0.2s ease;
    }

    .add-to-playlist-btn:hover {
      background-color: rgba(25, 118, 210, 0.1);
      transform: scale(1.05);
    }

    .add-to-playlist-btn:disabled {
      color: rgba(0, 0, 0, 0.26);
      cursor: not-allowed;
    }

    .add-to-playlist-btn.compact {
      width: 32px;
      height: 32px;
      min-width: 32px;
    }
  `]
})
export class AddToPlaylistButtonComponent {
  @Input() song: Song | null = null;
  @Input() compact: boolean = false;

  private readonly playlistService = inject(PlaylistService);

  addToPlaylist(): void {
    if (!this.song) return;

    this.playlistService.addToPlaylist(this.song);
    console.log(`Agregado a la playlist: ${this.song.title}`);
    
    // Opcional: Mostrar feedback visual
    // TODO: Agregar un snackbar o toast para confirmar la acción
  }
}
