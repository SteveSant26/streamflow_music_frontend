
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
export class PlayerControlButtonBar {
  @Input() isPlaying = false;
  @Output() playPauseClick = new EventEmitter<void>();
  @Output() previousClick = new EventEmitter<void>();
  @Output() nextClick = new EventEmitter<void>();

  onPlayPauseClick(): void {
    this.playPauseClick.emit();
  }

  onPreviousClick(): void {
    this.previousClick.emit();
  }

  onNextClick(): void {
    this.nextClick.emit();
  }
}
