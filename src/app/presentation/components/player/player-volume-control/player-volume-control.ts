import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { GlobalPlayerStateService } from '@app/infrastructure/services';
import { PlayerState } from '@app/domain/entities/player-state.entity';
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
  previousVolume = 0.5; // Para recordar el volumen anterior al hacer mute

  // Hacer Math disponible en el template
  Math = Math;

  onVolumeChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const newVolume = parseFloat(target.value);

    // Guardar el volumen anterior si no es 0
    if (newVolume > 0) {
      this.previousVolume = newVolume;
    }

    // Use the PlayerUseCase through GlobalPlayerStateService to handle volume change
    const playerUseCase = this.globalPlayerState.getPlayerUseCase();
    playerUseCase.setVolume(newVolume);
  }

  onVolumeBarClick(event: MouseEvent): void {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const width = rect.width;
    const clickPercentage = clickX / width;
    const newVolume = Math.max(0, Math.min(1, clickPercentage));

    // Guardar el volumen anterior si no es 0
    if (newVolume > 0) {
      this.previousVolume = newVolume;
    }

    // Use the PlayerUseCase through GlobalPlayerStateService to handle volume change
    const playerUseCase = this.globalPlayerState.getPlayerUseCase();
    playerUseCase.setVolume(newVolume);
  }

  toggleVolume(): void {
    const playerUseCase = this.globalPlayerState.getPlayerUseCase();
    
    if (this.volume === 0) {
      // Si está en mute, restaurar el volumen anterior o 100%
      const newVolume = this.previousVolume > 0 ? this.previousVolume : 1;
      playerUseCase.setVolume(newVolume);
    } else {
      // Si tiene volumen, guardar el volumen actual y hacer mute
      this.previousVolume = this.volume;
      playerUseCase.setVolume(0);
    }
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
