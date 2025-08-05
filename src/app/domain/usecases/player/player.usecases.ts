import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Song } from '../../entities/song.entity';
import { PlayerState } from '../../entities/player-state.entity';

export interface PlaybackState {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  progress: number; // 0 to 100 percentage
  volume: number;
  isMuted: boolean;
  repeatMode: 'none' | 'one' | 'all';
  isShuffleEnabled: boolean;
  isLoading: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PlayerUseCase {
  private readonly currentSong$ = new BehaviorSubject<Song | null>(null);
  private readonly playbackState$ = new BehaviorSubject<PlaybackState>({
    currentSong: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    progress: 0,
    volume: 1,
    isMuted: false,
    repeatMode: 'none',
    isShuffleEnabled: false,
    isLoading: false
  });

  // Audio element reference - will be set by GlobalPlayerStateService
  private audioElement: HTMLAudioElement | null = null;
  
  // Event listeners to track for cleanup
  private eventListeners: Array<{event: string, handler: any}> = [];

  getCurrentSong(): Observable<Song | null> {
    return this.currentSong$.asObservable();
  }

  getPlaybackState(): Observable<PlaybackState> {
    return this.playbackState$.asObservable();
  }

  // Set audio element reference
  setAudioElement(audio: HTMLAudioElement): void {
    // Remove existing listeners to prevent duplicates
    if (this.audioElement) {
      this.removeAudioEventListeners();
    }
    
    this.audioElement = audio;
    this.setupAudioEventListeners();
    console.log('[Player UseCase] 🔊 Audio element connected successfully');
  }

  playSong(song: Song): void {
    console.log(`🎵 PlayerUseCase.playSong() recibida:`, song);
    
    // Verificar si ya estamos reproduciendo esta canción
    const currentState = this.playbackState$.value;
    if (currentState.currentSong?.id === song.id && currentState.isPlaying) {
      console.log('[Player UseCase] ⚠️ La canción ya se está reproduciendo, ignorando...');
      return;
    }
    
    // Determinar la URL de audio a usar
    const audioUrl = this.getAudioUrl(song);
    if (!audioUrl) {
      console.error('[Player UseCase] ❌ No hay URL de audio disponible');
      return;
    }

    // Actualizar el estado de loading
    this.updatePlaybackState({ isLoading: true });
    
    // Actualizar la canción actual
    this.currentSong$.next(song);
    this.updatePlaybackState({ currentSong: song });
    
    // Reproducir el audio
    this.playAudioUrl(audioUrl);
  }

  private getAudioUrl(song: Song): string | null {
    console.log('[Player UseCase] 🔗 URLs disponibles:', {
      file_url: song.file_url,
      source_url: song.source_url,
      youtube_url: song.youtube_url
    });

    // Prioridad 1: file_url (Supabase Storage - MP3 directo)
    if (song.file_url) {
      return song.file_url;
    }
    
    // Prioridad 2: source_url (URL externa)
    if (song.source_url) {
      return song.source_url;
    }

    // Prioridad 3: youtube_url (como último recurso, aunque no funcione bien)
    if (song.youtube_url) {
      return song.youtube_url;
    }

    return null;
  }

  private playAudioUrl(audioUrl: string): void {
    if (!this.audioElement) {
      console.error('[Player UseCase] ❌ Audio element not available');
      this.updatePlaybackState({ 
        isPlaying: false, 
        isLoading: false 
      });
      return;
    }

    console.log('[Player UseCase] 🎯 Reproduciendo URL:', audioUrl);
    
    try {
      // Reset previous state
      this.updatePlaybackState({ 
        isLoading: true,
        isPlaying: false,
        currentTime: 0,
        duration: 0,
        progress: 0
      });

      // Set the source and load
      this.audioElement.src = audioUrl;
      this.audioElement.load();
      
      // Attempt to play
      const playPromise = this.audioElement.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('[Player UseCase] ✅ Audio reproducido exitosamente');
            this.updatePlaybackState({ 
              isPlaying: true, 
              isLoading: false 
            });
          })
          .catch(error => {
            console.error('[Player UseCase] ❌ Error al reproducir audio:', error);
            this.updatePlaybackState({ 
              isPlaying: false, 
              isLoading: false 
            });
          });
      }
    } catch (error) {
      console.error('[Player UseCase] ❌ Error setting audio source:', error);
      this.updatePlaybackState({ 
        isPlaying: false, 
        isLoading: false 
      });
    }
  }

  pauseSong(): void {
    console.log('[Player UseCase] ⏸️ Pausando canción');
    
    if (this.audioElement) {
      try {
        this.audioElement.pause();
        this.updatePlaybackState({ isPlaying: false });
        console.log('[Player UseCase] ✅ Audio pausado exitosamente');
      } catch (error) {
        console.error('[Player UseCase] ❌ Error al pausar audio:', error);
      }
    } else {
      console.warn('[Player UseCase] ⚠️ Audio element not available for pause');
    }
  }

  resumeSong(): void {
    console.log('[Player UseCase] ▶️ Reanudando canción');
    
    if (this.audioElement) {
      try {
        const playPromise = this.audioElement.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              this.updatePlaybackState({ isPlaying: true });
              console.log('[Player UseCase] ✅ Audio reanudado exitosamente');
            })
            .catch(error => {
              console.error('[Player UseCase] ❌ Error al reanudar audio:', error);
            });
        }
      } catch (error) {
        console.error('[Player UseCase] ❌ Error al reanudar audio:', error);
      }
    } else {
      console.warn('[Player UseCase] ⚠️ Audio element not available for resume');
    }
  }

  seekTo(time: number): void {
    console.log('[Player UseCase] ⏩ Buscando posición:', time);
    
    if (this.audioElement) {
      try {
        // Validate time is within bounds
        const validTime = Math.max(0, Math.min(time, this.audioElement.duration || 0));
        this.audioElement.currentTime = validTime;
        
        this.updatePlaybackState({ 
          currentTime: validTime,
          progress: (validTime / (this.audioElement.duration || 1)) * 100
        });
        
        console.log('[Player UseCase] ✅ Posición actualizada:', validTime);
      } catch (error) {
        console.error('[Player UseCase] ❌ Error al buscar posición:', error);
      }
    } else {
      console.warn('[Player UseCase] ⚠️ Audio element not available for seek');
    }
  }

  setVolume(volume: number): void {
    console.log('[Player UseCase] 🔊 Configurando volumen:', volume);
    
    if (this.audioElement) {
      try {
        // Normalize volume to 0-1 range
        const normalizedVolume = Math.max(0, Math.min(1, volume));
        this.audioElement.volume = normalizedVolume;
        
        this.updatePlaybackState({ volume: normalizedVolume });
        
        console.log('[Player UseCase] ✅ Volumen actualizado:', normalizedVolume);
      } catch (error) {
        console.error('[Player UseCase] ❌ Error al configurar volumen:', error);
      }
    } else {
      console.warn('[Player UseCase] ⚠️ Audio element not available for volume control');
    }
  }

  toggleMute(): void {
    console.log('[Player UseCase] 🔇 Alternando mute');
    
    if (this.audioElement) {
      try {
        this.audioElement.muted = !this.audioElement.muted;
        
        this.updatePlaybackState({ isMuted: this.audioElement.muted });
        
        console.log('[Player UseCase] ✅ Mute actualizado:', this.audioElement.muted);
      } catch (error) {
        console.error('[Player UseCase] ❌ Error al alternar mute:', error);
      }
    } else {
      console.warn('[Player UseCase] ⚠️ Audio element not available for mute toggle');
    }
  }

  togglePlayPause(): void {
    const currentState = this.playbackState$.value;
    console.log('[Player UseCase] 🎵 togglePlayPause() - Estado actual:', {
      isPlaying: currentState.isPlaying,
      currentSong: currentState.currentSong?.title,
      isLoading: currentState.isLoading
    });
    
    // Si no hay canción actual, no hacer nada
    if (!currentState.currentSong) {
      console.warn('[Player UseCase] ⚠️ No hay canción actual para reproducir');
      return;
    }
    
    // Si está cargando, no permitir toggle
    if (currentState.isLoading) {
      console.warn('[Player UseCase] ⚠️ Audio está cargando, esperando...');
      return;
    }
    
    if (currentState.isPlaying) {
      this.pauseSong();
    } else {
      // Si hay canción pero no está reproduciéndose, intentar reanudar
      if (this.audioElement) {
        // Verificar si el audio tiene la fuente correcta
        const expectedUrl = this.getAudioUrl(currentState.currentSong);
        if (this.audioElement.src !== expectedUrl) {
          // Si la fuente no coincide, reproducir desde el inicio
          console.log('[Player UseCase] 🔄 Fuente incorrecta, reproduciendo desde inicio');
          this.playSong(currentState.currentSong);
        } else {
          // Si la fuente es correcta, reanudar
          this.resumeSong();
        }
      } else {
        // Si no hay audio element, reproducir desde el inicio
        this.playSong(currentState.currentSong);
      }
    }
  }

  stopSong(): void {
    console.log('[Player UseCase] ⏹️ Deteniendo canción');
    
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
    }

    this.updatePlaybackState({
      isPlaying: false,
      currentTime: 0,
      progress: 0
    });
    
    this.currentSong$.next(null);
  }

  nextSong(): void {
    // TODO: Implementar lógica de siguiente canción
    console.log('[Player UseCase] ⏭️ Siguiente canción (no implementado)');
  }

  previousSong(): void {
    // TODO: Implementar lógica de canción anterior
    console.log('[Player UseCase] ⏮️ Canción anterior (no implementado)');
  }

  setRepeatMode(mode: 'none' | 'one' | 'all'): void {
    this.updatePlaybackState({ repeatMode: mode });
  }

  toggleShuffle(): void {
    const currentState = this.playbackState$.value;
    this.updatePlaybackState({ isShuffleEnabled: !currentState.isShuffleEnabled });
  }

  private updatePlaybackState(state: Partial<PlaybackState>): void {
    const currentState = this.playbackState$.value;
    this.playbackState$.next({ ...currentState, ...state });
  }

  private setupAudioEventListeners(): void {
    if (!this.audioElement) return;

    console.log('[Player UseCase] 🎧 Configurando event listeners de audio');

    // Helper function to add tracked listeners
    const addListener = (event: string, handler: any) => {
      this.audioElement!.addEventListener(event, handler);
      this.eventListeners.push({event, handler});
    };

    // Loading started
    addListener('loadstart', () => {
      console.log('[Player UseCase] 🔄 Loading started');
      this.updatePlaybackState({ isLoading: true });
    });

    // Can start playing (metadata loaded)
    addListener('canplay', () => {
      console.log('[Player UseCase] ✅ Can start playing');
      this.updatePlaybackState({ isLoading: false });
    });

    // Enough data loaded to play through
    addListener('canplaythrough', () => {
      console.log('[Player UseCase] ✅ Can play through');
      this.updatePlaybackState({ isLoading: false });
    });

    // Time update event - solo actualizar si no está cargando
    addListener('timeupdate', () => {
      if (this.audioElement && !this.playbackState$.value.isLoading) {
        const currentTime = this.audioElement.currentTime;
        const duration = this.audioElement.duration || 0;
        const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

        // Solo actualizar si tenemos datos válidos
        if (duration > 0 && !isNaN(currentTime) && !isNaN(duration)) {
          this.updatePlaybackState({
            currentTime,
            duration,
            progress
          });
        }
      }
    });

    // Loaded metadata event
    addListener('loadedmetadata', () => {
      if (this.audioElement) {
        console.log('[Player UseCase] 📊 Metadata loaded, duration:', this.audioElement.duration);
        this.updatePlaybackState({
          duration: this.audioElement.duration || 0,
          isLoading: false
        });
      }
    });

    // Play event (iniciado, pero puede estar pausado por buffering)
    addListener('play', () => {
      console.log('[Player UseCase] ▶️ Audio play event (starting)');
      // No cambiar isPlaying aquí, esperar al evento 'playing'
    });

    // Playing event (realmente está sonando) - UN SOLO LISTENER
    addListener('playing', () => {
      console.log('[Player UseCase] ▶️ Audio playing (really playing now)');
      this.updatePlaybackState({ isPlaying: true, isLoading: false });
    });

    // Pause event
    addListener('pause', () => {
      console.log('[Player UseCase] ⏸️ Audio pause event');
      this.updatePlaybackState({ isPlaying: false });
    });

    // Ended event
    addListener('ended', () => {
      console.log('[Player UseCase] 🔚 Audio ended');
      this.updatePlaybackState({ 
        isPlaying: false,
        currentTime: 0,
        progress: 0
      });
      // Handle next song based on repeat mode
      this.handleSongEnd();
    });

    // Volume change event
    addListener('volumechange', () => {
      if (this.audioElement) {
        this.updatePlaybackState({
          volume: this.audioElement.volume,
          isMuted: this.audioElement.muted
        });
      }
    });

    // Waiting event (buffering)
    addListener('waiting', () => {
      console.log('[Player UseCase] ⏳ Audio waiting/buffering');
      this.updatePlaybackState({ isLoading: true });
    });

    // Seeking started
    addListener('seeking', () => {
      console.log('[Player UseCase] 🔍 Seeking started');
      this.updatePlaybackState({ isLoading: true });
    });

    // Seeking finished
    addListener('seeked', () => {
      console.log('[Player UseCase] ✅ Seeking finished');
      this.updatePlaybackState({ isLoading: false });
    });

    // Error event
    addListener('error', (e: Event) => {
      console.error('[Player UseCase] ❌ Audio error:', e);
      this.updatePlaybackState({ 
        isPlaying: false, 
        isLoading: false 
      });
    });

    console.log('[Player UseCase] ✅ Event listeners configurados exitosamente');
  }

  private removeAudioEventListeners(): void {
    if (!this.audioElement || this.eventListeners.length === 0) return;

    console.log('[Player UseCase] 🧹 Removiendo event listeners existentes');
    
    this.eventListeners.forEach(({event, handler}) => {
      this.audioElement!.removeEventListener(event, handler);
    });
    
    this.eventListeners = [];
    console.log('[Player UseCase] ✅ Event listeners removidos exitosamente');
  }

  // Observable for song end events - usar el estado interno en lugar de duplicar listeners
  onSongEnd(): Observable<void> {
    return new Observable(observer => {
      // Usar el estado interno en lugar de agregar listeners directos
      this.playbackState$.subscribe(state => {
        if (state.isPlaying === false && state.currentTime === 0 && state.progress === 0) {
          // La canción terminó naturalmente
          observer.next();
        }
      });
    });
  }

  // Observable for audio errors - usar el estado interno
  onError(): Observable<any> {
    return new Observable(observer => {
      // Los errores ya se manejan en setupAudioEventListeners
      // Este observable se mantiene por compatibilidad
      console.log('[Player UseCase] 🔊 Error observable creado (usar console para errores)');
    });
  }

  // Get current player state
  getPlayerState(): Observable<PlaybackState> {
    return this.getPlaybackState();
  }

  // Alias method for compatibility
  getCurrentPlayerState(): PlayerState {
    const state = this.playbackState$.value;
    return {
      currentSong: state.currentSong,
      isPlaying: state.isPlaying,
      volume: state.volume,
      currentTime: state.currentTime,
      duration: state.duration,
      progress: state.progress,
      isLoading: state.isLoading,
      isMuted: state.isMuted,
      repeatMode: state.repeatMode,
      isShuffleEnabled: state.isShuffleEnabled
    };
  }

  // Force state synchronization
  forceStateSync(): void {
    if (this.audioElement) {
      this.updatePlaybackState({
        currentTime: this.audioElement.currentTime,
        duration: this.audioElement.duration || 0,
        progress: (this.audioElement.currentTime / (this.audioElement.duration || 1)) * 100,
        volume: this.audioElement.volume,
        isMuted: this.audioElement.muted,
        isPlaying: !this.audioElement.paused
      });
    }
  }

  // Emergency state recovery
  emergencyStateRecovery(): void {
    console.log('[Player UseCase] 🚑 Emergency state recovery');
    this.forceStateSync();
  }

  // Preserve current state
  preserveCurrentState(): void {
    console.log('[Player UseCase] 💾 Preserving current state');
    this.forceStateSync();
  }

  // Play previous song
  async playPrevious(): Promise<void> {
    console.log('[Player UseCase] ⏮️ Play previous (implementation needed)');
    // TODO: Implement playlist navigation
  }

  // Play next song
  async playNext(): Promise<void> {
    console.log('[Player UseCase] ⏭️ Play next (implementation needed)');
    // TODO: Implement playlist navigation
  }

  // Seek to percentage
  seekToPercentage(percentage: number): void {
    if (this.audioElement?.duration) {
      const time = (percentage / 100) * this.audioElement.duration;
      this.seekTo(time);
    }
  }

  // Handle song end based on repeat mode
  private handleSongEnd(): void {
    const currentState = this.playbackState$.value;
    
    switch (currentState.repeatMode) {
      case 'one':
        // Repeat current song
        if (this.audioElement) {
          this.audioElement.currentTime = 0;
          this.audioElement.play().catch(console.error);
        }
        break;
      case 'all':
        // Play next song (implement when playlist navigation is ready)
        console.log('[Player UseCase] 🔄 Repeat all - next song (not implemented)');
        break;
      case 'none':
      default:
        // Stop playback
        console.log('[Player UseCase] 🛑 Song ended - stopping playback');
        break;
    }
  }
}
