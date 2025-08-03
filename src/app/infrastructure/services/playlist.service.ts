import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Song, Playlist, PlaylistItem, PlaybackState } from '../../domain/entities/song.entity';

@Injectable({ providedIn: 'root' })
export class PlaylistService {
  // Signals para el estado reactivo
  private readonly currentPlaylist = signal<Playlist | null>(null);
  private readonly playbackState = signal<PlaybackState>({
    currentSong: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    isMuted: false,
    hasPlayedFirstQuarter: false
  });

  // Subjects para comunicación entre componentes
  private readonly playbackStateSubject = new BehaviorSubject<PlaybackState>(this.playbackState());
  private readonly currentPlaylistSubject = new BehaviorSubject<Playlist | null>(null);

  // Observables públicos
  readonly playbackState$ = this.playbackStateSubject.asObservable();
  readonly currentPlaylist$ = this.currentPlaylistSubject.asObservable();

  /**
   * Crear nueva playlist desde lista de canciones
   */
  createPlaylist(songs: Song[], name: string = 'Queue', startIndex: number = 0): void {
    const items: PlaylistItem[] = songs.map((song, index) => ({
      ...song,
      position: index,
      addedAt: new Date()
    }));

    const playlist: Playlist = {
      id: `playlist_${Date.now()}`,
      name,
      items,
      currentIndex: startIndex,
      isShuffled: false,
      repeatMode: 'none'
    };

    this.currentPlaylist.set(playlist);
    this.currentPlaylistSubject.next(playlist);

    // Auto-seleccionar la primera canción
    if (items.length > 0) {
      this.selectSong(startIndex);
    }
  }

  /**
   * Agregar canción a la playlist actual
   */
  addToPlaylist(song: Song): void {
    const playlist = this.currentPlaylist();
    if (!playlist) {
      this.createPlaylist([song], 'Queue', 0);
      return;
    }

    const newItem: PlaylistItem = {
      ...song,
      position: playlist.items.length,
      addedAt: new Date()
    };

    const updatedPlaylist = {
      ...playlist,
      items: [...playlist.items, newItem]
    };

    this.currentPlaylist.set(updatedPlaylist);
    this.currentPlaylistSubject.next(updatedPlaylist);
  }

  /**
   * Seleccionar canción por índice
   */
  selectSong(index: number): void {
    const playlist = this.currentPlaylist();
    if (!playlist || index < 0 || index >= playlist.items.length) return;

    const song = playlist.items[index];
    const updatedPlaylist = { ...playlist, currentIndex: index };
    
    this.currentPlaylist.set(updatedPlaylist);
    this.currentPlaylistSubject.next(updatedPlaylist);

    const newState: PlaybackState = {
      ...this.playbackState(),
      currentSong: song,
      hasPlayedFirstQuarter: false
    };

    this.playbackState.set(newState);
    this.playbackStateSubject.next(newState);
  }

  /**
   * Reproducir/pausar
   */
  togglePlayback(): void {
    const state = this.playbackState();
    const newState = {
      ...state,
      isPlaying: !state.isPlaying
    };

    this.playbackState.set(newState);
    this.playbackStateSubject.next(newState);
  }

  /**
   * Siguiente canción
   */
  nextSong(): void {
    const playlist = this.currentPlaylist();
    if (!playlist) return;

    let nextIndex = playlist.currentIndex + 1;

    // Manejar repeat mode
    if (nextIndex >= playlist.items.length) {
      if (playlist.repeatMode === 'all') {
        nextIndex = 0;
      } else {
        return; // No hay siguiente canción
      }
    }

    this.selectSong(nextIndex);
  }

  /**
   * Canción anterior
   */
  previousSong(): void {
    const playlist = this.currentPlaylist();
    if (!playlist) return;

    let prevIndex = playlist.currentIndex - 1;

    // Manejar repeat mode
    if (prevIndex < 0) {
      if (playlist.repeatMode === 'all') {
        prevIndex = playlist.items.length - 1;
      } else {
        return; // No hay canción anterior
      }
    }

    this.selectSong(prevIndex);
  }

  /**
   * Actualizar tiempo de reproducción
   */
  updatePlaybackTime(currentTime: number, duration: number): void {
    const state = this.playbackState();
    const newState = {
      ...state,
      currentTime,
      duration
    };

    this.playbackState.set(newState);
    this.playbackStateSubject.next(newState);
  }

  /**
   * Marcar que se reprodujo el primer 25%
   */
  markFirstQuarterPlayed(): void {
    const state = this.playbackState();
    if (!state.hasPlayedFirstQuarter) {
      const newState = {
        ...state,
        hasPlayedFirstQuarter: true
      };

      this.playbackState.set(newState);
      this.playbackStateSubject.next(newState);
    }
  }

  /**
   * Cambiar modo de repetición
   */
  toggleRepeatMode(): void {
    const playlist = this.currentPlaylist();
    if (!playlist) return;

    const modes: Array<'none' | 'one' | 'all'> = ['none', 'one', 'all'];
    const currentIndex = modes.indexOf(playlist.repeatMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];

    const updatedPlaylist = {
      ...playlist,
      repeatMode: nextMode
    };

    this.currentPlaylist.set(updatedPlaylist);
    this.currentPlaylistSubject.next(updatedPlaylist);
  }

  /**
   * Activar/desactivar shuffle
   */
  toggleShuffle(): void {
    const playlist = this.currentPlaylist();
    if (!playlist) return;

    const updatedPlaylist = {
      ...playlist,
      isShuffled: !playlist.isShuffled
    };

    this.currentPlaylist.set(updatedPlaylist);
    this.currentPlaylistSubject.next(updatedPlaylist);
  }

  /**
   * Obtener estado actual
   */
  getCurrentState(): PlaybackState {
    return this.playbackState();
  }

  /**
   * Obtener playlist actual
   */
  getCurrentPlaylist(): Playlist | null {
    return this.currentPlaylist();
  }

  /**
   * Limpiar playlist
   */
  clearPlaylist(): void {
    this.currentPlaylist.set(null);
    this.currentPlaylistSubject.next(null);
    
    const newState: PlaybackState = {
      currentSong: null,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      volume: 1,
      isMuted: false,
      hasPlayedFirstQuarter: false
    };

    this.playbackState.set(newState);
    this.playbackStateSubject.next(newState);
  }
}
