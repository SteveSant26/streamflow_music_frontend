import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PlayerUseCase } from '../../domain/use-cases/player.use-case';
import { MusicLibraryService } from './music-library.service';
import { PlayerState } from '../../domain/entities/player-state.entity';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalPlayerStateService {
  private isInitialized = false;
  private audioElement: HTMLAudioElement | null = null;
  private lastKnownState: PlayerState | null = null;
  private readonly VOLUME_STORAGE_KEY = 'streamflow-music-volume';

  constructor(
    private readonly playerUseCase: PlayerUseCase,
    private readonly musicLibraryService: MusicLibraryService,
    @Inject(PLATFORM_ID) private readonly platformId: Object
  ) {
    // Subscribe to player state changes to keep track of the last known state
    if (isPlatformBrowser(this.platformId)) {
      this.playerUseCase.getPlayerState().subscribe(state => {
        this.lastKnownState = state;
        // Save volume to localStorage whenever it changes
        this.saveVolumeToStorage(state.volume);
      });
    }
  }

  /**
   * Initialize the global player state - should be called once in the app
   */
  async initializePlayer(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    // Only initialize audio in browser environment
    if (!isPlatformBrowser(this.platformId)) {
      console.log('Skipping audio initialization on server');
      this.isInitialized = true;
      return;
    }

    try {
      // Create audio element if not exists or if current one is broken
      if (!this.audioElement || this.audioElement.error) {
        console.log('Creating new audio element');
        this.audioElement = new Audio();
        this.audioElement.preload = 'metadata';
        
        // Load volume from localStorage
        const savedVolume = this.loadVolumeFromStorage();
        this.audioElement.volume = savedVolume;
        
        this.playerUseCase.setAudioElement(this.audioElement);
        
        // Set the initial volume in the player use case
        this.playerUseCase.setVolume(savedVolume);
      } else {
        console.log('Using existing audio element');
      }

      // Load default playlist if no playlist is loaded
      const currentState = this.getPlayerState();
      if (!currentState.currentSong) {
        const defaultPlaylist = this.musicLibraryService.getDefaultPlaylist();
        if (defaultPlaylist && defaultPlaylist.songs.length > 0) {
          this.playerUseCase.loadPlaylist(defaultPlaylist);
        }
      }

      this.isInitialized = true;
      console.log('Global player state initialized');
    } catch (error) {
      console.error('Failed to initialize global player state:', error);
    }
  }

  /**
   * Set audio element reference from any component
   */
  setAudioElement(audioElement: HTMLAudioElement): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    
    // Only set if we don't have an audio element yet, or if the current one is broken
    if (!this.audioElement || this.audioElement.error) {
      console.log('Setting new audio element');
      this.audioElement = audioElement;
      this.playerUseCase.setAudioElement(audioElement);
      
      // If we have a last known state, try to restore it
      if (this.lastKnownState?.currentSong) {
        console.log('Restoring player state after navigation');
        this.restorePlayerState();
      }
    } else {
      console.log('Audio element already set and working, ignoring new one');
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
   * Force initialization check and setup
   */
  ensureInitialized(): void {
    if (!this.isInitialized) {
      this.initializePlayer();
    } else if (this.audioElement?.error) {
      // If audio element has an error, reinitialize
      console.log('Audio element has error, reinitializing...');
      this.isInitialized = false;
      this.audioElement = null;
      this.initializePlayer();
    }
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
      isShuffleEnabled: false
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
      if (this.audioElement.src === this.lastKnownState.currentSong.audioUrl) {
        console.log('Audio source already correct, skipping restore');
        return;
      }

      console.log('Restoring player state...', {
        song: this.lastKnownState.currentSong.title,
        currentTime: this.lastKnownState.currentTime,
        volume: this.lastKnownState.volume,
        isPlaying: this.lastKnownState.isPlaying
      });

      // Pause first to avoid conflicts
      this.audioElement.pause();
      
      // Set the audio source to the current song
      this.audioElement.src = this.lastKnownState.currentSong.audioUrl;
      
      // Wait for metadata to load before setting currentTime
      const handleLoadedMetadata = () => {
        if (this.audioElement && this.lastKnownState) {
          this.audioElement.currentTime = this.lastKnownState.currentTime;
          this.audioElement.volume = this.lastKnownState.volume;
          
          // If it was playing, resume playback
          if (this.lastKnownState.isPlaying) {
            this.audioElement.play().catch(error => {
              console.error('Error resuming music:', error);
            });
          }
        }
        this.audioElement?.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };

      this.audioElement.addEventListener('loadedmetadata', handleLoadedMetadata);
      
      // Force load the audio
      this.audioElement.load();
      
      console.log('Player state restore initiated');
    } catch (error) {
      console.error('Error restoring player state:', error);
    }
  }

  /**
   * Save volume to localStorage
   */
  private saveVolumeToStorage(volume: number): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    
    try {
      localStorage.setItem(this.VOLUME_STORAGE_KEY, volume.toString());
    } catch (error) {
      console.error('Error saving volume to localStorage:', error);
    }
  }

  /**
   * Load volume from localStorage
   */
  private loadVolumeFromStorage(): number {
    if (!isPlatformBrowser(this.platformId)) {
      return 0.5; // Default volume
    }
    
    try {
      const savedVolume = localStorage.getItem(this.VOLUME_STORAGE_KEY);
      if (savedVolume !== null) {
        const volume = parseFloat(savedVolume);
        // Ensure volume is between 0 and 1
        return Math.max(0, Math.min(1, volume));
      }
    } catch (error) {
      console.error('Error loading volume from localStorage:', error);
    }
    
    return 0.5; // Default volume
  }
}
