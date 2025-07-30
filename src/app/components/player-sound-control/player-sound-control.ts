import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ElementRef, OnInit,
} from "@angular/core";

@Component({
  selector: "app-player-sound-control",
  imports: [],
  templateUrl: "./player-sound-control.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerSoundControl implements OnInit {
  @Input() audioElement: ElementRef<HTMLAudioElement> | null = null;

  currentTime = 0;
  duration = 0;

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
    const seekTime = parseFloat(target.value);
    this.currentTime = seekTime;

    if (this.audioElement) {
      this.audioElement.nativeElement.currentTime = seekTime;
    }
  }

  // Mock methods para el prototipo
  ngOnInit(): void {
    // Simular duración de 3:45
    this.duration = 225; // 3:45 en segundos

    // Simular progreso
    setInterval(() => {
      if (this.currentTime < this.duration) {
        this.currentTime += 1;
      }
    }, 1000);
  }
}
