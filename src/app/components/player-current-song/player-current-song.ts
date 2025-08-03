import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { GlobalPlayerStateService } from '../../shared/services/global-player-state.service';
import { PlayerState } from '../../domain/entities/player-state.entity';
import { Song } from '../../domain/entities/song.entity';
import { Subject, takeUntil } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-player-current-song',
  imports: [MatIconModule, TranslateModule],
  templateUrl: './player-current-song.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerCurrentSong implements OnInit, OnDestroy {
  private readonly globalPlayerState = inject(GlobalPlayerStateService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroy$ = new Subject<void>();

  song: Song | null = null;
  playerState: PlayerState | null = null;

  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    // Subscribe to global player state for current song updates
    this.globalPlayerState
      .getPlayerState$()
      .pipe(takeUntil(this.destroy$))
      .subscribe((state: PlayerState) => {
        this.playerState = state;
        this.song = state.currentSong;
        this.cdr.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  navigateToCurrentSong() {
    if (this.song) {
      this.router.navigate(['/currentSong']);
    }
  }
}
