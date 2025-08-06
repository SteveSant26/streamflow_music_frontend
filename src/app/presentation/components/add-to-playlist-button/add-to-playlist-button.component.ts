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
  templateUrl: './add-to-playlist-button.component.html',
  styleUrl: './add-to-playlist-button.component.css'
})
export class AddToPlaylistButtonComponent {
  @Input() song: Song | null = null;
  @Input() compact = false;

  private readonly playlistService = inject(PlaylistService);

  addToPlaylist(): void {
    if (!this.song) return;

    this.playlistService.addToPlaylist(this.song);
    console.log(`Agregado a la playlist: ${this.song.title}`);
    
    // Opcional: Mostrar feedback visual
    // TODO: Agregar un snackbar o toast para confirmar la acción
  }
}
