import { Component, Input, OnInit, OnDestroy, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { PlayerUseCase } from '../../../../domain/usecases/player/player.usecases';
import { PlaylistService } from '../../../../infrastructure/services/playlist.service';
import { AudioPlayerService } from '../../../../infrastructure/services/audio-player.service';
import { Song, Playlist } from '../../../../domain/entities/song.entity';

@Component({
  selector: 'app-music-player',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatSliderModule,
    MatProgressBarModule,
    MatMenuModule,
    MatTooltipModule,
    MatBottomSheetModule
  ],
  templateUrl: './music-player.component.html',
  styleUrl: './music-player.component.css'
})
export class MusicPlayerComponent implements OnInit, OnDestroy {
  private readonly playerUseCase = inject(PlayerUseCase);
  private readonly playlistService = inject(PlaylistService);
  private readonly router = inject(Router);

  // Exponer el audioPlayerService para el template
  audioPlayer = inject(AudioPlayerService);

  // Observable para el template
  playbackState$!: Observable<any>;
  
  // Player state signals
  currentSong = signal<Song | null>(null);
  isPlaying = signal<boolean>(false);
  currentTime = signal<number>(0);
  duration = signal<number>(0);
  volume = signal<number>(1);
  isShuffleEnabled = signal<boolean>(false);
  repeatMode = signal<'none' | 'one' | 'all'>('none');
  
  // UI state
  showPlaylist = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  currentPlaylist = signal<Playlist | null>(null);

  // Computed values
  progress = computed(() => {
    const dur = this.duration();
    return dur > 0 ? (this.currentTime() / dur) * 100 : 0;
  });

  formattedCurrentTime = computed(() => this.formatTime(this.currentTime()));
  formattedDuration = computed(() => this.formatTime(this.duration()));
  
  // Adaptador para compatibilidad con el template
  playlistSongs = computed(() => this.currentPlaylist()?.items || []);

  ngOnInit() {
    // Configurar el observable para el template
    this.playbackState$ = this.playerUseCase.getPlayerState().pipe(
      map(state => ({
        currentSong: state.currentSong,
        isPlaying: state.isPlaying,
        currentTime: state.currentTime,
        duration: state.duration,
        volume: state.volume,
        isShuffleEnabled: state.isShuffleEnabled,
        repeatMode: state.repeatMode,
        isLoading: state.isLoading
      }))
    );

    // Subscribe to player state changes for signals
    this.playerUseCase.getPlayerState().subscribe(state => {
      this.currentSong.set(state.currentSong);
      this.isPlaying.set(state.isPlaying);
      this.currentTime.set(state.currentTime);
      this.duration.set(state.duration);
      this.volume.set(state.volume);
      this.isShuffleEnabled.set(state.isShuffleEnabled);
      this.repeatMode.set(state.repeatMode);
      this.isLoading.set(state.isLoading);
    });

    // Subscribe to playlist changes
    this.playlistService.currentPlaylist$.subscribe(playlist => {
      this.currentPlaylist.set(playlist);
    });
  }

  ngOnDestroy() {
    // Cleanup handled by service
  }

  // Template methods
  goToSongDetail(songId: string) {
    this.router.navigate(['/music/song', songId]);
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = '/assets/placeholders/song.jpg';
  }

  previousSong() {
    this.playerUseCase.playPrevious();
  }

  togglePlay() {
    this.playerUseCase.togglePlayPause();
  }

  togglePlayPause() {
    this.playerUseCase.togglePlayPause();
  }

  nextSong() {
    this.playerUseCase.playNext();
  }

  playPrevious() {
    this.playerUseCase.playPrevious();
  }

  playNext() {
    this.playerUseCase.playNext();
  }

  onSeek(event: any) {
    const value = event.value || event.target.value;
    const newTime = (value / 100) * this.duration();
    this.playerUseCase.seekTo(newTime);
  }

  seekTo(event: any) {
    const value = event.value || event.target.value;
    const newTime = (value / 100) * this.duration();
    this.playerUseCase.seekTo(newTime);
  }

  onVolumeChange(event: any) {
    const value = event.value || event.target.value;
    this.playerUseCase.setVolume(value / 100);
  }

  setVolume(event: any) {
    const value = event.value || event.target.value;
    this.playerUseCase.setVolume(value / 100);
  }

  toggleMute() {
    const currentVolume = this.volume();
    if (currentVolume > 0) {
      this.playerUseCase.setVolume(0);
    } else {
      this.playerUseCase.setVolume(0.5);
    }
  }

  toggleShuffle() {
    this.playerUseCase.toggleShuffle();
  }

  toggleRepeat() {
    // Como toggleRepeat no existe en PlayerUseCase, usamos un método alternativo
    const currentMode = this.repeatMode();
    let newMode: 'none' | 'one' | 'all';
    
    switch (currentMode) {
      case 'none':
        newMode = 'all';
        break;
      case 'all':
        newMode = 'one';
        break;
      case 'one':
        newMode = 'none';
        break;
      default:
        newMode = 'none';
    }
    
    // Aquí necesitarías un método en PlayerUseCase para establecer el modo de repetición
    console.log('Toggle repeat to:', newMode);
  }

  togglePlaylist() {
    this.showPlaylist.update(show => !show);
  }

  playFromPlaylist(index: number) {
    const playlist = this.currentPlaylist();
    if (playlist && playlist.items && playlist.items[index]) {
      // Aquí necesitarías un método para reproducir desde un índice específico
      console.log('Play from playlist index:', index);
    }
  }

  formatTime(seconds: number): string {
    if (!seconds || isNaN(seconds)) return '0:00';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}
