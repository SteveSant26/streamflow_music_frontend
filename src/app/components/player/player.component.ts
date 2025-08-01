import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PlayerUseCase } from '../../domain/use-cases/player.use-case';
import { PlayerState } from '../../domain/entities/player-state.entity';
import { MusicLibraryService } from '../../shared/services/music-library.service';
import { Subject, takeUntil } from 'rxjs';

// Import the original components
import { PlayerControlButtonBar } from '../player-control-button-bar/player-control-button-bar';
import { PlayerCurrentSong } from '../player-current-song/player-current-song';
import { PlayerVolumeControl } from '../player-volume-control/player-volume-control';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, PlayerControlButtonBar, PlayerCurrentSong, PlayerVolumeControl],
  template: `
    <div class="player-container" *ngIf="playerState">
      <!-- Current Song Component -->
      <app-player-current-song 
        [song]="getCurrentSongForComponent()"
        class="song-section">
      </app-player-current-song>

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
      <div class="controls-section">
        <button 
          mat-icon-button 
          (click)="onPrevious()"
          [disabled]="!playerState.currentSong"
          [attr.aria-label]="'Previous song'">
          <mat-icon>skip_previous</mat-icon>
        </button>

        <app-player-control-button-bar
          [isPlaying]="playerState.isPlaying && !playerState.isLoading"
          (playPauseClick)="onPlayPause()">
        </app-player-control-button-bar>

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
      <app-player-volume-control
        [volume]="playerState.volume"
        (volumeChange)="onVolumeChange($event)"
        class="volume-section">
      </app-player-volume-control>

      <!-- User interaction required message -->
      <div class="interaction-message" *ngIf="showInteractionMessage">
        <p>Click play to start music (browser requires user interaction)</p>
      </div>
    </div>
  `,
  styles: [`
    .player-container {
      display: flex;
      flex-direction: column;
      gap: 20px;
      padding: 20px;
      background: #1a1a1a;
      border-radius: 12px;
      color: white;
      max-width: 800px;
      margin: 0 auto;
    }

    .song-section {
      display: flex;
      align-items: center;
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

    .controls-section {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
    }

    .controls-section button {
      color: #aaa;
    }

    .controls-section button:hover:not(:disabled) {
      color: white;
    }

    .controls-section button.active {
      color: #1db954;
    }

    .controls-section button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .volume-section {
      display: flex;
      justify-content: center;
    }

    .interaction-message {
      text-align: center;
      padding: 12px;
      background: rgba(29, 185, 84, 0.1);
      border: 1px solid #1db954;
      border-radius: 8px;
      color: #1db954;
    }

    .interaction-message p {
      margin: 0;
      font-size: 14px;
    }

    @media (max-width: 768px) {
      .player-container {
        padding: 16px;
        gap: 16px;
      }

      .controls-section {
        gap: 12px;
      }
    }

    @media (max-width: 480px) {
      .progress-section {
        flex-direction: column;
        gap: 8px;
      }

      .progress-container {
        width: 100%;
      }
    }
  `]
})
export class PlayerComponent implements OnInit, OnDestroy {
  playerState: PlayerState | null = null;
  showInteractionMessage = false;
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
        if (error.includes('not allowed')) {
          this.showInteractionMessage = true;
        }
      });

    this.loadDefaultPlaylist();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getCurrentSongForComponent(): any {
    if (!this.playerState?.currentSong) return null;
    
    // Convert our Song entity to the format expected by PlayerCurrentSong component
    return {
      id: parseInt(this.playerState.currentSong.id) || 1,
      title: this.playerState.currentSong.title,
      artists: [this.playerState.currentSong.artist],
      album: 'Unknown Album', // Our Song entity doesn't have album property
      albumId: 1,
      duration: this.formatTime(this.playerState.currentSong.duration),
      image: this.playerState.currentSong.albumCover || '/assets/gorillaz2.jpg'
    };
  }

  private loadDefaultPlaylist(): void {
    const defaultPlaylist = this.musicLibraryService.getDefaultPlaylist();
    if (defaultPlaylist && defaultPlaylist.songs.length > 0) {
      this.playerUseCase.loadPlaylist(defaultPlaylist);
      // Don't auto-play, wait for user interaction
    }
  }

  onPlayPause(): void {
    if (!this.playerState?.currentSong) {
      // Load first song if none is loaded
      const defaultPlaylist = this.musicLibraryService.getDefaultPlaylist();
      if (defaultPlaylist && defaultPlaylist.songs.length > 0) {
        this.playerUseCase.playSong(defaultPlaylist.songs[0]).catch(error => {
          console.error('Failed to load song:', error);
        });
      }
      return;
    }

    this.showInteractionMessage = false;

    if (this.playerState.isPlaying) {
      this.playerUseCase.pauseMusic();
    } else {
      this.playerUseCase.resumeMusic().catch(error => {
        console.error('Failed to resume music:', error);
        if (error.message?.includes('not allowed')) {
          this.showInteractionMessage = true;
        }
      });
    }
  }

  onNext(): void {
    this.showInteractionMessage = false;
    this.playerUseCase.playNext().catch(error => {
      console.error('Failed to play next song:', error);
    });
  }

  onPrevious(): void {
    this.showInteractionMessage = false;
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

  onVolumeChange(volume: number): void {
    this.playerUseCase.adjustVolume(volume);
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
