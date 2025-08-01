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
  private readonly instanceId = Math.random().toString(36).substring(2, 11);

  constructor() {
    console.log(`PlayerUseCase instance created with ID: ${this.instanceId}`);
  }

  private getInitialPlayerState(): PlayerState {
    // Load volume from localStorage if available
    let savedVolume = 1;
    if (typeof localStorage !== 'undefined') {
      const volumeStr = localStorage.getItem('streamflow-music-volume');
      if (volumeStr) {
        savedVolume = Math.max(0, Math.min(1, parseFloat(volumeStr)));
      }
    }
    
    return {
      currentSong: null,
      isPlaying: false,
      volume: savedVolume,
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
    // If we already have a working audio element, DON'T replace it
    if (this.audio && !this.audio.error && this.audio.src) {
      console.log(`[${this.instanceId}] Audio element already exists and working, keeping current one`);
      
      // Just ensure volume is synced
      const currentState = this.playerStateSubject.value;
      this.audio.volume = currentState.volume;
      return;
    }
    
    console.log(`[${this.instanceId}] Setting new audio element`);
    this.audio = audioElement;
    
    // Apply saved volume to audio element
    const currentState = this.playerStateSubject.value;
    this.audio.volume = currentState.volume;
    
    // Restore any existing source if we have a current song
    if (currentState.currentSong?.audioUrl) {
      this.audio.src = currentState.currentSong.audioUrl;
      console.log(`[${this.instanceId}] Restored audio source: ${currentState.currentSong.audioUrl}`);
    }
    
    this.setupEventListeners();
    
    console.log(`[${this.instanceId}] Audio element set with volume: ${currentState.volume}`);
  }

  private setupEventListeners(): void {
    if (!this.audio) return;

    // Remove existing listeners to prevent duplicates
    this.audio.removeEventListener('loadedmetadata', this.handleLoadedMetadata);
    this.audio.removeEventListener('timeupdate', this.handleTimeUpdate);
    this.audio.removeEventListener('play', this.handlePlay);
    this.audio.removeEventListener('pause', this.handlePause);
    this.audio.removeEventListener('ended', this.handleEnded);
    this.audio.removeEventListener('volumechange', this.handleVolumeChange);
    this.audio.removeEventListener('error', this.handleAudioError);

    // Set up event listeners for real-time updates
    this.audio.addEventListener('loadedmetadata', this.handleLoadedMetadata);
    this.audio.addEventListener('timeupdate', this.handleTimeUpdate);
    this.audio.addEventListener('play', this.handlePlay);
    this.audio.addEventListener('pause', this.handlePause);
    this.audio.addEventListener('ended', this.handleEnded);
    this.audio.addEventListener('volumechange', this.handleVolumeChange);
    this.audio.addEventListener('error', this.handleAudioError);
    
    console.log(`[${this.instanceId}] Event listeners set up`);
  }

  private readonly handleLoadedMetadata = () => {
    if (this.audio) {
      const duration = this.audio.duration || 0;
      this.updatePlayerState({ duration });
      console.log(`[${this.instanceId}] Metadata loaded, duration: ${duration}`);
    }
  };

  private readonly handleTimeUpdate = () => {
    if (this.audio) {
      const currentTime = this.audio.currentTime;
      const duration = this.audio.duration || 0;
      const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
      
      // Only update if values actually changed significantly to prevent spam
      const currentState = this.playerStateSubject.value;
      if (Math.abs(currentState.currentTime - currentTime) > 1.0 || 
          Math.abs(currentState.progress - progress) > 0.5) {
        this.updatePlayerState({
          currentTime,
          duration,
          progress
        });
      }
    }
  };

  private readonly handlePlay = () => {
    this.updatePlayerState({ isPlaying: true });
    console.log(`[${this.instanceId}] Audio play event triggered`);
  };

  private readonly handlePause = () => {
    this.updatePlayerState({ isPlaying: false });
    console.log(`[${this.instanceId}] Audio pause event triggered`);
  };

  private readonly handleEnded = () => {
    this.songEndSubject.next();
    this.handleSongEnd();
    console.log(`[${this.instanceId}] Audio ended event triggered`);
  };

  private readonly handleVolumeChange = () => {
    if (this.audio) {
      this.updatePlayerState({ 
        volume: this.audio.volume,
        isMuted: this.audio.muted 
      });
      console.log(`[${this.instanceId}] Volume change event: ${this.audio.volume}`);
    }
  };

  private readonly handleAudioError = (e: Event) => {
    console.error(`[${this.instanceId}] Audio error:`, e);
    this.errorSubject.next('Failed to play audio');
    this.updatePlayerState({ isLoading: false });
  };

  private updatePlayerState(updates: Partial<PlayerState>): void {
    const currentState = this.playerStateSubject.value;
    const newState = { ...currentState, ...updates };
    this.playerStateSubject.next(newState);
    console.log(`[${this.instanceId}] Player state updated:`, newState);
  }

  /**
   * Public method to force state synchronization across all components
   */
  public forceStateSync(): void {
    const currentState = this.playerStateSubject.value;
    this.playerStateSubject.next({ ...currentState });
    console.log(`[${this.instanceId}] Forced state sync:`, currentState);
  }

  /**
   * Preserve current audio state (time, playing status) before navigation
   */
  public preserveCurrentState(): void {
    if (!this.audio) return;
    
    const currentTime = this.audio.currentTime;
    const duration = this.audio.duration || 0;
    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
    const isPlaying = !this.audio.paused;
    
    console.log(`[${this.instanceId}] Preserving state - time: ${currentTime}, playing: ${isPlaying}`);
    
    this.updatePlayerState({
      currentTime,
      duration,
      progress,
      isPlaying
    });
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
    
    // Use the dynamic audioUrl from the song entity
    this.audio.src = song.audioUrl;
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
    
    console.log(`[${this.instanceId}] Pause called - setting audio.pause()`);
    this.audio.pause();
    
    // DON'T update state here - let the event listener handle it
  }

  pauseMusic(): void {
    this.pause();
  }

  async play(): Promise<void> {
    if (!this.audio) throw new Error('Audio element not set');
    
    console.log(`[${this.instanceId}] Play called - setting audio.play()`);
    await this.audio.play();
    
    // DON'T update state here - let the event listener handle it
  }

  async resumeMusic(): Promise<void> {
    return this.play();
  }

  // ===== CENTRALIZED CONTROL METHODS =====
  // These are the ONLY methods components should call for play/pause
  
  /**
   * CENTRALIZED toggle play/pause - Use this from ALL components
   */
  public togglePlayPause(): void {
    const currentState = this.playerStateSubject.value;
    console.log(`[${this.instanceId}] togglePlayPause called - current isPlaying: ${currentState.isPlaying}`);
    
    if (currentState.isPlaying) {
      this.pause();
    } else {
      this.play().catch(error => {
        console.error(`[${this.instanceId}] Error in togglePlayPause:`, error);
      });
    }
  }

  /**
   * CENTRALIZED pause - Use this from ALL components
   */
  public pauseFromComponent(): void {
    console.log(`[${this.instanceId}] pauseFromComponent called`);
    this.pause();
  }

  /**
   * CENTRALIZED play - Use this from ALL components
   */
  public playFromComponent(): void {
    console.log(`[${this.instanceId}] playFromComponent called`);
    this.play().catch(error => {
      console.error(`[${this.instanceId}] Error in playFromComponent:`, error);
    });
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
    
    console.log(`[${this.instanceId}] Setting volume to ${clampedVolume}`);
    this.audio.volume = clampedVolume;
    
    // Save to localStorage
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('streamflow-music-volume', clampedVolume.toString());
    }
    
    // DON'T update state here - let the volumechange event handle it
  }

  adjustVolume(volume: number): void {
    this.setVolume(volume);
  }

  toggleMute(): void {
    if (!this.audio) return;
    
    console.log(`[${this.instanceId}] Toggling mute`);
    this.audio.muted = !this.audio.muted;
    
    // DON'T update state here - let the volumechange event handle it
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
    
    console.log(`[${this.instanceId}] Seeking to ${clampedTime}s`);
    this.audio.currentTime = clampedTime;
    
    // DON'T update state here - let the timeupdate event handle it
  }

  seekToPercentage(percentage: number): void {
    if (!this.audio?.duration) return;
    const time = (percentage / 100) * this.audio.duration;
    this.seekTo(time);
    console.log(`[${this.instanceId}] Seeking to ${percentage}% (${time}s)`);
  }

  // State Getters
  getPlayerState(): Observable<PlayerState> {
    return this.playerStateSubject.asObservable();
  }

  getCurrentPlayerState(): PlayerState {
    return this.playerStateSubject.value;
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
