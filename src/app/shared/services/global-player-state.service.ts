import { Injectable } from '@angular/core';
import { PlayerUseCase } from '../../domain/use-cases/player.use-case';
import { MusicLibraryService } from './music-library.service';
import { PlayerState } from '../../domain/entities/player-state.entity';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalPlayerStateService {
  private isInitialized = false;
  private audioElement: HTMLAudioElement | null = null;

  constructor(
    private readonly playerUseCase: PlayerUseCase,
    private readonly musicLibraryService: MusicLibraryService
  ) {}

  /**
   * Initialize the global player state - should be called once in the app
   */
  async initializePlayer(): Promise<void> {
    if (this.isInitialized) {
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
    if (!this.audioElement) {
      this.audioElement = audioElement;
      this.playerUseCase.setAudioElement(audioElement);
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
}
