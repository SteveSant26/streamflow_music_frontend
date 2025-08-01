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

  constructor(
    private readonly playerUseCase: PlayerUseCase,
    private readonly musicLibraryService: MusicLibraryService,
    @Inject(PLATFORM_ID) private readonly platformId: Object
  ) {
    // Subscribe to player state changes to keep track of the last known state
    if (isPlatformBrowser(this.platformId)) {
      this.playerUseCase.getPlayerState().subscribe(state => {
        this.lastKnownState = state;
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
      // Create audio element if not exists
      if (!this.audioElement) {
        this.audioElement = new Audio();
        this.audioElement.preload = 'metadata';
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
      // Set the audio source to the current song
      this.audioElement.src = this.lastKnownState.currentSong.audioUrl;
      this.audioElement.currentTime = this.lastKnownState.currentTime;
      this.audioElement.volume = this.lastKnownState.volume;
      
      // If it was playing, resume playback
      if (this.lastKnownState.isPlaying) {
        this.audioElement.play().catch(error => {
          console.error('Error resuming music:', error);
        });
      }
      
      console.log('Player state restored successfully');
    } catch (error) {
      console.error('Error restoring player state:', error);
    }
  }
}
