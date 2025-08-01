import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, Subject, interval, map, takeWhile } from 'rxjs';
import { IPlayerRepository } from '../../domain/repositories/player.repository.interface';
import { Song } from '../../domain/entities/song.entity';
import { Playlist } from '../../domain/entities/playlist.entity';
import { PlayerState } from '../../domain/entities/player-state.entity';

@Injectable({
  providedIn: 'root'
})
export class HtmlAudioPlayerRepository implements IPlayerRepository {
  private audio: HTMLAudioElement | null = null;
  private playerStateSubject = new BehaviorSubject<PlayerState>(this.getInitialPlayerState());
  private currentTimeSubject = new BehaviorSubject<number>(0);
  private durationSubject = new BehaviorSubject<number>(0);
  private isPlayingSubject = new BehaviorSubject<boolean>(false);
  private volumeSubject = new BehaviorSubject<number>(1);
  private progressSubject = new BehaviorSubject<number>(0);
  private songEndSubject = new Subject<void>();
  private errorSubject = new Subject<string>();

  private currentPlaylist: Playlist | null = null;
  private currentSongIndex = 0;
  private repeatMode: 'none' | 'one' | 'all' = 'none';
  private isShuffleEnabled = false;
  private originalPlaylistOrder: Song[] = [];
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    
    if (this.isBrowser) {
      this.audio = new Audio();
      this.setupAudioEventListeners();
      this.startTimeUpdater();
    }
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

    this.audio.addEventListener('loadstart', () => {
      this.updatePlayerState({ isLoading: true });
    });

    this.audio.addEventListener('canplay', () => {
      this.updatePlayerState({ isLoading: false });
      this.durationSubject.next(this.audio?.duration || 0);
    });

    this.audio.addEventListener('play', () => {
      this.isPlayingSubject.next(true);
      this.updatePlayerState({ isPlaying: true });
    });

    this.audio.addEventListener('pause', () => {
      this.isPlayingSubject.next(false);
      this.updatePlayerState({ isPlaying: false });
    });

    this.audio.addEventListener('ended', () => {
      this.handleSongEnd();
    });

    this.audio.addEventListener('error', (e) => {
      this.errorSubject.next('Error loading audio file');
      this.updatePlayerState({ isLoading: false });
    });

    this.audio.addEventListener('volumechange', () => {
      if (!this.audio) return;
      this.volumeSubject.next(this.audio.volume);
      this.updatePlayerState({ 
        volume: this.audio.volume,
        isMuted: this.audio.muted 
      });
    });
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
        if (this.audio) {
          this.audio.currentTime = 0;
          this.play();
        }
        break;
      case 'all':
        this.nextSong();
        break;
      default:
        if (this.hasNextSong()) {
          this.nextSong();
        }
        break;
    }
  }

  private hasNextSong(): boolean {
    return !!(this.currentPlaylist && this.currentSongIndex < this.currentPlaylist.songs.length - 1);
  }

  private hasPreviousSong(): boolean {
    return !!(this.currentPlaylist && this.currentSongIndex > 0);
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
    this.updatePlayerState({ isPlaying: false, currentTime: 0, progress: 0 });
  }

  async loadSong(song: Song): Promise<void> {
    if (!this.audio) {
      throw new Error('Audio not available');
    }

    return new Promise((resolve, reject) => {
      // Use online sample audio files for demo
      const audioSources: Record<string, string> = {
        'sample1': 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        'sample2': 'https://www.soundjay.com/misc/sounds/bell-ringing-01.wav',
        'test-song': 'https://www.soundjay.com/misc/sounds/bell-ringing-02.wav'
      };

      // Use demo audio URL or fallback to local file
      const audioUrl = audioSources[song.id] || `/assets/music/${song.id}.mp3`;
      
      this.audio!.src = audioUrl;
      this.updatePlayerState({ 
        currentSong: song, 
        isLoading: true 
      });

      const onCanPlay = () => {
        this.audio!.removeEventListener('canplay', onCanPlay);
        this.audio!.removeEventListener('error', onError);
        resolve();
      };

      const onError = () => {
        this.audio!.removeEventListener('canplay', onCanPlay);
        this.audio!.removeEventListener('error', onError);
        
        // Try fallback to a silent audio data URL if online sources fail
        const silentAudio = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeBzyR2vLmfTAFKH/L8N2QQAoUSLPn8KhVFApGnt/yvmMcBz2S2/Lffi8FKH/M89+PQAoUUrDn8KlSFgtHpODttmQcBzuR2fLdfS8FK4DJ8d+PQAoUU7Dn8KhSFgtHpd/ttmQcBjiS2vLdfS8FKH/L8N2QQAoUT7Ln8KpTFwpJouHvvmUdBkK';
        
        this.audio!.src = silentAudio;
        this.updatePlayerState({ isLoading: false });
        console.warn(`Using silent audio for song: ${song.title}`);
        resolve();
      };

      this.audio!.addEventListener('canplay', onCanPlay);
      this.audio!.addEventListener('error', onError);
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
      return;
    }

    const nextSong = this.currentPlaylist.songs[this.currentSongIndex];
    await this.loadSong(nextSong);
    await this.play();
  }

  async previousSong(): Promise<void> {
    if (!this.currentPlaylist || !this.audio) return;

    if (this.audio.currentTime > 3) {
      // If more than 3 seconds into the song, restart current song
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
      // Restore original order
      this.currentPlaylist.songs = [...this.originalPlaylistOrder];
      this.isShuffleEnabled = false;
    } else {
      // Shuffle the playlist
      const currentSong = this.currentPlaylist.songs[this.currentSongIndex];
      const shuffled = [...this.currentPlaylist.songs];
      
      // Fisher-Yates shuffle
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

  // Events Implementation
  onSongEnd(): Observable<void> {
    return this.songEndSubject.asObservable();
  }

  onError(): Observable<string> {
    return this.errorSubject.asObservable();
  }
}
