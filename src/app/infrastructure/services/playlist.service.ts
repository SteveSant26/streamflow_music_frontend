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
   * Crear nueva playlist desde lista de canciones con contexto inteligente
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
      repeatMode: 'none',
      type: 'single', // Default, se puede cambiar con setPlaylistType
      contextType: 'single',
      canLoadMore: false,
      currentPage: 1
    };

    this.currentPlaylist.set(playlist);
    this.currentPlaylistSubject.next(playlist);

    // Auto-seleccionar la canción especificada
    if (items.length > 0 && startIndex >= 0 && startIndex < items.length) {
      this.selectSong(startIndex);
    }
  }

  /**
   * Establecer el tipo de playlist para comportamiento inteligente
   */
  setPlaylistType(type: 'circular' | 'expandable' | 'single'): void {
    const playlist = this.currentPlaylist();
    if (!playlist) return;

    const updatedPlaylist = {
      ...playlist,
      type
    };

    this.currentPlaylist.set(updatedPlaylist);
    this.currentPlaylistSubject.next(updatedPlaylist);
  }

  /**
   * Establecer el contexto de la playlist
   */
  setPlaylistContext(contextType: 'user_playlist' | 'album' | 'artist' | 'search' | 'random' | 'popular' | 'single', additionalData?: any): void {
    const playlist = this.currentPlaylist();
    if (!playlist) return;

    const updatedPlaylist = {
      ...playlist,
      contextType,
      ...additionalData
    };

    this.currentPlaylist.set(updatedPlaylist);
    this.currentPlaylistSubject.next(updatedPlaylist);
  }

  /**
   * Establecer query de búsqueda para playlists expandibles
   */
  setSearchQuery(query: string): void {
    const playlist = this.currentPlaylist();
    if (!playlist) return;

    const updatedPlaylist = {
      ...playlist,
      searchQuery: query,
      canLoadMore: true
    };

    this.currentPlaylist.set(updatedPlaylist);
    this.currentPlaylistSubject.next(updatedPlaylist);
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
   * Siguiente canción con lógica inteligente
   */
  nextSong(): void {
    const playlist = this.currentPlaylist();
    if (!playlist) return;

    let nextIndex = playlist.currentIndex + 1;

    // Si llegamos al final de la playlist
    if (nextIndex >= playlist.items.length) {
      switch (playlist.type) {
        case 'circular':
          // Playlists circulares: volver al inicio
          nextIndex = 0;
          this.selectSong(nextIndex);
          break;
          
        case 'expandable':
          // Playlists expandibles: cargar más contenido
          this.loadMoreSongs().then(() => {
            // Después de cargar, reproducir la siguiente canción
            if (playlist.items.length > playlist.currentIndex + 1) {
              this.selectSong(playlist.currentIndex + 1);
            }
          }).catch(error => {
            console.error('Error cargando más canciones:', error);
            // Si no se puede cargar más, comportamiento circular
            this.selectSong(0);
          });
          break;
          
        case 'single':
        default:
          // Playlist single: no hacer nada o parar
          if (playlist.repeatMode === 'all') {
            nextIndex = 0;
            this.selectSong(nextIndex);
          }
          // Si no está en repeat, simplemente terminar
          return;
      }
    } else {
      // Hay una siguiente canción en la lista actual
      this.selectSong(nextIndex);
    }
  }

  /**
   * Cargar más canciones según el contexto
   */
  private async loadMoreSongs(): Promise<void> {
    const playlist = this.currentPlaylist();
    if (!playlist?.canLoadMore) {
      throw new Error('No se pueden cargar más canciones');
    }

    try {
      let newSongs: Song[] = [];
      const nextPage = (playlist.currentPage || 1) + 1;

      switch (playlist.contextType) {
        case 'search':
          if (playlist.searchQuery) {
            console.log(`Cargando más resultados de búsqueda para: ${playlist.searchQuery}, página: ${nextPage}`);
            // TODO: Implementar llamada al servicio de búsqueda
            // newSongs = await this.searchService.searchSongs(playlist.searchQuery, nextPage);
          }
          break;
          
        case 'random':
          console.log(`Cargando más canciones aleatorias, página: ${nextPage}`);
          // TODO: Implementar llamada al servicio de canciones aleatorias
          // newSongs = await this.songService.getRandomSongs(nextPage);
          break;
          
        case 'popular':
          console.log(`Cargando más canciones populares, página: ${nextPage}`);
          // TODO: Implementar llamada al servicio de canciones populares
          // newSongs = await this.songService.getMostPopular(nextPage);
          break;
      }

      if (newSongs.length > 0) {
        // Agregar las nuevas canciones a la playlist
        const newItems: PlaylistItem[] = newSongs.map((song, index) => ({
          ...song,
          position: playlist.items.length + index,
          addedAt: new Date()
        }));

        const updatedPlaylist = {
          ...playlist,
          items: [...playlist.items, ...newItems],
          currentPage: nextPage,
          canLoadMore: newSongs.length >= 10 // Asumiendo 10 canciones por página
        };

        this.currentPlaylist.set(updatedPlaylist);
        this.currentPlaylistSubject.next(updatedPlaylist);
      } else {
        // No hay más canciones disponibles
        const updatedPlaylist = {
          ...playlist,
          canLoadMore: false
        };

        this.currentPlaylist.set(updatedPlaylist);
        this.currentPlaylistSubject.next(updatedPlaylist);
        throw new Error('No hay más canciones disponibles');
      }
    } catch (error) {
      console.error('Error al cargar más canciones:', error);
      throw error;
    }
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
