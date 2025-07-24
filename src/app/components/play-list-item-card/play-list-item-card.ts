import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CardPlayButton } from '../card-play-button/card-play-button';

export interface Playlist {
  id: number;
  cover: string;
  title: string;
  artists: string[];
  color?: string;
}

@Component({
  selector: 'app-play-list-item-card',
  imports: [CardPlayButton],
  templateUrl: './play-list-item-card.html',
  styleUrl: './play-list-item-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayListItemCard {
  @Input() playlist!: Playlist;

  get artistsString(): string {
    return this.playlist?.artists?.join(', ') || '';
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = '/assets/playlists/placeholder.jpg';
  }
}
