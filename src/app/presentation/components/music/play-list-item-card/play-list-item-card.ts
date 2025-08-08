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
  playlist_img?: string; // Agregamos el campo de imagen de la base de datos
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
    
    // Evitar loop infinito
    if (img.src !== 'assets/playlists/placeholder.jpg') {
      img.src = 'assets/playlists/placeholder.jpg';
    } else {
      // Si el placeholder también falla, usar un data URL simple
      img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMzc0MTUxIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTEwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNDAiIGZpbGw9IiM5Q0EzQUYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPuKZqjwvdGV4dD4KPC9zdmc+';
    }
  }

  get imageUrl(): string {
    const dbImage = this.playlist?.playlist_img;
    const cover = this.playlist?.cover;
    
    // Priorizar imagen de la base de datos
    const imageToUse = dbImage || cover;
    
    // Verificar si la URL es válida
    if (imageToUse && imageToUse.trim() !== '' && imageToUse !== 'undefined' && imageToUse !== 'null') {
      // Verificar si es una URL válida
      try {
        new URL(imageToUse);
        return imageToUse;
      } catch {
        // Si no es una URL válida pero tiene contenido, asumimos que es una ruta local
        return imageToUse;
      }
    }
    
    return 'assets/playlists/placeholder.jpg';
  }
}
