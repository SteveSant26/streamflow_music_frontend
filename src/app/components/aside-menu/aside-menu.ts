import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SideMenuItem } from '../side-menu-item/side-menu-item';
import { SideMenuCard } from '../side-menu-card/side-menu-card';
import { AuthService } from '@shared/services/auth.service';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-aside-menu',
  imports: [RouterLink, SideMenuItem, SideMenuCard, MatIconModule],
  templateUrl: './aside-menu.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsideMenu {
  private readonly authService = inject(AuthService);
  isAuthenticated = this.authService.isAuthenticated();
  user = this.authService.user;

  async logout() {
    await this.authService.signOut();
    window.location.href = '/login';
  }
  // Mock data para las playlists
  playlists = [
    { id: 1, name: 'Liked Songs', cover: '/assets/playlists/playlist1.jpg' },
    { id: 2, name: 'Daily Mix 1', cover: '/assets/playlists/playlist2.webp' },
    { id: 3, name: 'Rock Classics', cover: '/assets/playlists/playlist3.jpg' },
    { id: 4, name: 'Chill Hits', cover: '/assets/playlists/playlist4.jpg' },
  ];
}
