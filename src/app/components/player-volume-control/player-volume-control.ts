import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { GlobalPlayerStateService } from '../../shared/services/global-player-state.service';
import { PlayerState } from '../../domain/entities/player-state.entity';
import { Subject, takeUntil } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-player-volume-control',
  imports: [MatIcon, TranslateModule],
  templateUrl: './player-volume-control.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerVolumeControl implements OnInit, OnDestroy {
  private readonly globalPlayerState = inject(GlobalPlayerStateService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroy$ = new Subject<void>();

  volume = 0.5;
  playerState: PlayerState | null = null;

  // Hacer Math disponible en el template
  Math = Math;

  onVolumeChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const newVolume = parseFloat(target.value);

    // Use the PlayerUseCase through GlobalPlayerStateService to handle volume change
    const playerUseCase = this.globalPlayerState.getPlayerUseCase();
    playerUseCase.setVolume(newVolume);
  }

  ngOnInit(): void {
    // Subscribe to global player state for volume updates
    this.globalPlayerState
      .getPlayerState$()
      .pipe(takeUntil(this.destroy$))
      .subscribe((state: PlayerState) => {
        this.playerState = state;
        this.volume = state.volume;
        this.cdr.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get volumePercentage(): number {
    return this.volume * 100;
  }

  get roundedVolumePercentage(): number {
    return Math.round(this.volumePercentage);
  }
}
