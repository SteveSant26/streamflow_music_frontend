import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

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
  imports: [],
  templateUrl: "./player-current-song.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerCurrentSong {
  @Input() song: Song | null = null;
}
