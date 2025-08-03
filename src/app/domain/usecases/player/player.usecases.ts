import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Song } from '../../entities/song.entity';

export interface PlaybackState {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number; // Will convert from string to number
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

  getCurrentSong(): Observable<Song | null> {
    return this.currentSong$.asObservable();
  }

  getPlaybackState(): Observable<PlaybackState> {
    return this.playbackState$.asObservable();
  }

  playSong(song: Song): void {
    this.currentSong$.next(song);
    this.updatePlaybackState({ 
      isPlaying: true, 
      duration: song.durationSeconds || 0, 
      currentTime: 0 
    });
  }

  pauseSong(): void {
    this.updatePlaybackState({ isPlaying: false });
  }

  resumeSong(): void {
    this.updatePlaybackState({ isPlaying: true });
  }

  seekTo(time: number): void {
    this.updatePlaybackState({ currentTime: time });
  }

  setVolume(volume: number): void {
    this.updatePlaybackState({ volume: Math.max(0, Math.min(1, volume)) });
  }

  toggleMute(): void {
    const currentState = this.playbackState$.value;
    this.updatePlaybackState({ isMuted: !currentState.isMuted });
  }

  setRepeatMode(mode: 'none' | 'one' | 'all'): void {
    this.updatePlaybackState({ repeatMode: mode });
  }

  toggleShuffle(): void {
    const currentState = this.playbackState$.value;
    this.updatePlaybackState({ isShuffleEnabled: !currentState.isShuffleEnabled });
  }

  updateCurrentTime(time: number): void {
    this.updatePlaybackState({ currentTime: time });
  }

  private updatePlaybackState(updates: Partial<PlaybackState>): void {
    const currentState = this.playbackState$.value;
    this.playbackState$.next({ ...currentState, ...updates });
  }

  // Audio element management
  setAudioElement(audioElement: HTMLAudioElement): void {
    // Implementation for setting audio element reference
    console.log('Audio element set:', audioElement);
  }

  // Event observables for component subscriptions
  onSongEnd(): Observable<void> {
    // Implementation for song end events
    return new Observable(observer => {
      // Placeholder implementation
      observer.next();
    });
  }

  onError(): Observable<any> {
    // Implementation for error events
    return new Observable(observer => {
      // Placeholder implementation - would emit errors from audio playback
      observer.error('Audio playback error');
    });
  }

  // Additional methods needed by services
  getPlayerState(): Observable<PlaybackState> {
    return this.playbackState$.asObservable();
  }

  getCurrentPlayerState(): PlaybackState {
    return this.playbackState$.value;
  }

  loadPlaylist(playlist: Song[]): void {
    // Implementation for loading playlist
    console.log('Loading playlist:', playlist);
  }

  forceStateSync(): void {
    // Implementation for forcing state synchronization
    console.log('Forcing state sync');
  }

  emergencyStateRecovery(): void {
    // Implementation for emergency state recovery
    console.log('Emergency state recovery');
  }

  preserveCurrentState(): void {
    // Implementation for preserving current state
    console.log('Preserving current state');
  }

  // Player control methods needed by components
  togglePlayPause(): void {
    const currentState = this.playbackState$.value;
    this.updatePlaybackState({ isPlaying: !currentState.isPlaying });
  }

  async playPrevious(): Promise<void> {
    // Implementation for playing previous song
    console.log('Playing previous song');
  }

  async playNext(): Promise<void> {
    // Implementation for playing next song
    console.log('Playing next song');
  }

  seekToPercentage(percentage: number): void {
    const currentState = this.playbackState$.value;
    const newTime = (percentage / 100) * currentState.duration;
    this.updatePlaybackState({ currentTime: newTime });
  }
}
