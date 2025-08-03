import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ROUTES_CONFIG_MUSIC } from '@app/config/routes-config';

interface Playlist {
  id: number;
  name: string;
  cover: string;
}

@Component({
  selector: 'app-side-menu-card',
  imports: [TranslateModule],
  templateUrl: './side-menu-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideMenuCard {
  @Input() playlist!: Playlist;

  constructor(private readonly router: Router) {}

  onImageError(event: any) {
    // Fallback a una imagen placeholder si la imagen original falla
    event.target.src = '/assets/playlists/placeholder.jpg';
  }

  navigateToPlaylist() {
    this.router.navigate([ROUTES_CONFIG_MUSIC.PLAYLIST.getLinkWithId(this.playlist.id.toString())]);
  }
}
