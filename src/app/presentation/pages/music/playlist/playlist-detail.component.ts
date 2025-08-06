import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { 
  GetPlaylistByIdUseCase,
  RemoveSongFromPlaylistUseCase
} from '../../../../domain/usecases/playlist/playlist.usecases';
import { PlaylistWithSongs, PlaylistSong } from '../../../../domain/entities/playlist.entity';
import { Song } from '../../../../domain/entities/song.entity';
import { AudioPlayerService } from '../../../../infrastructure/services/audio-player.service';
import { PlaylistService } from '../../../../infrastructure/services/playlist.service';

@Component({
  selector: 'app-playlist-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatTooltipModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './playlist-detail.component.html',
  styleUrl: './playlist-detail.component.css'
})
export class PlaylistDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly getPlaylistByIdUseCase = inject(GetPlaylistByIdUseCase);
  private readonly removeSongFromPlaylistUseCase = inject(RemoveSongFromPlaylistUseCase);
  private readonly audioPlayerService = inject(AudioPlayerService);
  private readonly playlistService = inject(PlaylistService);

  playlist = signal<PlaylistWithSongs | null>(null);
  loading = signal(false);
  removingTask = signal<string | null>(null); // Para mostrar loading específico por canción
  
  displayedColumns: string[] = ['position', 'title', 'album', 'duration', 'added_at', 'actions'];

  ngOnInit() {
    this.route.params.subscribe(params => {
      const playlistId = params['id'];
      if (playlistId) {
        this.loadPlaylist(playlistId);
      }
    });
  }

  private loadPlaylist(id: string) {
    this.loading.set(true);
    this.getPlaylistByIdUseCase.execute(id).subscribe({
      next: (playlist) => {
        this.playlist.set(playlist);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading playlist:', error);
        this.loading.set(false);
      }
    });
  }

  formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  playAllSongs() {
    const playlist = this.playlist();
    if (playlist && playlist.songs.length > 0) {
      // Convertir PlaylistSong[] a Song[] para el reproductor
      const songs: Song[] = playlist.songs.map(song => ({
        id: song.id,
        title: song.title,
        artist_name: song.artist_name,
        album_name: song.album_name,
        duration_seconds: song.duration_seconds,
        thumbnail_url: song.thumbnail_url,
        play_count: 0
      }));
      
      // Crear playlist en el reproductor
      this.playlistService.createPlaylist(songs, playlist.name, 0);
      console.log(`Reproduciendo ${songs.length} canciones de "${playlist.name}"`);
    }
  }

  playSong(song: PlaylistSong) {
    const playlist = this.playlist();
    if (playlist) {
      const songIndex = playlist.songs.findIndex(s => s.id === song.id);
      
      // Convertir PlaylistSong[] a Song[]
      const songs: Song[] = playlist.songs.map(s => ({
        id: s.id,
        title: s.title,
        artist_name: s.artist_name,
        album_name: s.album_name,
        duration_seconds: s.duration_seconds,
        thumbnail_url: s.thumbnail_url,
        play_count: 0
      }));
      
      this.playlistService.createPlaylist(songs, playlist.name, songIndex);
      console.log(`Reproduciendo "${song.title}" desde la playlist`);
    }
  }

  removeSong(song: PlaylistSong) {
    const playlist = this.playlist();
    if (!playlist) return;

    const confirmMessage = `¿Estás seguro de que quieres eliminar "${song.title}" de la playlist "${playlist.name}"?`;
    
    if (confirm(confirmMessage)) {
      this.removingTask.set(song.id); // Indicar que esta canción se está eliminando
      
      this.removeSongFromPlaylistUseCase.execute(playlist.id, song.id).subscribe({
        next: () => {
          console.log(`Canción "${song.title}" eliminada de la playlist`);
          this.removingTask.set(null);
          // Recargar la playlist para mostrar los cambios
          this.loadPlaylist(playlist.id);
        },
        error: (error) => {
          console.error('Error removing song:', error);
          this.removingTask.set(null);
          alert('Error al eliminar la canción. Por favor, inténtalo de nuevo.');
        }
      });
    }
  }
}
