import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CardPlayButton } from '../card-play-button/card-play-button';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-card',
  imports: [CardPlayButton, RouterLink, TranslateModule],
  templateUrl: './card.html',
  styleUrl: './card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Card {
  @Input() title = '';
  @Input() body = '';
  @Input() href = '#';
  @Input() playlistId = 0;
  @Input() showPlayButton = false;
}
