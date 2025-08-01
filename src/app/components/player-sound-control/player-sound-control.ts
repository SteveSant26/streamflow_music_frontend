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
import { GlobalPlayerStateService } from '../../shared/services/global-player-state.service';
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

  private readonly globalPlayerState = inject(GlobalPlayerStateService);
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
    
    console.log('PlayerSoundControl: Seek to', seekPercentage + '%');
    
    // Use the PlayerUseCase through GlobalPlayerStateService to handle seeking
    const playerUseCase = this.globalPlayerState.getPlayerUseCase();
    playerUseCase.seekToPercentage(seekPercentage);
    
    // Force sync after seek
    this.globalPlayerState.forceSyncAllComponents();
  }

  ngOnInit(): void {
    // Subscribe to global player state
    this.globalPlayerState.getPlayerState$()
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
