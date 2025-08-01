import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ElementRef, 
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  inject
} from "@angular/core";
import { PlayerUseCase } from '../../domain/use-cases/player.use-case';
import { PlayerState } from '../../domain/entities/player-state.entity';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: "app-player-sound-control",
  imports: [],
  templateUrl: "./player-sound-control.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerSoundControl implements OnInit, OnDestroy {
  @Input() audioElement: ElementRef<HTMLAudioElement> | null = null;

  private readonly playerUseCase = inject(PlayerUseCase);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroy$ = new Subject<void>();

  currentTime = 0;
  duration = 0;
  playerState: PlayerState | null = null;

  get progressPercentage(): number {
    if (this.duration === 0) return 0;
    return (this.currentTime / this.duration) * 100;
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  onSeek(event: Event): void {
    const target = event.target as HTMLInputElement;
    const seekPercentage = parseFloat(target.value);
    
    // Use the PlayerUseCase to handle seeking
    this.playerUseCase.seekToPercentage(seekPercentage);
  }

  ngOnInit(): void {
    // Subscribe to player state updates from Clean Architecture
    this.playerUseCase.getPlayerState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
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
