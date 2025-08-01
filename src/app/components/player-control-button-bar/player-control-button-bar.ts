
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";
import { MatIconModule } from "@angular/material/icon";

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
