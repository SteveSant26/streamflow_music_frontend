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
  private lastKnownCurrentTime = 0;
  private lastKnownIsPlaying = false;

  constructor(
    private readonly playerUseCase: PlayerUseCase,
    private readonly musicLibraryService: MusicLibraryService,
    @Inject(PLATFORM_ID) private readonly platformId: Object
  ) {
    // Subscribe to player state changes to keep track of the last known state
    if (isPlatformBrowser(this.platformId)) {
      this.playerUseCase.getPlayerState().subscribe(state => {
        this.lastKnownState = state;
        
        // Track important state values
        if (state.currentTime > 0) {
          this.lastKnownCurrentTime = state.currentTime;
        }
        this.lastKnownIsPlaying = state.isPlaying;
        
        // Detect if state was reset unexpectedly and restore
        if (state.currentTime === 0 && state.duration === 0 && 
            this.lastKnownCurrentTime > 10 && state.currentSong) {
          console.log('Detected state reset, attempting to restore...');
          setTimeout(() => this.restorePlayerState(), 100);
        }
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
        
        this.playerUseCase.setAudioElement(this.audioElement);
        
        console.log('Audio element created and set to PlayerUseCase');
      } else {
        console.log('Using existing audio element - calling setAudioElement for sync');
        // Still call setAudioElement to ensure sync, but it won't replace the element
        this.playerUseCase.setAudioElement(this.audioElement);
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
}
