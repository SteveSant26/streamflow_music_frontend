import { Injectable, signal, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Song, Playlist, PlaylistItem, PlaybackState } from '../../domain/entities/song.entity';
import { PlayerUseCase } from '../../domain/usecases';
import { GetRandomSongsUseCase } from '../../domain/usecases/song/song.usecases';

@Injectable({ providedIn: 'root' })
export class PlaylistService {
  // Inject PlayerUseCase para manejar la reproducción real
  private readonly playerUseCase = inject(PlayerUseCase);
  private readonly getRandomSongsUseCase = inject(GetRandomSongsUseCase);

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
   * Seleccionar canción por índice y reproducir automáticamente
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
    
    // Reproducir automáticamente la nueva canción
    this.playerUseCase.playSong(song);
    
    // Iniciar precarga de la siguiente canción
    this.startPreloadingNext();
  }

  /**
   * Reproducir/pausar - SIMPLIFICADO para evitar duplicación
   */
  togglePlayback(): void {
    const state = this.playbackState();
    const playlist = this.currentPlaylist();
    
    if (!playlist?.items?.length) {
      console.warn('No hay playlist o está vacía');
      return;
    }

    const currentSong = playlist.items[playlist.currentIndex];
    if (!currentSong) {
      console.warn('No hay canción actual en la playlist');
      return;
    }

    console.log(`🎵 PlaylistService.togglePlayback() - Canción: ${currentSong.title}`);
    console.log(`🎵 Estado actual isPlaying: ${state.isPlaying}`);

    // DELEGAR COMPLETAMENTE AL PlayerUseCase - NO duplicar lógica
    if (!state.isPlaying) {
      console.log(`🎵 Iniciando reproducción de: ${currentSong.title}`);
      
      // Solo llamar al PlayerUseCase, él se encarga de todo el audio
      this.playerUseCase.playSong(currentSong);
      
      // Actualizar SOLO el estado de la playlist
      const newState = {
        ...state,
        currentSong,
        isPlaying: true
      };
      this.playbackState.set(newState);
      this.playbackStateSubject.next(newState);
    } else {
      console.log(`⏸️ Pausando reproducción`);
      
      // Solo llamar al PlayerUseCase para pausar
      this.playerUseCase.pauseSong();
      
      // Actualizar estado local
      const newState = {
        ...state,
        isPlaying: false
      };
      this.playbackState.set(newState);
      this.playbackStateSubject.next(newState);
    }

    // Iniciar precarga de la siguiente canción
    this.startPreloadingNext();
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
   * Agregar una canción a la playlist actual
   */
  addSongToCurrentPlaylist(song: Song): void {
    const playlist = this.currentPlaylist();
    if (!playlist) {
      // Si no hay playlist, crear una nueva con la canción
      this.createPlaylist([song], 'Playlist Actual', 0);
      this.setPlaylistType('single');
      this.setPlaylistContext('single');
      return;
    }

    // Verificar si la canción ya existe en la playlist
    const exists = playlist.items.some(item => item.id === song.id);
    if (exists) {
      console.log(`🔄 La canción "${song.title}" ya está en la playlist`);
      return;
    }

    // Agregar la canción al final de la playlist
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

    console.log(`✅ Canción "${song.title}" agregada a la playlist actual`);
  }

  /**
   * Reproducir una canción específica (para casos de single play)
   */
  playSingleSong(song: Song): void {
    console.log(`🎵 Reproducir canción individual: ${song.title}`);
    
    // Si no hay playlist o es diferente contexto, crear una nueva
    const currentPlaylist = this.currentPlaylist();
    
    // Crear/actualizar playlist con canciones random si es necesario
    if (!currentPlaylist || currentPlaylist.contextType !== 'single') {
      // Si hay playlist existente, mantener las canciones pero cambiar contexto
      if (currentPlaylist) {
        // Agregar la canción al inicio de la playlist existente
        const newItems = [
          { ...song, position: 0, addedAt: new Date() },
          ...currentPlaylist.items.map(item => ({ ...item, position: item.position + 1 }))
        ];
        
        const updatedPlaylist = {
          ...currentPlaylist,
          items: newItems,
          currentIndex: 0,
          contextType: 'single' as const,
          type: 'expandable' as const // Permitir cargar más random
        };
        
        this.currentPlaylist.set(updatedPlaylist);
        this.currentPlaylistSubject.next(updatedPlaylist);
      } else {
        // Crear nueva playlist con la canción + algunas random
        this.createRandomPlaylistWithSong(song);
      }
    } else {
      // Si ya es contexto single, solo seleccionar o agregar
      const songIndex = currentPlaylist.items.findIndex(item => item.id === song.id);
      if (songIndex >= 0) {
        // Si la canción ya está, seleccionarla
        this.selectSong(songIndex);
      } else {
        // Si no está, agregarla y seleccionarla
        this.addSongToCurrentPlaylist(song);
        this.selectSong(currentPlaylist.items.length); // Última posición
      }
    }
  }

  /**
   * Crear playlist random que incluya la canción especificada
   */
  private createRandomPlaylistWithSong(primarySong: Song): void {
    // Usar el usecase para obtener canciones random
    this.getRandomSongsUseCase.execute(1, 20).subscribe({
      next: (randomSongs: Song[]) => {
        // Crear playlist con la canción principal al inicio
        const items: PlaylistItem[] = [
          { ...primarySong, position: 0, addedAt: new Date() },
          ...randomSongs.slice(0, 19).map((song: Song, index: number) => ({
            ...song,
            position: index + 1,
            addedAt: new Date()
          }))
        ];

        const playlist: Playlist = {
          id: 'random-playlist',
          name: 'Reproducción Aleatoria',
          items,
          currentIndex: 0,
          repeatMode: 'none',
          isShuffled: false,
          contextType: 'single',
          type: 'expandable',
          canLoadMore: true,
          currentPage: 1
        };

        this.currentPlaylist.set(playlist);
        this.currentPlaylistSubject.next(playlist);
        
        // Seleccionar la primera canción (la que el usuario quería reproducir)
        this.selectSong(0);
      },
      error: (error) => {
        console.error('Error creando playlist random:', error);
        // Fallback: solo reproducir la canción sola
        this.createPlaylist([primarySong], 'Canción Individual', 0);
        this.setPlaylistType('single');
        this.setPlaylistContext('single');
      }
    });
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

  /**
   * Precargar la siguiente canción para reproducción más rápida
   */
  preloadNextSong(): void {
    const playlist = this.currentPlaylist();
    if (!playlist) return;

    const nextIndex = this.getNextSongIndex();
    if (nextIndex === -1) return;

    const nextSong = playlist.items[nextIndex];
    if (!nextSong) return;

    // Crear un elemento de audio temporal para precargar
    const preloadAudio = new Audio();
    
    // Configurar URLs de fallback
    const audioUrl = nextSong.file_url || nextSong.audioUrl || nextSong.youtube_url;
    
    if (audioUrl) {
      preloadAudio.preload = 'metadata'; // Solo precargar metadatos por rendimiento
      preloadAudio.src = audioUrl;
      
      console.log(`🎵 Precargando siguiente canción: ${nextSong.title}`);
      
      // Cargar metadatos sin reproducir
      preloadAudio.load();
      
      // Limpiar referencia después de un tiempo para evitar acumulación
      setTimeout(() => {
        preloadAudio.src = '';
      }, 30000); // 30 segundos
    }
  }

  /**
   * Obtener índice de la siguiente canción
   */
  private getNextSongIndex(): number {
    const playlist = this.currentPlaylist();
    if (!playlist) return -1;

    let nextIndex = playlist.currentIndex + 1;

    // Si llegamos al final de la playlist
    if (nextIndex >= playlist.items.length) {
      switch (playlist.type) {
        case 'circular':
          return 0; // Volver al inicio
        case 'expandable':
          return playlist.items.length; // Siguiente posición (se cargará más contenido)
        case 'single':
        default:
          if (playlist.repeatMode === 'all') {
            return 0;
          }
          return -1; // No hay siguiente
      }
    }

    return nextIndex;
  }

  /**
   * Iniciar precarga automática cuando se selecciona una canción
   */
  private startPreloadingNext(): void {
    // Precargar después de un pequeño delay para no interferir con la reproducción actual
    setTimeout(() => {
      this.preloadNextSong();
    }, 2000); // 2 segundos de delay
  }

  /**
   * Extraer YouTube ID del thumbnail URL
   */
  private extractYouTubeIdFromThumbnail(thumbnailUrl: string): string | null {
    try {
      console.log(`🔍 Analizando thumbnail_url: ${thumbnailUrl}`);
      
      // Patrón para extraer ID de URLs como:
      // https://...supabase.co/storage/v1/object/public/music-files/thumbnails/lyMPVoKKciw_1fadeeae.jpg?
      // https://...supabase.co/storage/v1/object/public/music-files/thumbnails/RFE6v8FpfWs_b280f592.jpg?
      const match = thumbnailUrl.match(/thumbnails\/([a-zA-Z0-9_-]+)_[a-fA-F0-9]+\.jpg/);
      
      if (match && match[1]) {
        const extractedId = match[1];
        console.log(`✅ YouTube ID extraído: ${extractedId}`);
        return extractedId;
      }
      
      console.log(`❌ No se pudo extraer YouTube ID del thumbnail`);
      return null;
    } catch (error) {
      console.error(`❌ Error extrayendo YouTube ID:`, error);
      return null;
    }
  }
}
