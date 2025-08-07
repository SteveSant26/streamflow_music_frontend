import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PlayerUseCase } from '../../domain/usecases';
import { MusicLibraryService } from './music-library.service';
import { PlayerState } from '../../domain/entities/player-state.entity';
import { PlaybackPersistenceService, PlaybackState } from './playback-persistence.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GlobalPlayerStateService {
  private isInitialized = false;
  private audioElement: HTMLAudioElement | null = null;
  private lastKnownState: PlayerState | null = null;
  private lastKnownCurrentTime = 0;
  private lastKnownIsPlaying = false;
  private preservedState: {
    currentTime: number;
    isPlaying: boolean;
    volume: number;
    src: string;
  } | null = null;

  constructor(
    private readonly playerUseCase: PlayerUseCase,
    private readonly musicLibraryService: MusicLibraryService,
    private readonly playbackPersistence: PlaybackPersistenceService,
    @Inject(PLATFORM_ID) private readonly platformId: object,
  ) {
    console.log('🔴 GlobalPlayerStateService constructor called');

    // Subscribe to player state changes to keep track of the last known state
    if (isPlatformBrowser(this.platformId)) {
      this.playerUseCase.getPlayerState().subscribe((state: any) => {
        this.lastKnownState = state;

        // Track important state values
        if (state.currentTime > 0) {
          this.lastKnownCurrentTime = state.currentTime;
        }
        this.lastKnownIsPlaying = state.isPlaying;

        // 🚨 DESACTIVADO: Las detecciones automáticas causan bucles infinitos
        // Solo guardamos el estado, NO hacemos restauraciones automáticas
      });
    }
  }

  /**
   * Initialize the global player state - should be called once in the app
   */
  async initializePlayer(): Promise<void> {
    if (this.isInitialized && this.audioElement && !this.audioElement.error) {
      console.log('Player already initialized with working audio element');
      return;
    }

    // Only initialize audio in browser environment
    if (!isPlatformBrowser(this.platformId)) {
      console.log('Skipping audio initialization on server');
      this.isInitialized = true;
      return;
    }

    try {
      // Only create audio element if we don't have one or if current one is broken
      if (!this.audioElement || this.audioElement.error) {
        console.log('Creating new audio element');
        this.audioElement = new Audio();
        this.audioElement.preload = 'metadata';

        // Set up critical preservation listeners BEFORE setting to PlayerUseCase
        this.setupAudioPreservationListeners();

        // Set up auto-persistence for localStorage
        this.setupAutoPersistence();

        this.playerUseCase.setAudioElement(this.audioElement);

        console.log('Audio element created and set to PlayerUseCase');
      } else {
        console.log(
          'Using existing audio element - calling setAudioElement for sync',
        );
        // Still call setAudioElement to ensure sync, but it won't replace the element
        this.playerUseCase.setAudioElement(this.audioElement);
      }

      // No cargamos una playlist por defecto
      // Las playlists se crearán cuando el usuario reproduzca música
      console.log('🎧 Reproductor listo para recibir música del contexto');

      // Intentar restaurar estado persistido automáticamente
      this.tryAutoRestoreState();

      this.isInitialized = true;
      console.log('Global player state initialized');
    } catch (error) {
      console.error('Failed to initialize global player state:', error);
    }
  }

  /**
   * Set audio element reference from any component - NEVER REPLACE WORKING AUDIO
   */
  setAudioElement(audioElement: HTMLAudioElement): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    console.log('🔴 setAudioElement called');

    // CRITICAL: If we have a working audio element, NEVER replace it
    if (
      this.audioElement &&
      !this.audioElement.error &&
      this.audioElement.readyState >= 1 &&
      this.audioElement.src &&
      this.audioElement.currentTime >= 0
    ) {
      console.log(
        '🛡️ PROTECTING existing audio element - REFUSING replacement',
      );

      // Just sync the PlayerUseCase without changing the audio element
      this.playerUseCase.setAudioElement(this.audioElement);
      return;
    }

    // Preserve state from current audio element before replacing
    if (this.audioElement && this.audioElement.src) {
      this.preservedState = {
        currentTime: this.audioElement.currentTime,
        isPlaying: !this.audioElement.paused,
        volume: this.audioElement.volume,
        src: this.audioElement.src,
      };
      console.log(
        '🔄 Preserved state before audio element change:',
        this.preservedState,
      );
    }

    console.log('🔄 Setting new audio element');
    this.audioElement = audioElement;
    this.playerUseCase.setAudioElement(audioElement);

    // Restore preserved state if we have it
    if (this.preservedState) {
      setTimeout(() => this.restoreFromPreservedState(), 100);
    }

    // If we have a last known state, try to restore it
    if (this.lastKnownState?.currentSong) {
      console.log('🔄 Restoring player state after audio element change');
      setTimeout(() => this.restorePlayerState(), 200);
    }
  }

  /**
   * Get the current player state
   */
  getPlayerState(): PlayerState {
    return this.playerUseCase.getCurrentPlayerState();
  }

  /**
   * Get player state as Observable for subscriptions
   */
  getPlayerState$(): Observable<PlayerState> {
    return this.playerUseCase.getPlayerState();
  }

  /**
   * Force all components to sync with current state
   */
  forceSyncAllComponents(): void {
    console.log('Forcing sync of all components');
    this.playerUseCase.forceStateSync();
  }

  /**
   * Get the PlayerUseCase instance for direct control
   */
  getPlayerUseCase(): PlayerUseCase {
    return this.playerUseCase;
  }

  /**
   * Check if player is initialized
   */
  isPlayerInitialized(): boolean {
    return this.isInitialized && this.audioElement !== null;
  }

  /**
   * Force initialization check and setup with emergency recovery
   */
  ensureInitialized(): void {
    if (!this.isInitialized) {
      console.log('🔴 Player not initialized, initializing...');
      this.initializePlayer();

      // Try emergency recovery after initialization
      setTimeout(() => {
        this.playerUseCase.emergencyStateRecovery();
      }, 500);
    } else if (this.audioElement?.error) {
      // If audio element has an error, reinitialize
      console.log('🚨 Audio element has error, reinitializing...');
      this.isInitialized = false;
      this.audioElement = null;
      this.initializePlayer();

      // Try emergency recovery after reinitialization
      setTimeout(() => {
        this.playerUseCase.emergencyStateRecovery();
      }, 500);
    } else if (!this.audioElement) {
      // If we lost the audio element somehow
      console.log('🚨 Audio element lost, reinitializing...');
      this.isInitialized = false;
      this.initializePlayer();

      setTimeout(() => {
        this.playerUseCase.emergencyStateRecovery();
      }, 500);
    }
  }

  /**
   * ULTRA CRITICAL: Call this before any navigation to preserve audio state
   */
  preserveStateForNavigation(): void {
    console.log('🔴 ULTRA CRITICAL: Preserving state for navigation...');

    // Force preserve current state in PlayerUseCase with emergency backup
    this.playerUseCase.preserveCurrentState();

    // Keep a backup of critical audio element properties
    if (this.audioElement && !this.audioElement.error) {
      this.lastKnownCurrentTime = this.audioElement.currentTime;
      this.lastKnownIsPlaying = !this.audioElement.paused;

      // Update our preserved state
      this.preservedState = {
        currentTime: this.audioElement.currentTime,
        isPlaying: !this.audioElement.paused,
        volume: this.audioElement.volume,
        src: this.audioElement.src,
      };

      console.log('🔄 Navigation state preserved:', {
        currentTime: this.lastKnownCurrentTime,
        isPlaying: this.lastKnownIsPlaying,
        src: this.audioElement.src.substring(
          this.audioElement.src.lastIndexOf('/') + 1,
        ),
        readyState: this.audioElement.readyState,
      });
    }

    // Force immediate sync to ensure all components have the latest state
    this.forceSyncAllComponents();
  }

  private getDefaultPlayerState(): PlayerState {
    return {
      currentSong: null,
      isPlaying: false,
      volume: 1,
      currentTime: 0,
      duration: 0,
      progress: 0,
      isLoading: false,
      isMuted: false,
      repeatMode: 'none',
      isShuffleEnabled: false,
    };
  }

  /**
   * Restore the last known player state after navigation
   */
  private restorePlayerState(): void {
    if (!this.lastKnownState?.currentSong || !this.audioElement) {
      return;
    }

    try {
      // Don't restore if the current song is already loaded correctly
      if (this.audioElement.src === this.lastKnownState.currentSong.file_url) {
        console.log('Audio source already correct, skipping restore');
        return;
      }

      console.log('Restoring player state...', {
        song: this.lastKnownState.currentSong.title,
        currentTime: this.lastKnownState.currentTime,
        volume: this.lastKnownState.volume,
        isPlaying: this.lastKnownState.isPlaying,
      });

      // Pause first to avoid conflicts
      this.audioElement.pause();

      // Set the audio source to the current song
      this.audioElement.src = this.lastKnownState.currentSong.file_url || '';

      // Wait for metadata to load before setting currentTime
      const handleLoadedMetadata = () => {
        if (this.audioElement && this.lastKnownState) {
          this.audioElement.currentTime = this.lastKnownState.currentTime;
          this.audioElement.volume = this.lastKnownState.volume;

          // If it was playing, resume playback
          if (this.lastKnownState.isPlaying) {
            this.audioElement.play().catch((error) => {
              console.error('Error resuming music:', error);
            });
          }
        }
        this.audioElement?.removeEventListener(
          'loadedmetadata',
          handleLoadedMetadata,
        );
      };

      this.audioElement.addEventListener(
        'loadedmetadata',
        handleLoadedMetadata,
      );

      // Force load the audio
      this.audioElement.load();

      console.log('Player state restore initiated');
    } catch (error) {
      console.error('Error restoring player state:', error);
    }
  }

  /**
   * Set up critical audio preservation listeners to prevent state loss
   */
  private setupAudioPreservationListeners(): void {
    if (!this.audioElement) return;

    // Preserve current state whenever audio time changes significantly
    this.audioElement.addEventListener('timeupdate', () => {
      if (this.audioElement && this.audioElement.currentTime > 0) {
        this.lastKnownCurrentTime = this.audioElement.currentTime;
        this.lastKnownIsPlaying = !this.audioElement.paused;
      }
    });

    // Preserve state when audio starts playing
    this.audioElement.addEventListener('play', () => {
      this.lastKnownIsPlaying = true;
    });

    // Preserve state when audio is paused
    this.audioElement.addEventListener('pause', () => {
      this.lastKnownIsPlaying = false;
    });

    // Prevent audio element from being garbage collected
    this.audioElement.addEventListener('ended', () => {
      // Keep the element alive even after song ends
      console.log('Song ended, but preserving audio element');
    });

    console.log('Audio preservation listeners set up');
  }

  /**
   * Monitor audio element - DESACTIVADO para prevenir bucles
   */
  private monitorAudioElement(): void {
    // Esta función está desactivada porque causaba bucles infinitos
    // El PlayerUseCase maneja la estabilidad del audio por sí mismo
    console.log('� Audio monitoring desactivado - PlayerUseCase maneja estabilidad');
  }

  /**
   * Emergency state restoration - DESACTIVADO para prevenir bucles
   */
  private emergencyStateRestore(): void {
    console.log('🚨 EMERGENCY STATE RESTORE DESACTIVADO - Previniendo bucles infinitos');
    // Esta función está desactivada porque causaba bucles infinitos
    // El PlayerUseCase maneja la estabilidad del audio por sí mismo
  }

  /**
   * Restore from preserved state after audio element change
   */
  private restoreFromPreservedState(): void {
    if (!this.preservedState || !this.audioElement) return;

    console.log('🔄 Restoring from preserved state:', this.preservedState);

    try {
      this.audioElement.src = this.preservedState.src;
      this.audioElement.volume = this.preservedState.volume;

      const handleLoadedMetadata = () => {
        if (this.audioElement && this.preservedState) {
          this.audioElement.currentTime = this.preservedState.currentTime;

          if (this.preservedState.isPlaying) {
            this.audioElement.play().catch((error) => {
              console.error(
                'Error resuming music from preserved state:',
                error,
              );
            });
          }
        }
        this.audioElement?.removeEventListener(
          'loadedmetadata',
          handleLoadedMetadata,
        );
      };

      this.audioElement.addEventListener(
        'loadedmetadata',
        handleLoadedMetadata,
      );
      this.audioElement.load();
    } catch (error) {
      console.error('Error restoring from preserved state:', error);
    }
  }

  /**
   * Guarda el estado actual en localStorage
   */
  saveCurrentState(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      const currentState = this.getPlayerState();
      
      if (currentState.currentSong) {
        // Obtener información de la playlist actual desde PlayerUseCase
        const currentQueue = this.playerUseCase.getCurrentQueue();
        const currentQueueIndex = this.playerUseCase.getCurrentQueueIndex();
        
        let playlistInfo = null;
        if (currentQueue.length > 0) {
          playlistInfo = {
            id: `queue-${Date.now()}`,
            name: 'Current Queue',
            songs: currentQueue,
            currentIndex: currentQueueIndex
          };
        }
        
        const playbackState: PlaybackState = {
          currentSong: {
            id: currentState.currentSong.id,
            title: currentState.currentSong.title,
            artist_name: currentState.currentSong.artist_name || 'Unknown Artist',
            album: currentState.currentSong.album,
            thumbnail_url: currentState.currentSong.thumbnail_url,
            file_url: currentState.currentSong.file_url
          },
          currentPlaylist: playlistInfo,
          playbackPosition: {
            currentTime: currentState.currentTime,
            duration: currentState.duration,
            progress: currentState.progress
          },
          playerSettings: {
            volume: currentState.volume,
            isPlaying: currentState.isPlaying,
            isShuffle: currentState.isShuffleEnabled,
            isRepeat: currentState.repeatMode !== 'none'
          },
          timestamp: Date.now()
        };

        this.playbackPersistence.savePlaybackState(playbackState);
        console.log('🎵 Estado guardado con playlist:', {
          song: currentState.currentSong.title,
          queueLength: currentQueue.length,
          currentIndex: currentQueueIndex
        });
      }
    } catch (error) {
      console.error('Error guardando estado:', error);
    }
  }

  /**
   * Restaura el estado desde localStorage
   */
  async restorePersistedState(): Promise<boolean> {
    if (!isPlatformBrowser(this.platformId)) return false;

    try {
      const persistedState = this.playbackPersistence.getPersistedState();
      if (!persistedState?.currentSong) {
        return false;
      }

      console.log('🔄 Restaurando estado persistido:', {
        song: persistedState.currentSong.title,
        hasPlaylist: !!persistedState.currentPlaylist,
        playlistLength: persistedState.currentPlaylist?.songs?.length || 0
      });

      // Si hay una playlist, restaurarla completa
      if (persistedState.currentPlaylist && persistedState.currentPlaylist.songs.length > 0) {
        const songs = persistedState.currentPlaylist.songs;
        const currentIndex = persistedState.currentPlaylist.currentIndex || 0;
        
        console.log(`🎵 Restaurando playlist con ${songs.length} canciones, índice: ${currentIndex}`);
        
        // Usar playPlaylist para restaurar la queue completa
        this.playerUseCase.playPlaylist(
          songs as any[],
          currentIndex,
          persistedState.currentPlaylist.name || 'Restored Playlist'
        );
      } else {
        // Solo restaurar la canción individual
        console.log('🎵 Restaurando canción individual');
        this.playerUseCase.playSong(persistedState.currentSong as any);
      }

      // Esperar un momento para que se cargue la canción
      setTimeout(() => {
        if (this.audioElement) {
          // Restaurar posición de reproducción
          this.audioElement.currentTime = persistedState.playbackPosition.currentTime;
          
          // Restaurar configuración
          this.playerUseCase.setVolume(persistedState.playerSettings.volume);
          
          // No auto-reproducir hasta que el usuario confirme
          if (this.audioElement.autoplay) {
            this.audioElement.pause();
          }
          
          console.log('✅ Estado completo restaurado - canción y posición');
        }
      }, 1000);

      console.log('🔄 Estado restaurado desde localStorage');
      return true;
    } catch (error) {
      console.error('Error restaurando estado:', error);
      return false;
    }
  }

  /**
   * Verifica si hay una sesión guardada válida
   */
  hasValidPersistedSession(): boolean {
    return this.playbackPersistence.hasValidSession();
  }

  /**
   * Obtiene información de la última sesión
   */
  getLastSessionInfo() {
    return this.playbackPersistence.getLastSessionInfo();
  }

  /**
   * Limpia el estado persistido
   */
  clearPersistedState(): void {
    this.playbackPersistence.clearPersistedState();
  }

  /**
   * Intenta restaurar automáticamente el estado al inicializar
   */
  private tryAutoRestoreState(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Esperar un momento para que se inicialice completamente
    setTimeout(() => {
      if (this.hasValidPersistedSession()) {
        console.log('🔄 Estado persistido encontrado, restaurando automáticamente...');
        this.restorePersistedStateQuietly();
      }
    }, 500);
  }

  /**
   * Restaura el estado sin mostrar diálogos ni reproducir automáticamente
   */
  private async restorePersistedStateQuietly(): Promise<void> {
    try {
      const persistedState = this.playbackPersistence.getPersistedState();
      if (!persistedState?.currentSong) {
        return;
      }

      // Restaurar la canción sin reproducir
      this.playerUseCase.playSong(persistedState.currentSong as any);

      // Esperar a que se cargue y configurar
      setTimeout(() => {
        if (this.audioElement) {
          // Restaurar posición de reproducción
          this.audioElement.currentTime = persistedState.playbackPosition.currentTime;
          
          // Restaurar configuración
          this.playerUseCase.setVolume(persistedState.playerSettings.volume);
          
          // Asegurar que NO se reproduzca automáticamente
          this.audioElement.pause();
          
          // Actualizar el estado visual
          this.playerUseCase.forceStateSync();
          
          console.log('🎵 Estado restaurado silenciosamente desde localStorage');
        }
      }, 1000);

    } catch (error) {
      console.error('Error restaurando estado silenciosamente:', error);
    }
  }

  /**
   * Configura listeners automáticos para guardar estado
   */
  private setupAutoPersistence(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Guardar estado cada vez que cambie algo significativo
    this.playerUseCase.getPlayerState().subscribe((state: PlayerState) => {
      // Solo guardar si hay una canción reproduciéndose
      if (state.currentSong && state.currentTime > 5) { // Después de 5 segundos
        this.saveCurrentState();
      }
    });

    // Guardar estado cuando se cierre la página
    window.addEventListener('beforeunload', () => {
      this.saveCurrentState();
    });

    // Guardar estado periódicamente durante la reproducción
    setInterval(() => {
      const state = this.getPlayerState();
      if (state.isPlaying && state.currentTime > 0) {
        this.playbackPersistence.savePlaybackPosition(
          state.currentTime,
          state.duration
        );
      }
    }, 10000); // Cada 10 segundos
  }
}
