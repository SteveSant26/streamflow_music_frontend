import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ROUTES_CONFIG_MUSIC } from '@app/config/routes-config';

interface Playlist {
  id: string; // Cambiado de number a string para coincidir con la entidad del dominio
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
    // Evitar loop infinito - solo cambiar una vez
    if (event.target.src.includes('placeholder.jpg')) {
      // Si ya es placeholder y falla, usar un ícono por defecto
      event.target.style.display = 'none';
      // Crear un div con ícono como fallback
      const parent = event.target.parentElement;
      if (parent && !parent.querySelector('.fallback-icon')) {
        const fallbackDiv = document.createElement('div');
        fallbackDiv.className = 'fallback-icon flex items-center justify-center w-full h-full bg-gray-200 rounded';
        fallbackDiv.innerHTML = '<i class="fas fa-music text-gray-400 text-2xl"></i>';
        parent.appendChild(fallbackDiv);
      }
    } else {
      // Primera vez que falla, intentar con placeholder
      event.target.src = '/assets/playlists/placeholder.jpg';
    }
  }

  navigateToPlaylist() {
    this.router.navigate([ROUTES_CONFIG_MUSIC.PLAYLIST.getLinkWithId(this.playlist.id.toString())]);
  }
}
