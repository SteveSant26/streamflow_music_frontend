import { ChangeDetectionStrategy, Component, inject, computed, signal, OnInit } from '@angular/core';
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
import { MatDialog } from '@angular/material/dialog';
import { 
  ROUTES_CONFIG_AUTH, 
  ROUTES_CONFIG_MUSIC, 
  ROUTES_CONFIG_SITE,
  ROUTES_CONFIG_SUBSCRIPTION,
  ROUTES_CONFIG_USER
} from '@app/config/routes-config';
import { TranslateModule } from '@ngx-translate/core';
import { GetMyPlaylistsUseCase } from '@app/domain/usecases/playlist/my-playlists.usecases';
import { Playlist } from '@app/domain/entities/playlist.entity';

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
export class AsideMenu implements OnInit {
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
  private readonly getMyPlaylistsUseCase = inject(GetMyPlaylistsUseCase);
  private readonly dialog = inject(MatDialog);
  readonly viewModeService = inject(ViewModeService);

  isAuthenticated = this.authStateService.isAuthenticated;
  user = this.authStateService.user;

  // Playlists signals
  playlists = signal<Playlist[]>([]);
  isLoadingPlaylists = signal<boolean>(false);

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

  ngOnInit() {
    // Solo cargar playlists si el usuario está autenticado
    if (this.isAuthenticated()) {
      this.loadUserPlaylists();
    }
  }

  private loadUserPlaylists() {
    if (this.isLoadingPlaylists()) return;

    this.isLoadingPlaylists.set(true);
    
    const params = {
      page: 1,
      page_size: 4, // Solo las primeras 4
      ordering: '-created_at'
    };

    this.getMyPlaylistsUseCase.execute(params).subscribe({
      next: (response: any) => {
        if (response?.results) {
          this.playlists.set(response.results);
        }
      },
      error: (error: any) => {
        console.error('Error loading user playlists:', error);
        this.playlists.set([]);
      },
      complete: () => {
        this.isLoadingPlaylists.set(false);
      }
    });
  }

  openCreatePlaylistDialog() {
    // Por ahora, redirigir a la página de mis playlists
    // TODO: Implementar un dialog global para crear playlists
    this.router.navigate(['/my-playlists']);
  }
}
