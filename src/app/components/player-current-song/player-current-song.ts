import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "app-player-current-song",
  imports: [],
  templateUrl: "./player-current-song.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerCurrentSong {}
