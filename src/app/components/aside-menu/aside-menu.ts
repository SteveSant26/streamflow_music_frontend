import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SideMenuItem } from '../side-menu-item/side-menu-item';
import { SideMenuCard } from '../side-menu-card/side-menu-card';
import { AuthStatusUseCase } from '@app/domain/usecases/auth-status.usecase';
import { MatIconModule } from '@angular/material/icon';
import { ROUTES_CONFIG_AUTH } from '@app/config';
@Component({
  selector: 'app-aside-menu',
  imports: [RouterLink, SideMenuItem, SideMenuCard, MatIconModule],
  templateUrl: './aside-menu.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsideMenu {
  protected readonly ROUTES_CONFIG_AUTH = ROUTES_CONFIG_AUTH;
  private readonly authStatusUseCase = inject(AuthStatusUseCase);
  
  isAuthenticated = this.authStatusUseCase.isAuthenticated;
  user = this.authStatusUseCase.user;

  async logout() {
    await this.authStatusUseCase.logout();
    window.location.href = '/login';
  }

  onLogoutKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.logout();
    }
  }
  // Mock data para las playlists
  playlists = [
    { id: 1, name: 'Liked Songs', cover: '/assets/playlists/playlist1.jpg' },
    { id: 2, name: 'Daily Mix 1', cover: '/assets/playlists/playlist2.webp' },
    { id: 3, name: 'Rock Classics', cover: '/assets/playlists/playlist3.jpg' },
    { id: 4, name: 'Chill Hits', cover: '/assets/playlists/playlist4.jpg' },
  ];
}
