import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";

@Component({
  selector: "app-player-volume-control",
  imports: [],
  templateUrl: "./player-volume-control.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerVolumeControl {
  @Input() volume = 0.5;
  @Output() volumeChange = new EventEmitter<number>();

  // Hacer Math disponible en el template
  Math = Math;

  onVolumeChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const newVolume = parseFloat(target.value);
    this.volumeChange.emit(newVolume);
  }

  get volumePercentage(): number {
    return this.volume * 100;
  }

  get roundedVolumePercentage(): number {
    return Math.round(this.volumePercentage);
  }
}
