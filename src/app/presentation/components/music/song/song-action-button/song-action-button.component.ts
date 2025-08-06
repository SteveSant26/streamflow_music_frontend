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
import { PlaySongUseCase } from '../../../../../domain/usecases/song/song.usecases';
import { PlaylistService } from '../../../../../infrastructure/services/playlist.service';
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
  templateUrl: './song-action-button.component.html',
  styleUrl: './song-action-button.component.css'
})
export class SongActionButtonComponent {
  @Input({ required: true }) song!: Song;
  @Input() showQuickPlay = true;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';

  private readonly playerUseCase = inject(PlayerUseCase);
  private readonly playSongUseCase = inject(PlaySongUseCase);
  private readonly playlistService = inject(PlaylistService);
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
    try {
      // Agregar la canción a la playlist actual
      this.playlistService.addSongToCurrentPlaylist(this.song);
      
      // Obtener la playlist actual
      const currentPlaylist = this.playlistService.getCurrentPlaylist();
      if (currentPlaylist) {
        // Encontrar el índice de la canción que acabamos de agregar
        const songIndex = currentPlaylist.items.findIndex(item => item.id === this.song.id);
        if (songIndex > -1) {
          // Mover la canción para que sea la siguiente
          const currentIndex = currentPlaylist.currentIndex;
          const nextPosition = currentIndex + 1;
          
          if (songIndex !== nextPosition && nextPosition < currentPlaylist.items.length) {
            // Reordenar para poner la canción como siguiente
            this.reorderSongToPosition(songIndex, nextPosition);
          }
        }
      }
      
      console.log('✅ Canción configurada para reproducir siguiente:', this.song.title);
    } catch (error) {
      console.error('❌ Error configurando canción como siguiente:', error);
    }
  }

  private reorderSongToPosition(fromIndex: number, toIndex: number): void {
    const currentPlaylist = this.playlistService.getCurrentPlaylist();
    if (!currentPlaylist) return;

    const items = [...currentPlaylist.items];
    const [movedItem] = items.splice(fromIndex, 1);
    items.splice(toIndex, 0, movedItem);

    // Aquí podrías llamar a un método del PlaylistService para actualizar el orden
    // Por simplicidad, solo logueamos la acción
    console.log(`Reordenando canción de posición ${fromIndex} a ${toIndex}`);
    console.log('Items reordenados:', items.map(item => item.title));
  }

  addToQueue() {
    try {
      this.playlistService.addSongToCurrentPlaylist(this.song);
      console.log('✅ Canción agregada a la cola:', this.song.title);
      
      // Opcional: Mostrar algún feedback visual al usuario
      // Podrías usar un snackbar o toast aquí
    } catch (error) {
      console.error('❌ Error agregando canción a la cola:', error);
    }
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
