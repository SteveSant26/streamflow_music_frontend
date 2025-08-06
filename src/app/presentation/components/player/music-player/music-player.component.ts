import { Component, Input, OnInit, OnDestroy, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { PlayerUseCase } from '../../../../domain/usecases/player/player.usecases';
import { PlaylistService } from '../../../../infrastructure/services/playlist.service';
import { AudioPlayerService } from '../../../../infrastructure/services/audio-player.service';
import { Song } from '../../../../domain/entities/song.entity';

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
  private readonly audioPlayerService = inject(AudioPlayerService);

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

  // Computed values
  progress = computed(() => {
    const dur = this.duration();
    return dur > 0 ? (this.currentTime() / dur) * 100 : 0;
  });

  formattedCurrentTime = computed(() => this.formatTime(this.currentTime()));
  formattedDuration = computed(() => this.formatTime(this.duration()));

  ngOnInit() {
    // Subscribe to player state changes
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
  }

  ngOnDestroy() {
    // Cleanup handled by service
  }

  togglePlayPause() {
    this.playerUseCase.togglePlayPause();
  }

  playPrevious() {
    this.playerUseCase.playPrevious();
  }

  playNext() {
    this.playerUseCase.playNext();
  }

  seekTo(event: any) {
    const value = event.value || event.target.value;
    const newTime = (value / 100) * this.duration();
    this.playerUseCase.seekTo(newTime);
  }

  setVolume(event: any) {
    const value = event.value || event.target.value;
    this.playerUseCase.setVolume(value / 100);
  }

  toggleShuffle() {
    this.playerUseCase.toggleShuffle();
  }

  toggleRepeat() {
    this.playerUseCase.toggleRepeat();
  }

  togglePlaylist() {
    this.showPlaylist.update(show => !show);
  }

  private formatTime(seconds: number): string {
    if (!seconds || isNaN(seconds)) return '0:00';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}
