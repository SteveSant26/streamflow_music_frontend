import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CardPlayButton } from '../card-play-button/card-play-button';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { ROUTES_CONFIG_MUSIC } from '@app/config/routes-config';
import { MaterialThemeService } from '../../../../shared/services/material-theme.service';

export interface Playlist {
  id: number;
  cover: string;
  title: string;
  artists: string[];
  color?: string;
}

@Component({
  selector: 'app-play-list-item-card',
  imports: [CardPlayButton, RouterLink, TranslateModule, CommonModule],
  templateUrl: './play-list-item-card.html',
  styleUrl: './play-list-item-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayListItemCard {
  @Input() playlist!: Playlist;

  constructor(private readonly materialTheme: MaterialThemeService) {}

  get isDarkTheme$() {
    return this.materialTheme.isDarkMode();
  }

  protected readonly ROUTES_CONFIG_MUSIC = ROUTES_CONFIG_MUSIC;

  get artistsString(): string {
    return this.playlist?.artists?.join(', ') || '';
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = '/assets/playlists/placeholder.jpg';
  }
}
