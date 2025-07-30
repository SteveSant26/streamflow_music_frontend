import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { CardPlayButton } from "../card-play-button/card-play-button";

@Component({
  selector: "app-card",
  imports: [CardPlayButton],
  templateUrl: "./card.html",
  styleUrl: "./card.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Card {
  @Input() title = "";
  @Input() body = "";
  @Input() href = "#";
  @Input() playlistId = 0;
  @Input() showPlayButton = false;
}
