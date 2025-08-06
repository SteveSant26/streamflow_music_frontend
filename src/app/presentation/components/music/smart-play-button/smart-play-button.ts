import { Component, Input, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { PlaylistService } from '@app/infrastructure/services/playlist.service';
import { Song } from '@app/domain/entities/song.entity';

@Component({
  selector: 'app-smart-play-button',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, CommonModule],
  templateUrl: './smart-play-button.html',
  styleUrl: './smart-play-button.css'
})
export class SmartPlayButtonComponent {
  @Input() song!: Song;
  @Input() context: 'search' | 'random' | 'popular' | 'album' | 'artist' | 'single' = 'single';
  @Input() contextSongs: Song[] = []; // Lista de canciones del contexto actual
  @Input() startIndex: number = 0; // Índice de la canción en el contexto
  
  private readonly playlistService = inject(PlaylistService);

  playSmartly(): void {
    if (!this.song) return;

    console.log(`🎵 Smart Play: ${this.song.title} en contexto "${this.context}"`);

    if (this.contextSongs.length > 1) {
      // Si hay un contexto con múltiples canciones, crear playlist con ese contexto
      this.playlistService.createPlaylist(
        this.contextSongs, 
        this.getPlaylistName(), 
        this.startIndex
      );
      this.playlistService.setPlaylistType(this.getPlaylistType());
      this.playlistService.setPlaylistContext(this.context);
    } else {
      // Si es una canción individual, usar playSingleSong para agregar canciones random
      this.playlistService.playSingleSong(this.song);
    }
  }

  private getPlaylistName(): string {
    switch (this.context) {
      case 'search':
        return 'Resultados de Búsqueda';
      case 'random':
        return 'Canciones Aleatorias';
      case 'popular':
        return 'Más Populares';
      case 'album':
        return this.song.album?.title || 'Álbum';
      case 'artist':
        return `Canciones de ${this.song.artist_name || 'Artista'}`;
      default:
        return 'Lista de Reproducción';
    }
  }

  private getPlaylistType(): 'circular' | 'expandable' | 'single' {
    switch (this.context) {
      case 'search':
      case 'random':
      case 'popular':
        return 'expandable'; // Pueden cargar más contenido
      case 'album':
      case 'artist':
        return 'circular'; // Lista fija que se repite
      default:
        return 'single';
    }
  }
}
