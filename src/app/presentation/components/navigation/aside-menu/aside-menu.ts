import { ChangeDetectionStrategy, Component, inject, computed } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { SideMenuItem } from '../side-menu-item/side-menu-item';
import { SideMenuCard } from '../side-menu-card/side-menu-card';
import { AuthStateService, LanguageService } from '@app/shared/services';
import { LogoutUseCase } from '@app/domain/usecases';
import { MaterialThemeService } from '@app/shared/services/material-theme.service';
import { ViewModeService } from '@app/presentation/shared/services/view-mode.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { 
  ROUTES_CONFIG_AUTH, 
  ROUTES_CONFIG_MUSIC, 
  ROUTES_CONFIG_SITE,
  ROUTES_CONFIG_SUBSCRIPTION,
  ROUTES_CONFIG_USER
} from '@app/config/routes-config';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-aside-menu',
  imports: [
    RouterLink,
    SideMenuItem,
    SideMenuCard,
    AsyncPipe,
    MatIconModule,
    MatButtonModule,
    TranslateModule,
  ],
  templateUrl: './aside-menu.html',
  styleUrls: ['./aside-menu.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsideMenu {
  protected readonly ROUTES_CONFIG_AUTH = ROUTES_CONFIG_AUTH;
  protected readonly ROUTES_CONFIG_MUSIC = ROUTES_CONFIG_MUSIC;
  protected readonly ROUTES_CONFIG_SITE = ROUTES_CONFIG_SITE;
  protected readonly ROUTES_CONFIG_SUBSCRIPTION = ROUTES_CONFIG_SUBSCRIPTION;
  protected readonly ROUTES_CONFIG_USER = ROUTES_CONFIG_USER;
  private readonly authStateService = inject(AuthStateService);
  private readonly logoutUseCase = inject(LogoutUseCase);
  private readonly router = inject(Router);
  private readonly languageService = inject(LanguageService);
  private readonly materialThemeService = inject(MaterialThemeService);
  readonly viewModeService = inject(ViewModeService);

  isAuthenticated = this.authStateService.isAuthenticated;
  user = this.authStateService.user;

  // Theme properties
  showThemeOptions = false;
  readonly isDarkMode = this.materialThemeService.isDarkMode;
  readonly currentTheme = this.materialThemeService.currentTheme;
  readonly effectiveTheme = this.materialThemeService.effectiveTheme;

  // Computed para obtener el ícono apropiado del tema
  readonly themeIcon = computed(() => {
    const theme = this.currentTheme();
    if (theme.isSystemTheme()) {
      return 'settings_brightness';
    }
    return theme.isDark ? 'nights_stay' : 'wb_sunny';
  });

  // Computed para saber qué opción está activa
  readonly isLightActive = computed(() => {
    const theme = this.currentTheme();
    return !theme.isSystemTheme() && !theme.isDark;
  });

  readonly isDarkActive = computed(() => {
    const theme = this.currentTheme();
    return !theme.isSystemTheme() && theme.isDark;
  });

  readonly isSystemActive = computed(() => {
    return this.currentTheme().isSystemTheme();
  });

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

  // Theme methods
  toggleThemeOptions(): void {
    this.showThemeOptions = !this.showThemeOptions;
  }

  setLightTheme(): void {
    this.materialThemeService.setTheme('light');
    this.showThemeOptions = false;
  }

  setDarkTheme(): void {
    this.materialThemeService.setTheme('dark');
    this.showThemeOptions = false;
  }

  setSystemTheme(): void {
    this.materialThemeService.setTheme('system');
    this.showThemeOptions = false;
  }

  async logout() {
    try {
      console.log('🚪 Iniciando logout...');
      await this.logoutUseCase.execute();
      console.log('✅ Logout exitoso, redirigiendo...');
      await this.router.navigate([ROUTES_CONFIG_AUTH.LOGIN.path]);
    } catch (error) {
      console.error('❌ Error en logout:', error);
      // Aunque falle, redirigimos al login
      await this.router.navigate([ROUTES_CONFIG_AUTH.LOGIN.path]);
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
