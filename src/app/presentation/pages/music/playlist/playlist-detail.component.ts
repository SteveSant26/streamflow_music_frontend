import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MusicSectionComponent } from '../../../components/music-section/music-section';
import { UnifiedPlaylistService } from '../../../../infrastructure/services/unified-playlist.service';
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
    MatProgressSpinnerModule,
    MusicSectionComponent
  ],
  templateUrl: './playlist-detail.component.html',
  styleUrl: './playlist-detail.component.css'
})
export class PlaylistDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly unifiedPlaylistService = inject(UnifiedPlaylistService);
  private readonly audioPlayerService = inject(AudioPlayerService);
  private readonly playlistService = inject(PlaylistService);

  playlist = signal<PlaylistWithSongs | null>(null);
  songs = signal<Song[]>([]);
  loading = signal(false);
  loadingSongs = signal(false);
  removingTask = signal<string | null>(null);
  
  // Para scroll infinito
  currentPage = signal(1);
  hasMoreSongs = signal(true);
  
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
    this.unifiedPlaylistService.getPlaylistById(id).subscribe({
      next: (playlist) => {
        this.playlist.set(playlist);
        this.convertPlaylistSongsToSongs(playlist.songs);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading playlist:', error);
        this.loading.set(false);
      }
    });
  }

  private convertPlaylistSongsToSongs(playlistSongs: PlaylistSong[]): void {
    const songs: Song[] = playlistSongs.map(song => ({
      id: song.id,
      title: song.title,
      artist_name: song.artist_name || 'Artista desconocido',
      album_name: song.album_name,
      duration_seconds: song.duration_seconds,
      thumbnail_url: song.thumbnail_url,
      play_count: 0,
      duration_formatted: this.formatDuration(song.duration_seconds)
    }));
    this.songs.set(songs);
  }

  formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  // ====================== PLAYER ACTIONS ======================

  playAllSongs() {
    const songs = this.songs();
    const playlist = this.playlist();
    if (playlist && songs.length > 0) {
      this.playlistService.createPlaylist(songs, playlist.name, 0);
      console.log(`Reproduciendo ${songs.length} canciones de "${playlist.name}"`);
    }
  }

  onSongClick(song: Song) {
    const songs = this.songs();
    const playlist = this.playlist();
    if (playlist) {
      const songIndex = songs.findIndex(s => s.id === song.id);
      this.playlistService.createPlaylist(songs, playlist.name, songIndex);
      console.log(`Reproduciendo "${song.title}" desde la playlist`);
    }
  }

  addToQueue(song: Song) {
    // TODO: Implementar agregar a cola
    console.log('Agregando a cola:', song.title);
  }

  addToPlaylist(song: Song) {
    // TODO: Implementar agregar a otra playlist
    console.log('Agregando a playlist:', song.title);
  }

  addToFavorites(song: Song) {
    // TODO: Implementar agregar a favoritos
    console.log('Agregando a favoritos:', song.title);
  }

  showMoreOptions(song: Song) {
    // TODO: Implementar más opciones
    console.log('Más opciones para:', song.title);
  }

  // ====================== PLAYLIST MANAGEMENT ======================

  removeSong(song: Song) {
    const playlist = this.playlist();
    if (!playlist) return;

    const confirmMessage = `¿Estás seguro de que quieres eliminar "${song.title}" de la playlist "${playlist.name}"?`;
    
    if (confirm(confirmMessage)) {
      this.removingTask.set(song.id);
      
      this.unifiedPlaylistService.removeSongFromPlaylist(playlist.id, song.id).subscribe({
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

  // ====================== SCROLL INFINITO ======================

  loadMoreSongs() {
    const playlist = this.playlist();
    if (!playlist || !this.hasMoreSongs() || this.loadingSongs()) return;

    this.loadingSongs.set(true);
    const nextPage = this.currentPage() + 1;

    this.unifiedPlaylistService.getPlaylistSongs(playlist.id, nextPage, 20).subscribe({
      next: (response) => {
        const currentSongs = this.songs();
        const newPlaylistSongs = response.results;
        const newSongs = newPlaylistSongs.map(song => ({
          id: song.id,
          title: song.title,
          artist_name: song.artist_name || 'Artista desconocido',
          album_name: song.album_name,
          duration_seconds: song.duration_seconds,
          thumbnail_url: song.thumbnail_url,
          play_count: 0,
          duration_formatted: this.formatDuration(song.duration_seconds)
        }));

        this.songs.set([...currentSongs, ...newSongs]);
        this.currentPage.set(nextPage);
        this.hasMoreSongs.set(!!response.next);
        this.loadingSongs.set(false);
      },
      error: (error) => {
        console.error('Error loading more songs:', error);
        this.loadingSongs.set(false);
      }
    });
  }

  formatPlayCount(count: number): string {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  }
}
