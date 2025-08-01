import { Injectable, Inject } from '@angular/core';
import { IPlayerRepository } from '../repositories/player.repository.interface';
import { Song } from '../entities/song.entity';
import { Playlist } from '../entities/playlist.entity';
import { PlayerState } from '../entities/player-state.entity';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayerUseCase {
  constructor(@Inject('IPlayerRepository') private readonly playerRepository: IPlayerRepository) {}

  // Audio Control Use Cases
  async playSong(song: Song): Promise<void> {
    await this.playerRepository.loadSong(song);
    await this.playerRepository.play();
  }

  pauseMusic(): void {
    this.playerRepository.pause();
  }

  resumeMusic(): Promise<void> {
    return this.playerRepository.play();
  }

  stopMusic(): void {
    this.playerRepository.stop();
  }

  // Volume Control Use Cases
  adjustVolume(volume: number): void {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    this.playerRepository.setVolume(clampedVolume);
  }

  toggleMute(): void {
    const currentVolume = this.getVolume();
    // We'll need to track mute state - for now just toggle between 0 and a default
    if (currentVolume === 0) {
      this.playerRepository.unmute();
    } else {
      this.playerRepository.mute();
    }
  }

  // Seek Control Use Cases
  seekToTime(time: number): void {
    this.playerRepository.seekTo(time);
  }

  seekToPercentage(percentage: number): void {
    const duration = this.getDuration();
    const time = (percentage / 100) * duration;
    this.playerRepository.seekTo(time);
  }

  // Playlist Management Use Cases
  loadPlaylist(playlist: Playlist): void {
    this.playerRepository.setPlaylist(playlist);
  }

  async playNext(): Promise<void> {
    await this.playerRepository.nextSong();
  }

  async playPrevious(): Promise<void> {
    await this.playerRepository.previousSong();
  }

  enableShuffle(): void {
    this.playerRepository.shufflePlaylist();
  }

  setRepeat(mode: 'none' | 'one' | 'all'): void {
    this.playerRepository.setRepeatMode(mode);
  }

  // State Access Use Cases
  getPlayerState(): Observable<PlayerState> {
    return this.playerRepository.getPlayerState();
  }

  getCurrentTime(): number {
    // This would need to be synchronous for immediate access
    // The repository should maintain current state
    return 0; // Placeholder - implement proper state access
  }

  getDuration(): number {
    // This would need to be synchronous for immediate access
    return 0; // Placeholder - implement proper state access
  }

  getVolume(): number {
    // This would need to be synchronous for immediate access
    return 1; // Placeholder - implement proper state access
  }

  // Observable State Access
  getCurrentTimeStream(): Observable<number> {
    return this.playerRepository.getCurrentTime();
  }

  getDurationStream(): Observable<number> {
    return this.playerRepository.getDuration();
  }

  getIsPlayingStream(): Observable<boolean> {
    return this.playerRepository.getIsPlaying();
  }

  getVolumeStream(): Observable<number> {
    return this.playerRepository.getVolume();
  }

  getProgressStream(): Observable<number> {
    return this.playerRepository.getProgress();
  }

  // Event Handling Use Cases
  onSongEnd(): Observable<void> {
    return this.playerRepository.onSongEnd();
  }

  onError(): Observable<string> {
    return this.playerRepository.onError();
  }
}
