import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { SideMenuItem } from '../side-menu-item/side-menu-item';
import { SideMenuCard } from '../side-menu-card/side-menu-card';
import { AuthStatusUseCase } from '@app/domain/usecases';
import { MatIconModule } from '@angular/material/icon';
import { ROUTES_CONFIG_AUTH } from '@app/config';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '@app/domain/services/language.service';

@Component({
  selector: 'app-aside-menu',
  imports: [
    RouterLink,
    SideMenuItem,
    SideMenuCard,
    MatIconModule,
    TranslateModule,
  ],
  templateUrl: './aside-menu.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsideMenu {
  protected readonly ROUTES_CONFIG_AUTH = ROUTES_CONFIG_AUTH;
  private readonly authStatusUseCase = inject(AuthStatusUseCase);
  private readonly router = inject(Router);
  private readonly languageService = inject(LanguageService);

  isAuthenticated = this.authStatusUseCase.isAuthenticated;
  user = this.authStatusUseCase.user;

  // Language methods
  getCurrentLanguage() {
    return this.languageService.getCurrentLanguage();
  }

  getAvailableLanguages() {
    return this.languageService.getAvailableLanguages();
  }

  changeLanguage(language: 'en' | 'es') {
    this.languageService.changeLanguage(language);
  }

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
