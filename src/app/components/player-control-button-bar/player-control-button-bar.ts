import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-player-control-button-bar',
  imports: [],
  templateUrl: './player-control-button-bar.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerControlButtonBar {
  @Input() isPlaying: boolean = false;
  @Output() playPauseClick = new EventEmitter<void>();

  onPlayPauseClick(): void {
    this.playPauseClick.emit();
  }

  onPreviousClick(): void {
    console.log('Previous song');
  }

  onNextClick(): void {
    console.log('Next song');
  }
}
