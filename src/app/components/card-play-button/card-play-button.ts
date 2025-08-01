import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: "app-card-play-button",
  imports: [MatIconModule],
  templateUrl: "./card-play-button.html",
  styleUrl: "./card-play-button.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardPlayButton {
  @Input() id = 0;
  @Input() size: "small" | "large" = "small";

  // Mock state para el reproductor
  isPlaying = false;
  currentPlaylistId: number | null = null;

  get isPlayingPlaylist(): boolean {
    return this.isPlaying && this.currentPlaylistId === this.id;
  }

  get isThisPlaylistInStore(): boolean {
    return this.currentPlaylistId === this.id;
  }

  get iconClassName(): string {
    return this.size === "small" ? "w-4 h-4" : "w-5 h-5";
  }

  handleClick(): void {
    if (this.isThisPlaylistInStore) {
      this.isPlaying = !this.isPlaying;
      return;
    }

    // Mock: simular carga de playlist
    this.currentPlaylistId = this.id;
    setTimeout(() => {
      this.isPlaying = true;
    }, 100);
  }
}
