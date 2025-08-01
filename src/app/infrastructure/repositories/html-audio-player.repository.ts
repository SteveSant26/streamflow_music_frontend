import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, Subject, interval, takeWhile } from 'rxjs';
import { IPlayerRepository } from '../../domain/repositories/player.repository.interface';
import { Song } from '../../domain/entities/song.entity';
import { Playlist } from '../../domain/entities/playlist.entity';
import { PlayerState } from '../../domain/entities/player-state.entity';

@Injectable({
  providedIn: 'root'
})
export class HtmlAudioPlayerRepository implements IPlayerRepository {
  private audio: HTMLAudioElement | null = null;
  private readonly playerStateSubject = new BehaviorSubject<PlayerState>(this.getInitialPlayerState());
  private readonly currentTimeSubject = new BehaviorSubject<number>(0);
  private readonly durationSubject = new BehaviorSubject<number>(0);
  private readonly isPlayingSubject = new BehaviorSubject<boolean>(false);
  private readonly volumeSubject = new BehaviorSubject<number>(1);
  private readonly progressSubject = new BehaviorSubject<number>(0);
  private readonly songEndSubject = new Subject<void>();
  private readonly errorSubject = new Subject<string>();

  private currentPlaylist: Playlist | null = null;
  private currentSongIndex = 0;
  private repeatMode: 'none' | 'one' | 'all' = 'none';
  private isShuffleEnabled = false;
  private originalPlaylistOrder: Song[] = [];
  private readonly isBrowser: boolean;

  // Bound event listeners for proper removal
  private readonly onLoadStart = () => {
    this.updatePlayerState({ isLoading: true });
  };

  private readonly onCanPlay = () => {
    this.updatePlayerState({ isLoading: false });
    this.durationSubject.next(this.audio?.duration || 0);
  };

  private readonly onPlay = () => {
    this.isPlayingSubject.next(true);
    this.updatePlayerState({ isPlaying: true });
  };

  private readonly onPause = () => {
    this.isPlayingSubject.next(false);
    this.updatePlayerState({ isPlaying: false });
  };

  private readonly onEnded = () => {
    this.handleSongEnd();
  };

  private readonly onAudioError = (e: Event) => {
    console.error('Audio error event:', e);
    const audioElement = e.target as HTMLAudioElement;
    
    if (audioElement?.error) {
      const errorCode = audioElement.error.code;
      const errorMessage = this.getAudioErrorMessage(errorCode);
      console.error(`Audio error (${errorCode}): ${errorMessage}`);
      console.error('Audio src:', audioElement.src);
      
      // Only emit error if it's not an empty src or invalid data URL
      if (audioElement.src && !audioElement.src.startsWith('data:')) {
        this.errorSubject.next(`Failed to play audio`);
      }
    }
    
    this.updatePlayerState({ isLoading: false });
  };

  private getAudioErrorMessage(errorCode: number): string {
    switch (errorCode) {
      case 1: return 'MEDIA_ERR_ABORTED - The audio download was aborted';
      case 2: return 'MEDIA_ERR_NETWORK - A network error occurred while downloading';
      case 3: return 'MEDIA_ERR_DECODE - An error occurred while decoding the audio';
      case 4: return 'MEDIA_ERR_SRC_NOT_SUPPORTED - The audio format is not supported';
      default: return 'Unknown error';
    }
  }

  private readonly onVolumeChange = () => {
    if (!this.audio) return;
    this.volumeSubject.next(this.audio.volume);
    this.updatePlayerState({ 
      volume: this.audio.volume,
      isMuted: this.audio.muted 
    });
  };

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    
    if (this.isBrowser) {
      this.audio = new Audio();
      this.setupAudioEventListeners();
      this.startTimeUpdater();
    }
  }

  // Method to set external audio element from component
  setAudioElement(audioElement: HTMLAudioElement): void {
    if (this.audio && this.audio !== audioElement) {
      // Remove listeners from old audio element if it exists
      this.removeAudioEventListeners();
    }
    
    this.audio = audioElement;
    
    // Don't set any src initially - let loadSong handle it when needed
    // This prevents invalid audio format errors
    
    this.setupAudioEventListeners();
    
    // Sync current state with the new audio element
    if (this.audio) {
      this.audio.volume = this.volumeSubject.value;
      const currentState = this.playerStateSubject.value;
      if (currentState.currentSong) {
        // If there's already a current song, load it properly
        this.loadSong(currentState.currentSong).catch(error => {
          console.error('Failed to load current song:', error);
        });
      }
    }
  }

  private removeAudioEventListeners(): void {
    if (!this.audio) return;
    
    // Remove all event listeners
    this.audio.removeEventListener('loadstart', this.onLoadStart);
    this.audio.removeEventListener('canplay', this.onCanPlay);
    this.audio.removeEventListener('play', this.onPlay);
    this.audio.removeEventListener('pause', this.onPause);
    this.audio.removeEventListener('ended', this.onEnded);
    this.audio.removeEventListener('error', this.onAudioError);
    this.audio.removeEventListener('volumechange', this.onVolumeChange);
  }

  private getInitialPlayerState(): PlayerState {
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

  private setupAudioEventListeners(): void {
    if (!this.audio) return;

    this.audio.addEventListener('loadstart', this.onLoadStart);
    this.audio.addEventListener('canplay', this.onCanPlay);
    this.audio.addEventListener('play', this.onPlay);
    this.audio.addEventListener('pause', this.onPause);
    this.audio.addEventListener('ended', this.onEnded);
    this.audio.addEventListener('error', this.onAudioError);
    this.audio.addEventListener('volumechange', this.onVolumeChange);
  }

  private startTimeUpdater(): void {
    if (!this.isBrowser) return;
    
    interval(100).pipe(
      takeWhile(() => true)
    ).subscribe(() => {
      if (this.audio && !this.audio.paused && !this.audio.seeking) {
        const currentTime = this.audio.currentTime;
        const duration = this.audio.duration || 0;
        const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

        this.currentTimeSubject.next(currentTime);
        this.progressSubject.next(progress);
        this.updatePlayerState({ 
          currentTime, 
          duration, 
          progress 
        });
      }
    });
  }

  private updatePlayerState(updates: Partial<PlayerState>): void {
    const currentState = this.playerStateSubject.value;
    const newState = { ...currentState, ...updates };
    this.playerStateSubject.next(newState);
  }

  private handleSongEnd(): void {
    this.songEndSubject.next();
    
    switch (this.repeatMode) {
      case 'one':
        // Repeat current song
        this.play().catch(error => {
          console.error('Failed to repeat song:', error);
        });
        break;
      case 'all':
        // Go to next song, or loop back to first
        this.nextSong().catch(error => {
          console.error('Failed to play next song:', error);
        });
        break;
      case 'none':
      default:
        // Just go to next song if available
        if (this.hasNextSong()) {
          this.nextSong().catch(error => {
            console.error('Failed to play next song:', error);
          });
        }
        break;
    }
  }

  private hasNextSong(): boolean {
    if (!this.currentPlaylist) return false;
    return this.currentSongIndex < this.currentPlaylist.songs.length - 1;
  }

  private hasPreviousSong(): boolean {
    return this.currentSongIndex > 0;
  }

  // Audio Control Implementation
  async play(): Promise<void> {
    if (!this.audio) {
      throw new Error('Audio not available');
    }

    try {
      await this.audio.play();
    } catch (error) {
      this.errorSubject.next('Failed to play audio');
      throw error;
    }
  }

  pause(): void {
    if (!this.audio) return;
    this.audio.pause();
  }

  stop(): void {
    if (!this.audio) return;
    this.audio.pause();
    this.audio.currentTime = 0;
  }

  async loadSong(song: Song): Promise<void> {
    if (!this.audio) {
      throw new Error('Audio not available');
    }

    return new Promise((resolve, reject) => {
      // Determine the correct audio file extension based on song ID
      let audioUrl = '';
      if (song.id === 'TheNightWeMet') {
        audioUrl = `/assets/music/${song.id}.mp3`;
      } else {
        audioUrl = `/assets/music/${song.id}.wav`;
      }
      
      this.audio!.src = audioUrl;
      this.updatePlayerState({ 
        currentSong: song, 
        isLoading: true 
      });

      const onCanPlay = () => {
        this.audio!.removeEventListener('canplay', onCanPlay);
        this.audio!.removeEventListener('error', onError);
        this.updatePlayerState({ isLoading: false });
        resolve();
      };

      const onError = (event: Event) => {
        this.audio!.removeEventListener('canplay', onCanPlay);
        this.audio!.removeEventListener('error', onError);
        
        console.error(`Failed to load audio file: ${audioUrl}`);
        
        // Don't set fallback audio, just reject with clear error
        this.updatePlayerState({ 
          isLoading: false,
          currentSong: null
        });
        reject(new Error(`Failed to load audio file: ${audioUrl}`));
      };

      this.audio!.addEventListener('canplay', onCanPlay);
      this.audio!.addEventListener('error', onError);
      this.audio!.load(); // Force load
    });
  }

  // Volume Control Implementation
  setVolume(volume: number): void {
    if (!this.audio) return;
    this.audio.volume = Math.max(0, Math.min(1, volume));
  }

  mute(): void {
    if (!this.audio) return;
    this.audio.muted = true;
  }

  unmute(): void {
    if (!this.audio) return;
    this.audio.muted = false;
  }

  // Seek Control Implementation
  seekTo(time: number): void {
    if (!this.audio?.duration) return;
    this.audio.currentTime = Math.max(0, Math.min(time, this.audio.duration));
  }

  // State Observables Implementation
  getPlayerState(): Observable<PlayerState> {
    return this.playerStateSubject.asObservable();
  }

  getCurrentTime(): Observable<number> {
    return this.currentTimeSubject.asObservable();
  }

  getDuration(): Observable<number> {
    return this.durationSubject.asObservable();
  }

  getIsPlaying(): Observable<boolean> {
    return this.isPlayingSubject.asObservable();
  }

  getVolume(): Observable<number> {
    return this.volumeSubject.asObservable();
  }

  getProgress(): Observable<number> {
    return this.progressSubject.asObservable();
  }

  // Playlist Management Implementation
  setPlaylist(playlist: Playlist): void {
    this.currentPlaylist = playlist;
    this.originalPlaylistOrder = [...playlist.songs];
    this.currentSongIndex = 0;
  }

  async nextSong(): Promise<void> {
    if (!this.currentPlaylist) return;

    if (this.hasNextSong()) {
      this.currentSongIndex++;
    } else if (this.repeatMode === 'all') {
      this.currentSongIndex = 0;
    } else {
      return; // No next song available
    }

    const nextSong = this.currentPlaylist.songs[this.currentSongIndex];
    await this.loadSong(nextSong);
    await this.play();
  }

  async previousSong(): Promise<void> {
    if (!this.currentPlaylist || !this.audio) return;

    // If more than 3 seconds have passed, restart current song
    if (this.audio.currentTime > 3) {
      this.audio.currentTime = 0;
    } else if (this.hasPreviousSong()) {
      this.currentSongIndex--;
      const previousSong = this.currentPlaylist.songs[this.currentSongIndex];
      await this.loadSong(previousSong);
      await this.play();
    }
  }

  shufflePlaylist(): void {
    if (!this.currentPlaylist) return;

    if (this.isShuffleEnabled) {
      // Un-shuffle: restore original order
      this.currentPlaylist.songs = [...this.originalPlaylistOrder];
      this.isShuffleEnabled = false;
    } else {
      // Shuffle: randomize order
      const currentSong = this.currentPlaylist.songs[this.currentSongIndex];
      const shuffled = [...this.currentPlaylist.songs];
      
      // Fisher-Yates shuffle algorithm
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }

      this.currentPlaylist.songs = shuffled;
      this.currentSongIndex = shuffled.findIndex(song => song.id === currentSong.id);
      this.isShuffleEnabled = true;
    }

    this.updatePlayerState({ isShuffleEnabled: this.isShuffleEnabled });
  }

  setRepeatMode(mode: 'none' | 'one' | 'all'): void {
    this.repeatMode = mode;
    this.updatePlayerState({ repeatMode: mode });
  }

  // Event Observables Implementation
  onSongEnd(): Observable<void> {
    return this.songEndSubject.asObservable();
  }

  onError(): Observable<string> {
    return this.errorSubject.asObservable();
  }
}
