import { Injectable } from '@angular/core';
import { Song } from '../entities/song.entity';
import { Playlist } from '../entities/playlist.entity';
import { PlayerState } from '../entities/player-state.entity';
import { Observable, BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayerUseCase {
  private audio: HTMLAudioElement | null = null;
  private readonly playerStateSubject = new BehaviorSubject<PlayerState>(this.getInitialPlayerState());
  private currentPlaylist: Playlist | null = null;
  private currentSongIndex = 0;
  private readonly songEndSubject = new Subject<void>();
  private readonly errorSubject = new Subject<string>();

  constructor() {}

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

  // Audio Element Setup
  setAudioElement(audioElement: HTMLAudioElement): void {
    this.audio = audioElement;
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    if (!this.audio) return;

    // Set up event listeners for real-time updates
    this.audio.addEventListener('loadedmetadata', () => {
      if (this.audio) {
        const duration = this.audio.duration || 0;
        this.updatePlayerState({ duration });
      }
    });

    this.audio.addEventListener('timeupdate', () => {
      if (this.audio) {
        const currentTime = this.audio.currentTime;
        const duration = this.audio.duration || 0;
        const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
        
        this.updatePlayerState({
          currentTime,
          duration,
          progress
        });
      }
    });

    this.audio.addEventListener('play', () => {
      this.updatePlayerState({ isPlaying: true });
    });

    this.audio.addEventListener('pause', () => {
      this.updatePlayerState({ isPlaying: false });
    });

    this.audio.addEventListener('ended', () => {
      this.songEndSubject.next();
      this.handleSongEnd();
    });

    this.audio.addEventListener('volumechange', () => {
      if (this.audio) {
        this.updatePlayerState({ 
          volume: this.audio.volume,
          isMuted: this.audio.muted 
        });
      }
    });

    this.audio.addEventListener('error', (e) => {
      console.error('Audio error:', e);
      this.errorSubject.next('Failed to play audio');
      this.updatePlayerState({ isLoading: false });
    });
  }

  private updatePlayerState(updates: Partial<PlayerState>): void {
    const currentState = this.playerStateSubject.value;
    this.playerStateSubject.next({ ...currentState, ...updates });
  }

  private handleSongEnd(): void {
    const currentState = this.playerStateSubject.value;
    
    if (currentState.repeatMode === 'one') {
      // Repeat current song
      this.play().catch(error => console.error('Failed to repeat song:', error));
    } else if (this.hasNextSong() || currentState.repeatMode === 'all') {
      // Play next song
      this.playNext().catch(error => console.error('Failed to play next song:', error));
    }
  }

  private hasNextSong(): boolean {
    return this.currentPlaylist !== null && this.currentSongIndex < this.currentPlaylist.songs.length - 1;
  }

  private hasPreviousSong(): boolean {
    return this.currentSongIndex > 0;
  }

  // Audio Control
  async playSong(song: Song): Promise<void> {
    if (!this.audio) throw new Error('Audio element not set');
    
    // Map song IDs to their correct file formats
    let audioUrl: string;
    switch (song.id) {
      case '1':
      case '2':
      case 'TheNightWeMet':
        audioUrl = `/assets/music/${song.id}.mp3`;
        break;
      case '3':
        audioUrl = `/assets/music/${song.id}.wav`;
        break;
      default:
        audioUrl = `/assets/music/${song.id}.mp3`; // Default to mp3
    }
    
    this.audio.src = audioUrl;
    this.updatePlayerState({ 
      currentSong: song,
      isLoading: true 
    });
    
    try {
      await this.audio.play();
      this.updatePlayerState({ isLoading: false });
    } catch (error) {
      this.updatePlayerState({ isLoading: false });
      this.errorSubject.next('Failed to play audio');
      throw error;
    }
  }

  pause(): void {
    if (!this.audio) return;
    this.audio.pause();
  }

  pauseMusic(): void {
    this.pause();
  }

  async play(): Promise<void> {
    if (!this.audio) throw new Error('Audio element not set');
    await this.audio.play();
  }

  async resumeMusic(): Promise<void> {
    return this.play();
  }

  stop(): void {
    if (!this.audio) return;
    this.audio.pause();
    this.audio.currentTime = 0;
  }

  // Playlist methods
  loadPlaylist(playlist: Playlist): void {
    this.currentPlaylist = playlist;
    this.currentSongIndex = 0;
    if (playlist.songs.length > 0) {
      const currentState = this.playerStateSubject.value;
      this.playerStateSubject.next({ ...currentState, currentSong: playlist.songs[0] });
    }
  }

  async playNext(): Promise<void> {
    if (!this.currentPlaylist) {
      console.log('No playlist loaded');
      return;
    }

    if (this.hasNextSong()) {
      this.currentSongIndex++;
    } else if (this.playerStateSubject.value.repeatMode === 'all') {
      this.currentSongIndex = 0; // Loop back to first song
    } else {
      console.log('No next song available');
      return;
    }

    const nextSong = this.currentPlaylist.songs[this.currentSongIndex];
    await this.playSong(nextSong);
  }

  async playPrevious(): Promise<void> {
    if (!this.currentPlaylist) {
      console.log('No playlist loaded');
      return;
    }

    // If more than 3 seconds have passed, restart current song
    if (this.audio && this.audio.currentTime > 3) {
      this.audio.currentTime = 0;
      return;
    }

    if (this.hasPreviousSong()) {
      this.currentSongIndex--;
      const previousSong = this.currentPlaylist.songs[this.currentSongIndex];
      await this.playSong(previousSong);
    } else {
      console.log('No previous song available');
    }
  }

  // Volume Control
  setVolume(volume: number): void {
    if (!this.audio) return;
    const clampedVolume = Math.max(0, Math.min(1, volume));
    this.audio.volume = clampedVolume;
    // State will be updated automatically by volumechange event listener
  }

  adjustVolume(volume: number): void {
    this.setVolume(volume);
  }

  toggleMute(): void {
    if (!this.audio) return;
    this.audio.muted = !this.audio.muted;
    // State will be updated automatically by volumechange event listener
  }

  // Repeat and Shuffle
  setRepeat(mode: 'none' | 'one' | 'all'): void {
    this.updatePlayerState({ repeatMode: mode });
  }

  enableShuffle(): void {
    const currentState = this.playerStateSubject.value;
    this.updatePlayerState({ isShuffleEnabled: !currentState.isShuffleEnabled });
  }

  // Seek Control
  seekTo(time: number): void {
    if (!this.audio?.duration) return;
    const clampedTime = Math.max(0, Math.min(time, this.audio.duration));
    this.audio.currentTime = clampedTime;
    // State will be updated automatically by timeupdate event listener
  }

  seekToPercentage(percentage: number): void {
    if (!this.audio?.duration) return;
    const time = (percentage / 100) * this.audio.duration;
    this.seekTo(time);
  }

  // State Getters
  getPlayerState(): Observable<PlayerState> {
    return this.playerStateSubject.asObservable();
  }

  getCurrentSong(): Song | null {
    return this.playerStateSubject.value.currentSong;
  }

  getCurrentTime(): number {
    return this.audio?.currentTime || 0;
  }

  getDuration(): number {
    return this.audio?.duration || 0;
  }

  getVolume(): number {
    return this.audio?.volume || 1;
  }

  getIsPlaying(): boolean {
    return this.audio ? !this.audio.paused : false;
  }

  getIsMuted(): boolean {
    return this.audio?.muted || false;
  }

  getProgress(): number {
    if (!this.audio?.duration) return 0;
    return (this.audio.currentTime / this.audio.duration) * 100;
  }

  // Event Observables
  onSongEnd(): Observable<void> {
    return this.songEndSubject.asObservable();
  }

  onError(): Observable<string> {
    return this.errorSubject.asObservable();
  }
}
