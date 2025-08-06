import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { ROUTES_CONFIG_MUSIC } from '@app/config/routes-config';

import { LegacyPlaylist, PlaylistWithSongs } from '@app/domain/entities/playlist.entity';
import { Song } from '@app/domain/entities/song.entity';
import { GetPlaylistByIdUseCase } from '@app/domain/usecases/playlist/playlist.usecases';
import { PlaylistService } from '@app/infrastructure/services/playlist.service';

@Component({
  selector: 'app-playlist',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    TranslateModule
  ],
  templateUrl: './playlist.html',
  styleUrls: ['./playlist.css'],
})
export class PlaylistComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly getPlaylistUseCase = inject(GetPlaylistByIdUseCase);
  private readonly playlistService = inject(PlaylistService);

  // Signals para estado reactivo
  readonly playlist = signal<LegacyPlaylist | null>(null);
  readonly loading = signal<boolean>(true);
  readonly error = signal<string | null>(null);

  playlistId: string | null = null;

  ngOnInit() {
    this.playlistId = this.route.snapshot.paramMap.get('id');
    if (this.playlistId) {
      this.loadPlaylist();
    } else {
      this.error.set('ID de playlist no válido');
      this.loading.set(false);
    }
  }

  private loadPlaylist() {
    if (!this.playlistId) return;

    this.loading.set(true);
    this.error.set(null);

    this.getPlaylistUseCase.execute(this.playlistId).subscribe({
      next: (playlist) => {
        const legacyPlaylist = this.convertToLegacyPlaylist(playlist);
        this.playlist.set(legacyPlaylist);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando playlist:', err);
        this.error.set('Error cargando la playlist');
        this.loading.set(false);
        // Cargar datos de prueba si no hay backend
        this.loadMockData();
      }
    });
  }

  private convertToLegacyPlaylist(playlist: PlaylistWithSongs): LegacyPlaylist {
    const songs: Song[] = playlist.songs.map(playlistSong => ({
      id: playlistSong.id,
      title: playlistSong.title,
      artist_name: playlistSong.artist_name || 'Artista Desconocido',
      album_name: playlistSong.album_name || 'Album Desconocido',
      duration_seconds: playlistSong.duration_seconds,
      thumbnail_url: playlistSong.thumbnail_url,
      youtube_url: '', // No disponible en PlaylistSong
      file_url: '', // No disponible en PlaylistSong
      play_count: 0 // Default value
    }));

    const totalDuration = songs.reduce((acc, song) => acc + (song.duration_seconds || 0), 0);

    return {
      id: playlist.id,
      name: playlist.name,
      description: playlist.description,
      coverImage: `https://picsum.photos/300/300?random=${playlist.id}`,
      isPublic: playlist.is_public,
      createdDate: playlist.created_at,
      songs: songs,
      songCount: playlist.total_songs,
      duration: totalDuration,
      owner: {
        id: playlist.user_id,
        username: 'Usuario' // Placeholder ya que no tenemos información del usuario
      }
    };
  }

  private loadMockData() {
    // Datos de prueba mientras no hay backend funcionando
    const mockPlaylist: LegacyPlaylist = {
      id: this.playlistId || '1',
      name: `Mi Playlist #${this.playlistId}`,
      description: 'Una colección especial de tus canciones favoritas',
      coverImage: `https://picsum.photos/300/300?random=${this.playlistId}`,
      isPublic: true,
      createdDate: new Date().toISOString(),
      songCount: 12,
      duration: 2850, // 47.5 minutos en segundos
      owner: {
        id: 'user1',
        username: 'StreamFlow Music'
      },
      songs: this.generateMockSongs()
    };

    this.playlist.set(mockPlaylist);
    this.loading.set(false);
    this.error.set(null);
  }

  private generateMockSongs(): Song[] {
    const mockSongs: Song[] = [];
    const artists = ['Arctic Monkeys', 'The Strokes', 'Tame Impala', 'Gorillaz', 'Radiohead'];
    const titles = [
      'Do I Wanna Know?', 'Last Nite', 'The Less I Know The Better', 
      'Feel Good Inc.', 'Creep', 'R U Mine?', 'Someday', 'Elephant',
      'DARE', 'Paranoid Android', 'Fluorescent Adolescent', 'Hard to Explain'
    ];

    for (let i = 0; i < 12; i++) {
      mockSongs.push({
        id: `song_${i + 1}`,
        title: titles[i],
        artist_id: `artist_${i % artists.length}`,
        artist_name: artists[i % artists.length],
        album_id: `album_${i + 1}`,
        album_name: `Album ${i + 1}`,
        duration_formatted: `${Math.floor(Math.random() * 3) + 2}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
        duration_seconds: Math.floor(Math.random() * 180) + 120, // 2-5 minutos
        file_url: `https://example.com/song_${i + 1}.mp3`,
        thumbnail_url: `https://picsum.photos/64/64?random=${i + 1}`,
        youtube_url: `https://youtube.com/watch?v=${i + 1}`,
        genre_names_display: 'Rock',
        play_count: Math.floor(Math.random() * 1000000),
        youtube_view_count: Math.floor(Math.random() * 5000000),
        youtube_like_count: Math.floor(Math.random() * 100000),
        is_explicit: false,
        audio_downloaded: true,
        created_at: new Date(2020 + Math.floor(Math.random() * 4), 0, 1),
        published_at: new Date(2020 + Math.floor(Math.random() * 4), 0, 1)
      });
    }

    return mockSongs;
  }

  formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes} min`;
  }

  formatSongDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  playPlaylist() {
    const currentPlaylist = this.playlist();
    if (currentPlaylist && currentPlaylist.songs.length > 0) {
      // Crear playlist de reproducción con las canciones
      this.playlistService.createPlaylist(currentPlaylist.songs, currentPlaylist.name);
      console.log('Reproduciendo playlist:', currentPlaylist.name);
    }
  }

  playSong(song: Song, index: number) {
    const currentPlaylist = this.playlist();
    if (currentPlaylist) {
      // Crear playlist de reproducción y empezar desde la canción seleccionada
      this.playlistService.createPlaylist(currentPlaylist.songs, currentPlaylist.name, index);
      console.log('Reproduciendo canción:', song.title);
    }
  }

  addToQueue(song: Song) {
    this.playlistService.addSongToCurrentPlaylist(song);
    console.log('Agregado a la cola:', song.title);
  }

  getPlaylistImage(): string {
    const currentPlaylist = this.playlist();
    return currentPlaylist?.coverImage || `https://picsum.photos/300/300?random=${this.playlistId || 1}`;
  }

  getContainerClass(): string {
    switch (this.playlistId) {
      case '1':
        return 'playlist-container playlist-purple';
      case '2':
        return 'playlist-container playlist-blue';
      case '3':
        return 'playlist-container playlist-red';
      default:
        return 'playlist-container playlist-purple';
    }
  }

  goBack() {
    this.router.navigate([ROUTES_CONFIG_MUSIC.LIBRARY.path]);
  }
}
