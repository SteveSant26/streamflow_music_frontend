import { Injectable, inject, signal } from '@angular/core';
import { PlaylistService } from './playlist.service';
import { IncrementPlayCountUseCase } from '../../domain/usecases/song/song.usecases';
import { Song } from '../../domain/entities/song.entity';

@Injectable({ providedIn: 'root' })
export class AudioPlayerService {
  private readonly playlistService = inject(PlaylistService);
  private readonly incrementPlayCountUseCase = inject(IncrementPlayCountUseCase);

  private audioElement: HTMLAudioElement | null = null;
  private readonly playedSongs = new Set<string>(); // Para evitar duplicar play counts

  // Signals para el estado del reproductor
  readonly currentTime = signal(0);
  readonly duration = signal(0);
  readonly isLoading = signal(false);
  readonly hasError = signal(false);
  readonly volume = signal(1);

  constructor() {
    this.initializeAudioElement();
    this.subscribeToPlaylistChanges();
  }

  private initializeAudioElement(): void {
    this.audioElement = new Audio();
    this.audioElement.preload = 'metadata';

    // Event listeners
    this.audioElement.addEventListener('loadstart', () => {
      this.isLoading.set(true);
      this.hasError.set(false);
    });

    this.audioElement.addEventListener('canplay', () => {
      this.isLoading.set(false);
      this.duration.set(this.audioElement?.duration || 0);
    });

    this.audioElement.addEventListener('timeupdate', () => {
      const currentTime = this.audioElement?.currentTime || 0;
      const duration = this.audioElement?.duration || 0;
      
      this.currentTime.set(currentTime);
      this.playlistService.updatePlaybackTime(currentTime, duration);

      // Verificar si se reprodujo el 25% y marcar play count
      this.checkAndIncrementPlayCount(currentTime, duration);
    });

    this.audioElement.addEventListener('ended', () => {
      this.playlistService.nextSong();
    });

    this.audioElement.addEventListener('error', () => {
      this.isLoading.set(false);
      this.hasError.set(true);
      console.error('Error al reproducir la canción');
    });

    this.audioElement.addEventListener('volumechange', () => {
      this.volume.set(this.audioElement?.volume || 1);
    });
  }

  private subscribeToPlaylistChanges(): void {
    // Suscribirse a cambios en el estado de reproducción
    this.playlistService.playbackState$.subscribe(state => {
      if (state.currentSong && this.audioElement) {
        this.loadSong(state.currentSong);
      }

      if (this.audioElement) {
        if (state.isPlaying && this.audioElement.paused) {
          this.audioElement.play().catch(console.error);
        } else if (!state.isPlaying && !this.audioElement.paused) {
          this.audioElement.pause();
        }
      }
    });
  }

  private loadSong(song: Song): void {
    if (!this.audioElement) return;

    // Solo cargar si es una canción diferente
    if (this.audioElement.src !== song.fileUrl) {
      this.audioElement.src = song.fileUrl;
      this.audioElement.load();
      
      // Resetear el flag de play count para esta nueva canción
      this.playedSongs.delete(song.id);
    }
  }

  private checkAndIncrementPlayCount(currentTime: number, duration: number): void {
    const state = this.playlistService.getCurrentState();
    const currentSong = state.currentSong;
    
    if (!currentSong || duration === 0) return;

    // Verificar si se reprodujo el 25% de la canción
    const quarterTime = duration * 0.25;
    const hasReachedQuarter = currentTime >= quarterTime;
    
    if (hasReachedQuarter && !this.playedSongs.has(currentSong.id)) {
      // Marcar como reproducida para evitar incrementos duplicados
      this.playedSongs.add(currentSong.id);
      this.playlistService.markFirstQuarterPlayed();
      
      // Incrementar play count en el backend
      this.incrementPlayCountUseCase.execute(currentSong.id).subscribe({
        next: (newPlayCount) => {
          console.log(`Play count incrementado para "${currentSong.title}": ${newPlayCount}`);
        },
        error: (error) => {
          console.error('Error al incrementar play count:', error);
          // Remover de la lista para intentar de nuevo si es necesario
          this.playedSongs.delete(currentSong.id);
        }
      });
    }
  }

  /**
   * Controles de reproducción
   */
  play(): void {
    this.playlistService.togglePlayback();
  }

  pause(): void {
    this.playlistService.togglePlayback();
  }

  next(): void {
    this.playlistService.nextSong();
  }

  previous(): void {
    this.playlistService.previousSong();
  }

  seek(time: number): void {
    if (this.audioElement) {
      this.audioElement.currentTime = time;
    }
  }

  setVolume(volume: number): void {
    if (this.audioElement) {
      this.audioElement.volume = Math.max(0, Math.min(1, volume));
    }
  }

  mute(): void {
    if (this.audioElement) {
      this.audioElement.muted = !this.audioElement.muted;
    }
  }

  /**
   * Obtener información del estado actual
   */
  getCurrentTime(): number {
    return this.currentTime();
  }

  getDuration(): number {
    return this.duration();
  }

  getVolume(): number {
    return this.volume();
  }

  isLoadingAudio(): boolean {
    return this.isLoading();
  }

  hasAudioError(): boolean {
    return this.hasError();
  }
}
