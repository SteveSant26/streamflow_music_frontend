import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ElementRef,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { GlobalPlayerStateService } from '@app/infrastructure/services';
import { PlayerState } from '@app/domain/entities/player-state.entity';
import { Subject, takeUntil } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialThemeService } from '@app/shared/services/material-theme.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-player-sound-control',
  imports: [TranslateModule, CommonModule],
  templateUrl: './player-sound-control.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    .progress-bar-enhanced {
      position: relative;
    }
    
    .progress-control:hover .progress-thumb {
      opacity: 1 !important;
    }
    
    .loading-shimmer {
      animation: shimmer 1.5s infinite;
    }
    
    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    
    .pulse-gentle {
      animation: pulse-gentle 2s infinite;
    }
    
    @keyframes pulse-gentle {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }
    
    .progress-control {
      transition: height 0.2s ease-in-out;
      border: none !important;
      outline: none !important;
      box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
    }
    
    .progress-control:focus {
      outline: none !important;
      border: none !important;
    }
    
    .group:hover .progress-control {
      height: 2.25rem !important;
      box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
    }
    
    .progress-bar-enhanced:hover .progress-thumb {
      opacity: 1 !important;
      transform: scale(1.2) translate(50%, -50%) !important;
    }
    
    .progress-thumb {
      transition: all 0.2s ease-in-out;
      z-index: 10;
    }
    
    /* Asegurar que la barra sea visible y funcional */
    .progress-control {
      min-height: 2rem;
      background-color: rgba(255, 255, 255, 0.15) !important;
    }
    
    .progress-control:hover {
      background-color: rgba(255, 255, 255, 0.25) !important;
    }
    
    /* Mejorar la visibilidad del fill */
    .progress-control > div {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }
    
    /* Responsive design */
    @media (max-width: 768px) {
      .progress-control {
        min-height: 1.75rem;
      }
      
      .group:hover .progress-control {
        height: 2rem !important;
      }
    }
  `]
})
export class PlayerSoundControl implements OnInit, OnDestroy {
  @Input() audioElement: ElementRef<HTMLAudioElement> | null = null;

  private readonly globalPlayerState = inject(GlobalPlayerStateService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly materialThemeService = inject(MaterialThemeService);
  private readonly destroy$ = new Subject<void>();

  currentTime = 0;
  duration = 0;
  playerState: PlayerState | null = null;
  isDarkTheme$ = this.materialThemeService.isDarkMode();

  get progressPercentage(): number {
    if (this.duration === 0) return 0;
    return (this.currentTime / this.duration) * 100;
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  onSeek(event: Event): void {
    const target = event.target as HTMLInputElement;
    const seekPercentage = parseFloat(target.value);

    console.log('PlayerSoundControl: Seek to', seekPercentage + '%');

    // Use the PlayerUseCase through GlobalPlayerStateService to handle seeking
    const playerUseCase = this.globalPlayerState.getPlayerUseCase();
    playerUseCase.seekToPercentage(seekPercentage);
  }

  onProgressClick(event: MouseEvent): void {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const width = rect.width;
    const clickPercentage = (clickX / width) * 100;

    console.log('PlayerSoundControl: Click seek to', clickPercentage + '%');

    // Use the PlayerUseCase through GlobalPlayerStateService to handle seeking
    const playerUseCase = this.globalPlayerState.getPlayerUseCase();
    playerUseCase.seekToPercentage(clickPercentage);
  }

  ngOnInit(): void {
    // Subscribe to global player state
    this.globalPlayerState
      .getPlayerState$()
      .pipe(takeUntil(this.destroy$))
      .subscribe((state: PlayerState) => {
        this.playerState = state;
        this.currentTime = state.currentTime;
        this.duration = state.duration;
        this.cdr.detectChanges(); // Force change detection for OnPush
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
