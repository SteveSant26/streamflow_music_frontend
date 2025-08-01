<<<<<<< HEAD
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { SideMenuItem } from '../side-menu-item/side-menu-item';
import { SideMenuCard } from '../side-menu-card/side-menu-card';
import { AuthStatusUseCase } from '@app/domain/usecases/auth-status.usecase';
=======
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SideMenuItem } from '../side-menu-item/side-menu-item';
import { SideMenuCard } from '../side-menu-card/side-menu-card';
import { AuthService } from '../../services/auth.service';
>>>>>>> main
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
<<<<<<< HEAD
  private readonly authStatusUseCase = inject(AuthStatusUseCase);
  private readonly router = inject(Router);
  
  isAuthenticated = this.authStatusUseCase.isAuthenticated;
  user = this.authStatusUseCase.user;

  async logout() {
    try {
      console.log('🚪 Iniciando logout...');
      await this.authStatusUseCase.logout();
      console.log('✅ Logout exitoso, redirigiendo...');
      await this.router.navigate(['/login']);
    } catch (error) {
      console.error('❌ Error en logout:', error);
      // Aunque falle, redirigimos al login
      await this.router.navigate(['/login']);
    }
=======
  private readonly authService = inject(AuthService);
  isAuthenticated = this.authService.isAuthenticated();
  user = () => this.authService.getCurrentUserValue();

  async logout() {
    this.authService.logout().subscribe({
      next: () => {
        window.location.href = '/login';
      },
      error: (error) => {
        console.error('Error during logout:', error);
        // Limpiar datos locales incluso si hay error en el servidor
        window.location.href = '/login';
      }
    });
>>>>>>> main
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
