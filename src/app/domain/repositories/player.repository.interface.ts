import { Observable } from 'rxjs';
import { Song } from '../entities/song.entity';
import { Playlist } from '../entities/playlist.entity';
import { PlayerState } from '../entities/player-state.entity';

export interface IPlayerRepository {
  // Audio Element Management
  setAudioElement?(audioElement: HTMLAudioElement): void;
  
  // Audio Control
  play(): Promise<void>;
  pause(): void;
  stop(): void;
  loadSong(song: Song): Promise<void>;
  
  // Volume Control
  setVolume(volume: number): void;
  mute(): void;
  unmute(): void;
  
  // Seek Control
  seekTo(time: number): void;
  
  // State Observables
  getPlayerState(): Observable<PlayerState>;
  getCurrentTime(): Observable<number>;
  getDuration(): Observable<number>;
  getIsPlaying(): Observable<boolean>;
  getVolume(): Observable<number>;
  getProgress(): Observable<number>;
  
  // Playlist Management
  setPlaylist(playlist: Playlist): void;
  nextSong(): Promise<void>;
  previousSong(): Promise<void>;
  shufflePlaylist(): void;
  setRepeatMode(mode: 'none' | 'one' | 'all'): void;
  
  // Events
  onSongEnd(): Observable<void>;
  onError(): Observable<string>;
}
