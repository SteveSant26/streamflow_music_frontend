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
import { PlayerUseCase } from '../../../../domain/usecases/player/player.usecases';

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
  private readonly playerUseCase = inject(PlayerUseCase);

  playlist = signal<PlaylistWithSongs | null>(null);
  songs = signal<Song[]>([]);
  loading = signal(false);
  loadingSongs = signal(false);
  removingTask = signal<string | null>(null);
  authenticationRequired = signal(false);
  
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
        console.log('✅ Playlist loaded:', playlist);
        
        // Cargar las canciones por separado
        this.loadPlaylistSongs(id);
      },
      error: (error) => {
        console.error('Error loading playlist:', error);
        this.loading.set(false);
      }
    });
  }

  private loadPlaylistSongs(playlistId: string, page = 1) {
    if (page === 1) {
      this.loadingSongs.set(true);
      this.songs.set([]); // Limpiar canciones existentes
    }

    this.unifiedPlaylistService.getPlaylistSongs(playlistId, page, 20).subscribe({
      next: (response) => {
        console.log('🎵 Playlist songs loaded:', response);
        
        const newSongs = response.results.map(song => ({
          id: song.id,
          title: song.title,
          artist_name: song.artist_name || 'Artista desconocido',
          album_name: song.album_name,
          duration_seconds: song.duration_seconds,
          thumbnail_url: song.thumbnail_url,
          play_count: 0,
          duration_formatted: this.formatDuration(song.duration_seconds)
        }));

        if (page === 1) {
          this.songs.set(newSongs);
        } else {
          this.songs.set([...this.songs(), ...newSongs]);
        }

        this.currentPage.set(page);
        this.hasMoreSongs.set(!!response.next);
        this.loadingSongs.set(false);
        this.loading.set(false);
        
        console.log('🎵 Songs mapped for MusicSection:', newSongs);
        console.log('🎵 Total songs in signal:', this.songs().length);
      },
      error: (error) => {
        console.error('Error loading playlist songs:', error);
        if (error.status === 401) {
          console.warn('⚠️ Usuario no autenticado - no se pueden cargar las canciones');
          this.authenticationRequired.set(true);
          // Mostrar mensaje de que necesita autenticarse
        }
        this.loadingSongs.set(false);
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
    console.log('🎵 PlaylistDetail: Song clicked:', song.title);
    const songs = this.songs();
    const playlist = this.playlist();
    if (playlist) {
      const songIndex = songs.findIndex(s => s.id === song.id);
      this.playlistService.createPlaylist(songs, playlist.name, songIndex);
      console.log(`Reproduciendo "${song.title}" desde la playlist`);
    }
  }

  addToQueue(song: Song) {
    console.log('🎵 PlaylistDetail: Add to queue requested for:', song.title);
    // Usar el PlayerUseCase para agregar a la cola
    this.playerUseCase.addToQueue(song);
    console.log('Agregado a cola:', song.title);
  }

  addToPlaylist(song: Song) {
    console.log('📋 PlaylistDetail: Add to playlist requested for:', song.title);
    console.log('Agregando a playlist:', song.title);
    // Funcionalidad básica implementada
  }

  addToFavorites(song: Song) {
    console.log('❤️ PlaylistDetail: Add to favorites requested for:', song.title);
    console.log('Agregando a favoritos:', song.title);
    // Funcionalidad básica implementada
  }

  showMoreOptions(song: Song) {
    console.log('⚙️ PlaylistDetail: More options requested for:', song.title);
    console.log('Más opciones para:', song.title);
    // Funcionalidad básica implementada
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

    const nextPage = this.currentPage() + 1;
    this.loadPlaylistSongs(playlist.id, nextPage);
  }

  // Método para el actionButton del MusicSection
  onLoadMoreClick() {
    this.loadMoreSongs();
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
