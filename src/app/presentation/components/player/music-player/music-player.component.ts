import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { MatCardModule } from '@angular/material/card';
import { PlaylistService } from '@app/infrastructure/services/playlist.service';
import { AudioPlayerService } from '@app/infrastructure/services/audio-player.service';
import { Router } from '@angular/router';
import { ROUTES_CONFIG_MUSIC } from '@app/config/routes-config';

@Component({
  selector: 'app-music-player',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatSliderModule,
    MatCardModule,
  ],
  template: `
    <div class="music-player" *ngIf="playbackState$ | async as state">
      <div class="player-container" *ngIf="state.currentSong">
        <!-- Song Info -->
        <div class="song-info" (click)="goToSongDetail(state.currentSong.id)">
          <img 
            [src]="state.currentSong.thumbnailUrl" 
            [alt]="state.currentSong.title"
            class="album-cover"
            (error)="onImageError($event)"
          />
          <div class="song-details">
            <h4 class="song-title">{{ state.currentSong.title }}</h4>
            <p class="artist-name">{{ state.currentSong.artist }}</p>
          </div>
        </div>

        <!-- Controls -->
        <div class="player-controls">
          <button mat-icon-button (click)="previousSong()">
            <mat-icon>skip_previous</mat-icon>
          </button>
          
          <button 
            mat-fab 
            color="primary" 
            (click)="togglePlay()"
            [disabled]="audioPlayer.isLoadingAudio()"
          >
            <mat-icon *ngIf="audioPlayer.isLoadingAudio()">refresh</mat-icon>
            <mat-icon *ngIf="!audioPlayer.isLoadingAudio() && state.isPlaying">pause</mat-icon>
            <mat-icon *ngIf="!audioPlayer.isLoadingAudio() && !state.isPlaying">play_arrow</mat-icon>
          </button>
          
          <button mat-icon-button (click)="nextSong()">
            <mat-icon>skip_next</mat-icon>
          </button>
        </div>

        <!-- Progress -->
        <div class="progress-container">
          <span class="time-label">{{ formatTime(state.currentTime) }}</span>
          <mat-slider 
            class="progress-slider"
            [max]="state.duration"
            [disabled]="audioPlayer.isLoadingAudio()"
          >
            <input matSliderThumb [value]="state.currentTime" (input)="onSeek($event)">
          </mat-slider>
          <span class="time-label">{{ formatTime(state.duration) }}</span>
        </div>

        <!-- Additional Controls -->
        <div class="additional-controls">
          <button 
            mat-icon-button 
            (click)="toggleRepeat()"
            [class.active]="currentPlaylist?.repeatMode !== 'none'"
          >
            <mat-icon *ngIf="currentPlaylist?.repeatMode === 'one'">repeat_one</mat-icon>
            <mat-icon *ngIf="currentPlaylist?.repeatMode !== 'one'">repeat</mat-icon>
          </button>
          
          <button 
            mat-icon-button 
            (click)="toggleShuffle()"
            [class.active]="currentPlaylist?.isShuffled"
          >
            <mat-icon>shuffle</mat-icon>
          </button>
          
          <button mat-icon-button (click)="toggleMute()">
            <mat-icon *ngIf="audioPlayer.getVolume() > 0">volume_up</mat-icon>
            <mat-icon *ngIf="audioPlayer.getVolume() === 0">volume_off</mat-icon>
          </button>
          
          <mat-slider 
            class="volume-slider"
            [max]="1"
            [min]="0"
            [step]="0.1"
          >
            <input matSliderThumb [value]="audioPlayer.getVolume()" (input)="onVolumeChange($event)">
          </mat-slider>
        </div>

        <!-- Error Message -->
        <div class="error-message" *ngIf="audioPlayer.hasAudioError()">
          <mat-icon>error</mat-icon>
          <span>Error al reproducir la canción</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .music-player {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: var(--mat-card-container-color);
      border-top: 1px solid var(--mat-divider-color);
      z-index: 1000;
      box-shadow: 0 -2px 8px rgba(0,0,0,0.1);
    }

    .player-container {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      gap: 16px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .song-info {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 200px;
      cursor: pointer;
      transition: opacity 0.2s;
    }

    .song-info:hover {
      opacity: 0.8;
    }

    .album-cover {
      width: 48px;
      height: 48px;
      border-radius: 4px;
      object-fit: cover;
      background: var(--mat-card-container-color);
    }

    .song-details {
      min-width: 0;
    }

    .song-title {
      margin: 0;
      font-size: 14px;
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .artist-name {
      margin: 0;
      font-size: 12px;
      color: var(--mat-text-secondary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .player-controls {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .progress-container {
      display: flex;
      align-items: center;
      gap: 8px;
      flex: 1;
      min-width: 200px;
    }

    .progress-slider {
      flex: 1;
    }

    .time-label {
      font-size: 12px;
      color: var(--mat-text-secondary);
      min-width: 40px;
      text-align: center;
    }

    .additional-controls {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .volume-slider {
      width: 80px;
    }

    .active {
      color: var(--mat-primary-color) !important;
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--mat-error-color);
      font-size: 12px;
    }

    @media (max-width: 768px) {
      .player-container {
        flex-wrap: wrap;
        gap: 8px;
        padding: 8px;
      }

      .song-info {
        min-width: 150px;
      }

      .additional-controls {
        display: none;
      }

      .progress-container {
        order: 3;
        width: 100%;
        min-width: auto;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MusicPlayerComponent {
  private readonly playlistService = inject(PlaylistService);
  private readonly router = inject(Router);
  readonly audioPlayer = inject(AudioPlayerService);

  readonly playbackState$ = this.playlistService.playbackState$;
  readonly currentPlaylist$ = this.playlistService.currentPlaylist$;

  currentPlaylist = this.playlistService.getCurrentPlaylist();

  constructor() {
    // Suscribirse a cambios en la playlist
    this.currentPlaylist$.subscribe(playlist => {
      this.currentPlaylist = playlist;
    });
  }

  togglePlay(): void {
    this.audioPlayer.play();
  }

  nextSong(): void {
    this.audioPlayer.next();
  }

  previousSong(): void {
    this.audioPlayer.previous();
  }

  onSeek(event: any): void {
    const time = event.value || event.target.value;
    this.audioPlayer.seek(time);
  }

  onVolumeChange(event: any): void {
    const volume = event.value || event.target.value;
    this.audioPlayer.setVolume(volume);
  }

  toggleMute(): void {
    this.audioPlayer.mute();
  }

  toggleRepeat(): void {
    this.playlistService.toggleRepeatMode();
  }

  toggleShuffle(): void {
    this.playlistService.toggleShuffle();
  }

  goToSongDetail(songId: string): void {
    this.router.navigate([ROUTES_CONFIG_MUSIC.SONG.getLinkWithId(songId)]);
  }

  onImageError(event: any): void {
    event.target.src = '/assets/default-album-cover.jpg';
  }

  formatTime(seconds: number): string {
    if (!seconds || isNaN(seconds)) return '0:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}
