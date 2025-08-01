import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PlayerUseCase } from '../../domain/use-cases/player.use-case';
import { PlayerState } from '../../domain/entities/player-state.entity';
import { MusicLibraryService } from '../../shared/services/music-library.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    <div class="player-container" *ngIf="playerState">
      <!-- Song Info -->
      <div class="song-info">
        <div class="album-cover" *ngIf="playerState.currentSong?.albumCover">
          <img [src]="playerState.currentSong!.albumCover" [alt]="playerState.currentSong?.title || 'Album cover'" />
        </div>
        <div class="song-details">
          <h3 class="song-title">{{ playerState.currentSong?.title || 'No song selected' }}</h3>
          <p class="song-artist">{{ playerState.currentSong?.artist || '' }}</p>
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="progress-section">
        <span class="time-display">{{ formatTime(playerState.currentTime) }}</span>
        <div class="progress-container">
          <input 
            type="range"
            class="progress-slider"
            [value]="playerState.progress"
            [min]="0"
            [max]="100"
            [step]="0.1"
            (input)="onProgressChange($event)"
            [disabled]="!playerState.currentSong">
        </div>
        <span class="time-display">{{ formatTime(playerState.duration) }}</span>
      </div>

      <!-- Player Controls -->
      <div class="player-controls">
        <button 
          mat-icon-button 
          (click)="onPrevious()"
          [disabled]="!playerState.currentSong"
          [attr.aria-label]="'Previous song'">
          <mat-icon>skip_previous</mat-icon>
        </button>

        <button 
          mat-icon-button 
          class="play-pause-btn"
          (click)="onPlayPause()"
          [disabled]="!playerState.currentSong || playerState.isLoading"
          [attr.aria-label]="playerState.isPlaying ? 'Pause' : 'Play'">
          <mat-icon *ngIf="playerState.isLoading">hourglass_empty</mat-icon>
          <mat-icon *ngIf="!playerState.isLoading && playerState.isPlaying">pause</mat-icon>
          <mat-icon *ngIf="!playerState.isLoading && !playerState.isPlaying">play_arrow</mat-icon>
        </button>

        <button 
          mat-icon-button 
          (click)="onNext()"
          [disabled]="!playerState.currentSong"
          [attr.aria-label]="'Next song'">
          <mat-icon>skip_next</mat-icon>
        </button>

        <button 
          mat-icon-button 
          (click)="onRepeat()"
          [class.active]="playerState.repeatMode !== 'none'"
          [attr.aria-label]="'Repeat'">
          <mat-icon *ngIf="playerState.repeatMode === 'one'">repeat_one</mat-icon>
          <mat-icon *ngIf="playerState.repeatMode !== 'one'">repeat</mat-icon>
        </button>

        <button 
          mat-icon-button 
          (click)="onShuffle()"
          [class.active]="playerState.isShuffleEnabled"
          [attr.aria-label]="'Shuffle'">
          <mat-icon>shuffle</mat-icon>
        </button>
      </div>

      <!-- Volume Controls -->
      <div class="volume-controls">
        <button 
          mat-icon-button 
          (click)="onMuteToggle()"
          [attr.aria-label]="playerState.isMuted ? 'Unmute' : 'Mute'">
          <mat-icon *ngIf="playerState.isMuted || playerState.volume === 0">volume_off</mat-icon>
          <mat-icon *ngIf="!playerState.isMuted && playerState.volume > 0 && playerState.volume <= 0.5">volume_down</mat-icon>
          <mat-icon *ngIf="!playerState.isMuted && playerState.volume > 0.5">volume_up</mat-icon>
        </button>
        
        <div class="volume-slider-container">
          <input 
            type="range"
            class="volume-slider"
            [value]="playerState.volume * 100"
            [min]="0"
            [max]="100"
            [step]="1"
            (input)="onVolumeChange($event)">
        </div>
      </div>
    </div>
  `,
  styles: [`
    .player-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 20px;
      background: #1a1a1a;
      border-radius: 12px;
      color: white;
      max-width: 600px;
      margin: 0 auto;
    }

    .song-info {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .album-cover {
      width: 60px;
      height: 60px;
      border-radius: 8px;
      overflow: hidden;
      background: #333;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .album-cover img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .song-details {
      flex: 1;
      min-width: 0;
    }

    .song-title {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: white;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .song-artist {
      margin: 4px 0 0 0;
      font-size: 14px;
      color: #aaa;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .progress-section {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .progress-container {
      flex: 1;
    }

    .progress-slider {
      width: 100%;
      height: 4px;
      background: #535353;
      border-radius: 2px;
      outline: none;
      appearance: none;
      cursor: pointer;
    }

    .progress-slider::-webkit-slider-thumb {
      appearance: none;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #1db954;
      cursor: pointer;
    }

    .progress-slider::-moz-range-thumb {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #1db954;
      cursor: pointer;
      border: none;
    }

    .time-display {
      font-size: 12px;
      color: #aaa;
      min-width: 40px;
      text-align: center;
    }

    .player-controls {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .play-pause-btn {
      background: #1db954 !important;
      color: white !important;
      width: 48px;
      height: 48px;
    }

    .player-controls button {
      color: #aaa;
    }

    .player-controls button:hover:not(:disabled) {
      color: white;
    }

    .player-controls button.active {
      color: #1db954;
    }

    .player-controls button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .volume-controls {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .volume-controls button {
      color: #aaa;
    }

    .volume-controls button:hover {
      color: white;
    }

    .volume-slider-container {
      width: 100px;
    }

    .volume-slider {
      width: 100%;
      height: 4px;
      background: #535353;
      border-radius: 2px;
      outline: none;
      appearance: none;
      cursor: pointer;
    }

    .volume-slider::-webkit-slider-thumb {
      appearance: none;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #1db954;
      cursor: pointer;
    }

    .volume-slider::-moz-range-thumb {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #1db954;
      cursor: pointer;
      border: none;
    }

    @media (max-width: 480px) {
      .player-container {
        padding: 16px;
      }

      .progress-section {
        flex-direction: column;
        gap: 8px;
      }

      .progress-container {
        width: 100%;
      }

      .volume-controls {
        justify-content: center;
      }
    }
  `]
})
export class PlayerComponent implements OnInit, OnDestroy {
  playerState: PlayerState | null = null;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly playerUseCase: PlayerUseCase,
    private readonly musicLibraryService: MusicLibraryService
  ) {}

  ngOnInit(): void {
    this.playerUseCase.getPlayerState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.playerState = state;
      });

    this.playerUseCase.onSongEnd()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        // Song ended - handled by use case
      });

    this.playerUseCase.onError()
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        console.error('Player error:', error);
      });

    this.loadDefaultPlaylist();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadDefaultPlaylist(): void {
    const defaultPlaylist = this.musicLibraryService.getDefaultPlaylist();
    if (defaultPlaylist && defaultPlaylist.songs.length > 0) {
      this.playerUseCase.loadPlaylist(defaultPlaylist);
      this.playerUseCase.playSong(defaultPlaylist.songs[0]).catch(error => {
        console.error('Failed to load first song:', error);
      });
    }
  }

  onPlayPause(): void {
    if (!this.playerState?.currentSong) return;

    if (this.playerState.isPlaying) {
      this.playerUseCase.pauseMusic();
    } else {
      this.playerUseCase.resumeMusic().catch(error => {
        console.error('Failed to resume music:', error);
      });
    }
  }

  onNext(): void {
    this.playerUseCase.playNext().catch(error => {
      console.error('Failed to play next song:', error);
    });
  }

  onPrevious(): void {
    this.playerUseCase.playPrevious().catch(error => {
      console.error('Failed to play previous song:', error);
    });
  }

  onRepeat(): void {
    if (!this.playerState) return;

    const modes: ('none' | 'one' | 'all')[] = ['none', 'one', 'all'];
    const currentIndex = modes.indexOf(this.playerState.repeatMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    
    this.playerUseCase.setRepeat(nextMode);
  }

  onShuffle(): void {
    this.playerUseCase.enableShuffle();
  }

  onMuteToggle(): void {
    this.playerUseCase.toggleMute();
  }

  onVolumeChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const volume = parseInt(target.value, 10);
    this.playerUseCase.adjustVolume(volume / 100);
  }

  onProgressChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const progress = parseFloat(target.value);
    this.playerUseCase.seekToPercentage(progress);
  }

  formatTime(seconds: number): string {
    if (!seconds || isNaN(seconds)) return '0:00';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}
