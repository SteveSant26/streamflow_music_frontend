import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { SideMenuItem } from '@app/presentation/components/navigation/side-menu-item/side-menu-item';
import { SideMenuCard } from '@app/presentation/components/navigation/side-menu-card/side-menu-card';
import { AuthStatusUseCase } from '@app/domain/usecases/auth/auth.usecases';
import { MatIconModule } from '@angular/material/icon';
import { ROUTES_CONFIG_AUTH } from '@app/config';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '@app/shared/services/language.service';
import { ThemeToggleComponent } from '../../shared/components/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-aside-menu',
  imports: [
    RouterLink,
    SideMenuItem,
    SideMenuCard,
    MatIconModule,
    TranslateModule,
    ThemeToggleComponent,
  ],
  templateUrl: './aside-menu.html',
  styleUrls: ['./aside-menu.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsideMenu {
  protected readonly ROUTES_CONFIG_AUTH = ROUTES_CONFIG_AUTH;
  private readonly authStatusUseCase = inject(AuthStatusUseCase);
  private readonly router = inject(Router);
  private readonly languageService = inject(LanguageService);

  // Properties para el template
  protected availableLanguages: { code: string; name: string }[] = [];
  protected currentLanguage: string = 'es';

  isAuthenticated = this.authStatusUseCase.isAuthenticated;
  user = this.authStatusUseCase.user;

  constructor() {
    // Cargar idiomas disponibles
    this.languageService.getAvailableLanguages().subscribe(languages => {
      this.availableLanguages = languages;
    });
    
    // Obtener idioma actual
    this.languageService.getCurrentLanguage().subscribe(lang => {
      this.currentLanguage = lang;
    });
  }

  // Language methods
  getCurrentLanguage() {
    return this.currentLanguage;
  }

  getAvailableLanguages() {
    return this.availableLanguages;
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
