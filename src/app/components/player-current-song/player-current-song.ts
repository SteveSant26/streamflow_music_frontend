import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { Router } from "@angular/router";

interface Song {
  id: number;
  title: string;
  artists: string[];
  album: string;
  albumId: number;
  duration: string;
  image: string;
}

@Component({
  selector: "app-player-current-song",
  imports: [MatIconModule],
  templateUrl: "./player-current-song.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerCurrentSong {
  @Input() song: Song | null = null;

  constructor(private readonly router: Router) {}

  navigateToCurrentSong() {
    if (this.song) {
      this.router.navigate(["/currentSong"]);
    }
  }
}
