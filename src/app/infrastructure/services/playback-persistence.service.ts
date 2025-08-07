import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

export interface PlaybackState {
  currentSong: {
    id: string;
    title: string;
    artist_name: string;
    album?: {
      title: string;
    };
    thumbnail_url?: string;
    file_url?: string;
  } | null;
  currentPlaylist: {
    id: string;
    name: string;
    songs: any[];
    currentIndex: number;
  } | null;
  playbackPosition: {
    currentTime: number;
    duration: number;
    progress: number;
  };
  playerSettings: {
    volume: number;
    isPlaying: boolean;
    isShuffle: boolean;
    isRepeat: boolean;
  };
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class PlaybackPersistenceService {
  private readonly STORAGE_KEY = 'streamflow_playback_state';
  private readonly playbackState$ = new BehaviorSubject<PlaybackState | null>(null);

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: object
  ) {
    this.loadPersistedState();
  }

  /**
   * Guarda el estado completo de reproducción en localStorage
   */
  savePlaybackState(state: PlaybackState): void {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      const stateToSave = {
        ...state,
        timestamp: Date.now()
      };

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stateToSave));
      this.playbackState$.next(stateToSave);
      
      console.log('🎵 Estado de reproducción guardado:', {
        song: state.currentSong?.title,
        playlist: state.currentPlaylist?.name,
        time: this.formatTime(state.playbackPosition.currentTime)
      });
    } catch (error) {
      console.error('Error guardando estado de reproducción:', error);
    }
  }

  /**
   * Guarda solo la posición de reproducción actual
   */
  savePlaybackPosition(currentTime: number, duration: number): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const currentState = this.getPersistedState();
    if (currentState) {
      currentState.playbackPosition = {
        currentTime,
        duration,
        progress: duration > 0 ? (currentTime / duration) * 100 : 0
      };
      currentState.timestamp = Date.now();
      
      this.savePlaybackState(currentState);
    }
  }

  /**
   * Guarda solo la configuración del reproductor (volumen, etc.)
   */
  savePlayerSettings(settings: PlaybackState['playerSettings']): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const currentState = this.getPersistedState();
    if (currentState) {
      currentState.playerSettings = settings;
      currentState.timestamp = Date.now();
      
      this.savePlaybackState(currentState);
    }
  }

  /**
   * Guarda la playlist actual
   */
  saveCurrentPlaylist(playlist: PlaybackState['currentPlaylist']): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const currentState = this.getPersistedState() || this.createDefaultState();
    currentState.currentPlaylist = playlist;
    currentState.timestamp = Date.now();
    
    this.savePlaybackState(currentState);
  }

  /**
   * Guarda la canción actual
   */
  saveCurrentSong(song: PlaybackState['currentSong']): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const currentState = this.getPersistedState() || this.createDefaultState();
    currentState.currentSong = song;
    currentState.timestamp = Date.now();
    
    this.savePlaybackState(currentState);
  }

  /**
   * Obtiene el estado persistido
   */
  getPersistedState(): PlaybackState | null {
    if (!isPlatformBrowser(this.platformId)) return null;

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return null;

      const state = JSON.parse(stored) as PlaybackState;
      
      // Verificar si el estado no es muy antiguo (más de 7 días)
      const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 días en milisegundos
      if (Date.now() - state.timestamp > maxAge) {
        this.clearPersistedState();
        return null;
      }

      return state;
    } catch (error) {
      console.error('Error cargando estado persistido:', error);
      this.clearPersistedState();
      return null;
    }
  }

  /**
   * Observable del estado de reproducción
   */
  getPlaybackState$(): Observable<PlaybackState | null> {
    return this.playbackState$.asObservable();
  }

  /**
   * Verifica si hay una sesión guardada válida
   */
  hasValidSession(): boolean {
    const state = this.getPersistedState();
    return state !== null && 
           state.currentSong !== null && 
           state.playbackPosition.currentTime > 0;
  }

  /**
   * Obtiene información de la última sesión para mostrar al usuario
   */
  getLastSessionInfo(): { song: string; time: string; playlist?: string } | null {
    const state = this.getPersistedState();
    if (!state || !state.currentSong) return null;

    return {
      song: `${state.currentSong.artist_name} - ${state.currentSong.title}`,
      time: this.formatTime(state.playbackPosition.currentTime),
      playlist: state.currentPlaylist?.name
    };
  }

  /**
   * Limpia el estado persistido
   */
  clearPersistedState(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      localStorage.removeItem(this.STORAGE_KEY);
      this.playbackState$.next(null);
      console.log('🗑️ Estado de reproducción limpiado');
    } catch (error) {
      console.error('Error limpiando estado:', error);
    }
  }

  /**
   * Carga el estado persistido al inicializar
   */
  private loadPersistedState(): void {
    const state = this.getPersistedState();
    if (state) {
      this.playbackState$.next(state);
    }
  }

  /**
   * Crea un estado por defecto
   */
  private createDefaultState(): PlaybackState {
    return {
      currentSong: null,
      currentPlaylist: null,
      playbackPosition: {
        currentTime: 0,
        duration: 0,
        progress: 0
      },
      playerSettings: {
        volume: 0.5,
        isPlaying: false,
        isShuffle: false,
        isRepeat: false
      },
      timestamp: Date.now()
    };
  }

  /**
   * Formatea tiempo en formato mm:ss
   */
  private formatTime(seconds: number): string {
    if (!seconds || isNaN(seconds)) return '0:00';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}
