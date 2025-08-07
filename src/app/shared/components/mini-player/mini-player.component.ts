import { Component, OnInit, OnDestroy, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { GlobalPlayerStateService } from '@app/infrastructure/services';
import { PlayerState } from '@app/domain/entities/player-state.entity';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-mini-player',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    <div class="mini-player" *ngIf="currentSong" [@slideUp]>
      <div class="mini-player-content">
        <!-- Song Info -->
        <div class="song-info" (click)="openFullPlayer()">
          <img 
            [src]="currentSong.cover" 
            [alt]="currentSong.title"
            class="mini-cover"
            (error)="onImageError($event)">
          
          <div class="mini-song-details">
            <div class="mini-title">{{ currentSong.title }}</div>
            <div class="mini-artist">{{ currentSong.artist }}</div>
          </div>
        </div>

        <!-- Controls -->
        <div class="mini-controls">
          <button mat-icon-button (click)="togglePlay()">
            <mat-icon>{{ currentSong.isPlaying ? 'pause' : 'play_arrow' }}</mat-icon>
          </button>
          
          <button mat-icon-button (click)="openFullPlayer()">
            <mat-icon>expand_less</mat-icon>
          </button>
        </div>

        <!-- Progress Bar -->
        <div class="mini-progress-container">
          <div 
            class="mini-progress-bar"
            [style.width]="currentSong.progress + '%'">
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .mini-player {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: var(--surface, #ffffff);
      border-top: 1px solid var(--outline, #e0e0e0);
      box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
      z-index: 1000;
      height: 72px;
    }

    .mini-player-content {
      display: flex;
      align-items: center;
      height: 100%;
      padding: 0 16px;
      position: relative;
    }

    .song-info {
      display: flex;
      align-items: center;
      flex: 1;
      cursor: pointer;
      min-width: 0;
    }

    .mini-cover {
      width: 48px;
      height: 48px;
      border-radius: 8px;
      object-fit: cover;
      margin-right: 12px;
    }

    .mini-song-details {
      min-width: 0;
      flex: 1;
    }

    .mini-title {
      font-weight: 500;
      color: var(--on-surface, #000000);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 14px;
      line-height: 1.2;
    }

    .mini-artist {
      color: var(--on-surface-variant, #666666);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 12px;
      line-height: 1.2;
      margin-top: 2px;
    }

    .mini-controls {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .mini-controls button {
      width: 40px;
      height: 40px;
    }

    .mini-progress-container {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: var(--outline-variant, #f0f0f0);
    }

    .mini-progress-bar {
      height: 100%;
      background: var(--primary, #1976d2);
      transition: width 0.3s ease;
    }

    /* Tema oscuro */
    [data-theme="dark"] .mini-player {
      background: var(--surface, #1e1e1e);
      border-top-color: var(--outline, #333333);
    }

    [data-theme="dark"] .mini-title {
      color: var(--on-surface, #ffffff);
    }

    [data-theme="dark"] .mini-artist {
      color: var(--on-surface-variant, #b0b0b0);
    }

    [data-theme="dark"] .mini-progress-container {
      background: var(--outline-variant, #333333);
    }

    /* Animación */
    @keyframes slideUp {
      from {
        transform: translateY(100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .mini-player {
      animation: slideUp 0.3s ease-out;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .mini-player-content {
        padding: 0 12px;
      }
      
      .mini-cover {
        width: 40px;
        height: 40px;
        margin-right: 8px;
      }
      
      .mini-controls button {
        width: 36px;
        height: 36px;
      }
    }
  `],
  animations: []
})
export class MiniPlayerComponent implements OnInit, OnDestroy {
  currentSong: {
    id: string;
    title: string;
    artist: string;
    cover: string;
    isPlaying: boolean;
    progress: number;
  } | null = null;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
    private readonly globalPlayerState: GlobalPlayerStateService,
    @Inject(PLATFORM_ID) private readonly platformId: object,
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.setupPlayerStateSubscription();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupPlayerStateSubscription(): void {
    this.globalPlayerState
      .getPlayerState$()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (playerState: PlayerState) => {
          this.updateMiniPlayerView(playerState);
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error in mini-player state subscription:', error);
        }
      });
  }

  private updateMiniPlayerView(playerState: PlayerState): void {
    if (playerState.currentSong) {
      this.currentSong = {
        id: playerState.currentSong.id,
        title: playerState.currentSong.title,
        artist: playerState.currentSong.artist_name || 'Unknown Artist',
        cover: playerState.currentSong.thumbnail_url || '/assets/gorillaz2.jpg',
        isPlaying: playerState.isPlaying,
        progress: playerState.progress
      };
    } else {
      this.currentSong = null;
    }
  }

  togglePlay(): void {
    const playerUseCase = this.globalPlayerState.getPlayerUseCase();
    playerUseCase.togglePlayPause();
  }

  openFullPlayer(): void {
    this.router.navigate(['/music/current-song']);
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = '/assets/gorillaz2.jpg';
  }
}
