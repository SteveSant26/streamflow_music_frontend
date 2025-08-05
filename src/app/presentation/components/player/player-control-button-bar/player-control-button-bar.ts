import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { GlobalPlayerStateService } from '@app/infrastructure/services';
import { PlayerState } from '@app/domain/entities/player-state.entity';
import { Subject, takeUntil } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-player-control-button-bar',
  imports: [MatIconModule, TranslateModule],
  templateUrl: './player-control-button-bar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerControlButtonBar implements OnInit, OnDestroy {
  private readonly globalPlayerState = inject(GlobalPlayerStateService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroy$ = new Subject<void>();

  isPlaying = false;
  playerState: PlayerState | null = null;

  ngOnInit(): void {
    // Subscribe to global player state for play/pause state updates
    this.globalPlayerState
      .getPlayerState$()
      .pipe(takeUntil(this.destroy$))
      .subscribe((state: PlayerState) => {
        this.playerState = state;
        this.isPlaying = state.isPlaying;
        this.cdr.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onPlayPauseClick(): void {
    console.log('PlayerControlButtonBar: onPlayPauseClick called');

    // Use ONLY the centralized method
    const playerUseCase = this.globalPlayerState.getPlayerUseCase();
    playerUseCase.togglePlayPause();
  }

  onPreviousClick(): void {
    const playerUseCase = this.globalPlayerState.getPlayerUseCase();
    playerUseCase.playPrevious().catch((error: any) => {
      console.error('Error playing previous song:', error);
    });
  }

  onNextClick(): void {
    const playerUseCase = this.globalPlayerState.getPlayerUseCase();
    playerUseCase.playNext().catch((error: any) => {
      console.error('Error playing next song:', error);
    });
  }
}
