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
  
  // Interval para limpiar audios duplicados periódicamente
  private cleanupInterval: any = null;
  private ultraAggressiveInterval: any = null; // ← NUEVO: Verificador cada 500ms

  constructor() {
    // 🚨 INTERCEPTOR EXTREMO: BLOQUEAR CREACIÓN DE AUDIOS DUPLICADOS
    this.interceptAudioCreation();
    
    // Iniciar limpieza agresiva periódica cada 2 segundos
    this.startAggressiveCleanup();
    
    // ✅ NUEVO: Verificador ULTRA AGRESIVO cada 100ms
    this.startUltraAggressiveMonitoring();
  }

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
    
    // 💾 Cargar volumen guardado desde localStorage
    this.loadSavedVolume();
    
    console.log('[Player UseCase] 🔊 Audio element connected successfully');
  }

  // 💾 Método para cargar volumen guardado
  private loadSavedVolume(): void {
    try {
      const savedVolume = localStorage.getItem('streamflow_volume');
      if (savedVolume && this.audioElement) {
        const volume = parseFloat(savedVolume);
        if (!isNaN(volume) && volume >= 0 && volume <= 1) {
          this.audioElement.volume = volume;
          this.updatePlaybackState({ volume });
          console.log('[Player UseCase] 💾 Volumen cargado desde localStorage:', volume);
        }
      } else if (this.audioElement) {
        // Volumen por defecto si no hay guardado
        const defaultVolume = 0.7;
        this.audioElement.volume = defaultVolume;
        this.updatePlaybackState({ volume: defaultVolume });
        console.log('[Player UseCase] 🔊 Configurado volumen por defecto:', defaultVolume);
      }
    } catch (error) {
      console.warn('[Player UseCase] ⚠️ Error cargando volumen de localStorage:', error);
    }
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
      
      // Asegurar configuración básica del audio
      this.audioElement.volume = this.playbackState$.value.volume || 1;
      this.audioElement.muted = this.playbackState$.value.isMuted || false;
      
      this.audioElement.load();
      
      console.log('[Player UseCase] 🔊 Audio configurado - Volume:', this.audioElement.volume, 'Muted:', this.audioElement.muted);
      
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

  /**
   * MÉTODO ULTRA AGRESIVO: Destruye TODOS los audios excepto el nuestro
   * Esto previene reproducciones múltiples de forma definitiva
   */
  private pauseAllOtherAudios(): void {
    try {
      const allAudioElements = document.querySelectorAll('audio');
      let pausedCount = 0;
      let totalAudios = allAudioElements.length;
      let playingAudios = 0;
      
      console.log(`[Player UseCase] 🛑 MODO ULTRA AGRESIVO: Encontrados ${totalAudios} elementos de audio`);
      
      allAudioElements.forEach((audio, index) => {
        try {
          // Si NO es nuestro elemento principal, DESTRUIRLO COMPLETAMENTE
          if (audio !== this.audioElement) {
            
            // 1. Pausar inmediatamente
            if (!audio.paused) {
              console.log(`[Player UseCase] � ELIMINANDO audio duplicado ${index + 1}:`, audio.src);
              audio.pause();
              playingAudios++;
            }
            
            // 2. Resetear completamente
            audio.currentTime = 0;
            audio.volume = 0;
            audio.muted = true; // ⚡ NUEVO: ASEGURAR QUE ESTÉ SILENCIADO
            
            // 3. Remover la fuente
            audio.src = '';
            audio.load();
            
            // 4. Ocultar el elemento
            audio.style.display = 'none';
            
            // 5. Desconectar todos los event listeners
            audio.onplay = null;
            audio.onpause = null;
            audio.ontimeupdate = null;
            audio.onended = null;
            audio.onloadstart = null;
            audio.oncanplay = null;
            
            // 6. ⚡ NUEVO: REMOVER INMEDIATAMENTE DEL DOM
            try {
              if (audio.parentNode) {
                audio.parentNode.removeChild(audio);
                console.log(`[Player UseCase] 🗑️ Audio ${index + 1} REMOVIDO del DOM inmediatamente`);
              }
            } catch (domError) {
              console.error(`[Player UseCase] ❌ Error removiendo del DOM:`, domError);
            }
            
            pausedCount++;
          }
        } catch (error) {
          console.error(`[Player UseCase] ❌ Error destruyendo audio ${index + 1}:`, error);
        }
      });
      
      console.log(`[Player UseCase] 💀 DESTRUIDOS ${pausedCount} audios duplicados de ${totalAudios} totales`);
      
      // VERIFICACIÓN FINAL INMEDIATA - Asegurar que no queden audios intrusos
      setTimeout(() => {
        const remainingAudios = document.querySelectorAll('audio');
        if (remainingAudios.length > 1) {
          console.error(`[Player UseCase] 🚨 ALERTA: Aún quedan ${remainingAudios.length} audios, SEGUNDA RONDA DE ELIMINACIÓN`);
          remainingAudios.forEach((audio, index) => {
            if (audio !== this.audioElement) {
              try {
                audio.pause();
                audio.src = '';
                audio.load();
                if (audio.parentNode) {
                  audio.parentNode.removeChild(audio);
                  console.log(`[Player UseCase] 🗑️ SEGUNDA RONDA: Audio ${index + 1} REMOVIDO`);
                }
              } catch (error) {
                console.error(`[Player UseCase] ❌ Error en segunda ronda:`, error);
              }
            }
          });
        }
      }, 50); // ⚡ VERIFICACIÓN SÚPER RÁPIDA
      
    } catch (error) {
      console.error('[Player UseCase] ❌ Error en método ultra agresivo:', error);
    }
  }

  /**
   * 🚨 VERIFICACIÓN EXTREMA: Asegura que solo existe UN audio
   */
  private verifyUniqueAudio(): void {
    const allAudios = document.querySelectorAll('audio');
    const playingAudios = Array.from(allAudios).filter(audio => !audio.paused);
    
    console.log(`🔍 VERIFICACIÓN: ${allAudios.length} audios totales, ${playingAudios.length} reproduciéndose`);
    
    if (allAudios.length > 1) {
      console.error(`🚨 EMERGENCIA: ${allAudios.length} audios detectados - ELIMINANDO TODOS EXCEPTO EL PRINCIPAL`);
      
      allAudios.forEach((audio, index) => {
        if (audio !== this.audioElement) {
          try {
            console.error(`💀 ELIMINANDO audio intruso ${index + 1}:`, audio.src);
            audio.pause();
            audio.currentTime = 0;
            audio.volume = 0;
            audio.muted = true;
            audio.src = '';
            audio.load();
            
            if (audio.parentNode) {
              audio.parentNode.removeChild(audio);
              console.log(`🗑️ Audio intruso ${index + 1} REMOVIDO del DOM`);
            }
          } catch (error) {
            console.error(`❌ Error eliminando audio ${index + 1}:`, error);
          }
        }
      });
    }
    
    if (playingAudios.length > 1) {
      console.error(`🚨 DUPLICACIÓN DETECTADA: ${playingAudios.length} audios reproduciéndose - ACCIÓN INMEDIATA`);
      
      playingAudios.forEach((audio, index) => {
        if (audio !== this.audioElement) {
          console.error(`💀 ELIMINANDO audio duplicado ${index + 1} inmediatamente`);
          try {
            audio.pause();
            audio.currentTime = 0;
            audio.src = '';
            audio.load();
            
            if (audio.parentNode) {
              audio.parentNode.removeChild(audio);
              console.log(`🗑️ Audio duplicado ${index + 1} REMOVIDO`);
            }
          } catch (error) {
            console.error(`❌ Error eliminando duplicado:`, error);
          }
        }
      });
    }
    
    // VERIFICACIÓN FINAL
    const finalAudios = document.querySelectorAll('audio');
    const finalPlaying = Array.from(finalAudios).filter(audio => !audio.paused);
    
    if (finalAudios.length === 1 && finalPlaying.length <= 1) {
      console.log('✅ VERIFICACIÓN EXITOSA: Solo 1 audio en el DOM');
    } else {
      console.error(`❌ VERIFICACIÓN FALLIDA: ${finalAudios.length} audios, ${finalPlaying.length} reproduciéndose`);
    }
  }

  /**
   * DETECTA Y DESTRUYE múltiples audios reproduciéndose simultáneamente
   * Ahora también ACTÚA para eliminar duplicados, no solo detecta
   */
  private detectMultiplePlayingAudios(): void {
    try {
      const allAudioElements = document.querySelectorAll('audio');
      const playingAudios = Array.from(allAudioElements).filter(audio => !audio.paused);
      
      if (playingAudios.length > 1) {
        console.error(`[Player UseCase] 🚨 ALERTA CRÍTICA: ${playingAudios.length} audios reproduciéndose simultáneamente - ACCIÓN INMEDIATA`);
        
        playingAudios.forEach((audio, index) => {
          console.warn(`[Player UseCase] 🎵 Audio ${index + 1}:`, audio.src);
          
          // Si NO es nuestro audio principal, DESTRUIRLO INMEDIATAMENTE
          if (audio !== this.audioElement) {
            console.error(`[Player UseCase] 💀 DESTRUYENDO audio duplicado inmediatamente`);
            try {
              audio.pause();
              audio.currentTime = 0;
              audio.src = '';
              audio.load();
              
              // Intentar remover del DOM
              if (audio.parentNode) {
                audio.parentNode.removeChild(audio);
                console.log(`[Player UseCase] 🗑️ Audio duplicado REMOVIDO del DOM`);
              }
            } catch (error) {
              console.error(`[Player UseCase] ❌ Error destruyendo audio duplicado:`, error);
            }
          }
        });
        
        // Ejecutar método ultra agresivo nuevamente después de detectar duplicados
        setTimeout(() => this.pauseAllOtherAudios(), 100);
      } else if (playingAudios.length === 1) {
        console.log(`[Player UseCase] ✅ Solo 1 audio reproduciéndose - CORRECTO`);
      } else {
        console.log(`[Player UseCase] 🔇 No hay audios reproduciéndose`);
      }
    } catch (error) {
      console.error('[Player UseCase] ❌ Error al detectar múltiples audios:', error);
    }
  }

  resumeSong(): void {
    console.log('[Player UseCase] ▶️ Reanudando canción');
    console.log('[Player UseCase] 🔍 Estado del audio element:', {
      hasAudioElement: !!this.audioElement,
      audioSrc: this.audioElement?.src,
      audioPaused: this.audioElement?.paused,
      audioCurrentTime: this.audioElement?.currentTime,
      audioDuration: this.audioElement?.duration
    });
    
    if (this.audioElement) {
      try {
        console.log('[Player UseCase] 🎯 Llamando audio.play()...');
        const playPromise = this.audioElement.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('[Player UseCase] ✅ Audio reanudado exitosamente');
              this.updatePlaybackState({ isPlaying: true });
            })
            .catch(error => {
              console.error('[Player UseCase] ❌ Error al reanudar audio:', error);
              console.error('[Player UseCase] 📊 Detalles del error:', {
                errorName: error.name,
                errorMessage: error.message,
                audioReadyState: this.audioElement?.readyState,
                audioNetworkState: this.audioElement?.networkState
              });
            });
        } else {
          console.warn('[Player UseCase] ⚠️ playPromise is undefined - audio.play() no devolvió Promise');
          this.updatePlaybackState({ isPlaying: true });
        }
      } catch (error) {
        console.error('[Player UseCase] ❌ Error al llamar audio.play():', error);
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
    console.log('[Player UseCase] 🔍 Estado del audio element:', {
      hasAudioElement: !!this.audioElement,
      currentVolume: this.audioElement?.volume,
      isMuted: this.audioElement?.muted
    });
    
    if (this.audioElement) {
      try {
        // Normalize volume to 0-1 range
        const normalizedVolume = Math.max(0, Math.min(1, volume));
        console.log('[Player UseCase] 🎯 Configurando volumen normalizado:', normalizedVolume);
        
        this.audioElement.volume = normalizedVolume;
        
        // 💾 Guardar volumen en localStorage
        try {
          localStorage.setItem('streamflow_volume', normalizedVolume.toString());
          console.log('[Player UseCase] 💾 Volumen guardado en localStorage:', normalizedVolume);
        } catch (storageError) {
          console.warn('[Player UseCase] ⚠️ No se pudo guardar volumen en localStorage:', storageError);
        }
        
        console.log('[Player UseCase] ✅ Volumen configurado en audio element:', this.audioElement.volume);
        
        this.updatePlaybackState({ volume: normalizedVolume });
        
        console.log('[Player UseCase] ✅ Volumen actualizado en estado:', normalizedVolume);
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
      isLoading: currentState.isLoading,
      hasAudioElement: !!this.audioElement,
      audioElementSrc: this.audioElement?.src,
      audioPaused: this.audioElement?.paused
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
    
    console.log(`[Player UseCase] 🔄 DECISIÓN: isPlaying=${currentState.isPlaying} -> ${currentState.isPlaying ? 'PAUSAR' : 'REPRODUCIR'}`);
    
    if (currentState.isPlaying) {
      console.log('[Player UseCase] ⏸️ EJECUTANDO: pauseSong()');
      this.pauseSong();
    } else {
      console.log('[Player UseCase] ▶️ EJECUTANDO: Lógica de reproducción');
      // Si hay canción pero no está reproduciéndose, intentar reanudar
      if (this.audioElement) {
        // Verificar si el audio tiene la fuente correcta
        const expectedUrl = this.getAudioUrl(currentState.currentSong);
        console.log('[Player UseCase] 🔍 Verificando URL:', {
          currentSrc: this.audioElement.src,
          expectedUrl: expectedUrl,
          urlsMatch: this.audioElement.src === expectedUrl
        });
        
        if (this.audioElement.src !== expectedUrl) {
          // Si la fuente no coincide, reproducir desde el inicio
          console.log('[Player UseCase] 🔄 Fuente incorrecta, ejecutando playSong()');
          this.playSong(currentState.currentSong);
        } else {
          // Si la fuente es correcta, reanudar
          console.log('[Player UseCase] ▶️ Fuente correcta, ejecutando resumeSong()');
          this.resumeSong();
        }
      } else {
        // Si no hay audio element, reproducir desde el inicio
        console.log('[Player UseCase] ❌ No hay audio element, ejecutando playSong()');
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
    console.log('[Player UseCase] 📊 Seeking to percentage:', percentage);
    
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

  /**
   * MÉTODO ULTRA AGRESIVO: Inicia limpieza periódica de audios duplicados
   */
  private startAggressiveCleanup(): void {
    console.log('[Player UseCase] 🧹 Iniciando limpieza agresiva periódica cada 2 segundos');
    
    this.cleanupInterval = setInterval(() => {
      try {
        const allAudioElements = document.querySelectorAll('audio');
        if (allAudioElements.length > 1) {
          console.log(`[Player UseCase] 🚨 LIMPIEZA PERIÓDICA: Detectados ${allAudioElements.length} audios - iniciando destrucción`);
          this.pauseAllOtherAudios();
          this.detectMultiplePlayingAudios();
        }
      } catch (error) {
        console.error('[Player UseCase] ❌ Error en limpieza periódica:', error);
      }
    }, 2000); // Cada 2 segundos
  }

  /**
   * 🚨 INTERCEPTOR CORREGIDO: PERMITE SOLO 1 AUDIO REAL
   * Este método intercepta el constructor nativo de Audio y previene duplicados
   */
  private interceptAudioCreation(): void {
    console.log('[Player UseCase] 🚨 INTERCEPTOR CORREGIDO: Bloqueando creación de nuevos audios');
    
    // Guardar el constructor original
    const OriginalAudio = (window as any).Audio;
    let audioCreationCount = 0;
    const playerInstance = this; // Capturar la instancia correcta
    
    // INTERCEPTAR el constructor de Audio
    (window as any).Audio = function(...args: any[]) {
      audioCreationCount++;
      console.warn(`🚨 INTENTO DE CREAR AUDIO #${audioCreationCount}`);
      
      // PERMITIR SOLO EL PRIMER AUDIO (nuestro audio principal)
      if (audioCreationCount === 1) {
        console.log(`✅ PERMITIDO: Creando audio principal #${audioCreationCount}`);
        return new OriginalAudio(...args);
      }
      
      // BLOQUEAR cualquier audio adicional
      console.error(`❌ BLOQUEADO: Intento de crear audio duplicado #${audioCreationCount}`);
      
      // Devolver un audio FALSO que no puede reproducir nada
      const fakeAudio = {
        play: () => {
          console.error('🚫 AUDIO FALSO: Reproducción bloqueada');
          return Promise.reject('Audio creation blocked - duplicate detected');
        },
        pause: () => console.log('🚫 AUDIO FALSO: Pausa bloqueada'),
        load: () => console.log('🚫 AUDIO FALSO: Load bloqueado'),
        addEventListener: () => {},
        removeEventListener: () => {},
        set src(value) { console.error('🚫 AUDIO FALSO: src bloqueado:', value); },
        get src() { return ''; },
        set volume(value) { console.log('🚫 AUDIO FALSO: volume bloqueado'); },
        get volume() { return 0; },
        set currentTime(value) { console.log('🚫 AUDIO FALSO: currentTime bloqueado'); },
        get currentTime() { return 0; },
        set muted(value) { console.log('🚫 AUDIO FALSO: muted bloqueado'); },
        get muted() { return true; },
        get paused() { return true; },
        get duration() { return 0; },
        get readyState() { return 0; },
        get networkState() { return 0; },
        style: { display: 'none' },
        parentNode: null,
        remove: () => {},
        setAttribute: () => {},
        getAttribute: () => null
      };
      
      return fakeAudio;
    };
    
    // Mantener las propiedades del constructor original
    Object.setPrototypeOf((window as any).Audio, OriginalAudio);
    Object.defineProperty((window as any).Audio, 'prototype', {
      value: OriginalAudio.prototype,
      writable: false
    });
  }
  private startUltraAggressiveMonitoring(): void {
    console.log('[Player UseCase] 🚨 Iniciando monitoreo OPTIMIZADO cada 1 segundo');
    
    this.ultraAggressiveInterval = setInterval(() => {
      try {
        const allAudioElements = document.querySelectorAll('audio');
        
        // Solo actuar si hay MÁS de 1 audio
        if (allAudioElements.length > 1) {
          console.log(`🚨 DETECTADOS ${allAudioElements.length} audios - iniciando limpieza`);
          
          // ELIMINAR TODOS los audios excepto nuestro elemento principal
          let removedCount = 0;
          allAudioElements.forEach((audio, index) => {
            if (audio !== this.audioElement) {
              try {
                // DESTRUIR COMPLETAMENTE
                audio.pause();
                audio.currentTime = 0;
                audio.volume = 0;
                audio.muted = true;
                audio.src = '';
                audio.load();
                
                // REMOVER DEL DOM INMEDIATAMENTE
                if (audio.parentNode) {
                  audio.parentNode.removeChild(audio);
                  removedCount++;
                  console.log(`💀 Audio intruso ${index + 1} REMOVIDO del DOM`);
                }
              } catch (error) {
                console.error(`❌ Error eliminando audio ${index + 1}:`, error);
              }
            }
          });
          
          if (removedCount > 0) {
            console.log(`🗑️ LIMPIEZA: Removidos ${removedCount} audios intrusos`);
          }
        }
        
      } catch (error) {
        console.error('[Player UseCase] ❌ Error en monitoreo optimizado:', error);
      }
    }, 1000); // ⚡ CADA 1 SEGUNDO - MÁS RAZONABLE
  }

  /**
   * Detener limpieza periódica (para cuando se destruya el servicio)
   */
  private stopAggressiveCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
      console.log('[Player UseCase] 🛑 Limpieza periódica detenida');
    }
    
    if (this.ultraAggressiveInterval) {
      clearInterval(this.ultraAggressiveInterval);
      this.ultraAggressiveInterval = null;
      console.log('[Player UseCase] 🛑 Monitoreo ultra agresivo detenido');
    }
  }

  /**
   * Método de destrucción para limpiar recursos
   */
  ngOnDestroy(): void {
    this.stopAggressiveCleanup();
    this.removeAudioEventListeners();
  }
}
