
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  inject,
} from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { GlobalPlayerStateService } from '../../shared/services/global-player-state.service';
import { PlayerState } from '../../domain/entities/player-state.entity';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: "app-player-control-button-bar",
  imports: [MatIconModule],
  templateUrl: "./player-control-button-bar.html",
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
    this.globalPlayerState.getPlayerState$()
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
    
    // Force sync immediately after action
    this.globalPlayerState.forceSyncAllComponents();
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
