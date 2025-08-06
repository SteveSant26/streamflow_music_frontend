import { ChangeDetectionStrategy, Component, inject, computed, signal, OnInit, OnDestroy, effect } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { SideMenuItem } from '../side-menu-item/side-menu-item';
import { SideMenuCard } from '../side-menu-card/side-menu-card';
import { AuthStateService, LanguageService } from '@app/shared/services';
import { LogoutUseCase } from '@app/domain/usecases';
import { GetUserPlaylistsUseCase } from '@app/domain/usecases/playlist/playlist.usecases';
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

// Interfaz simple para las playlists del sidebar
interface SidebarPlaylist {
  id: string; // Cambiado de number a string para coincidir con la entidad Playlist
  name: string;
  cover: string;
  total_songs?: number;
  is_public?: boolean;
}

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
export class AsideMenu implements OnInit, OnDestroy {
  protected readonly ROUTES_CONFIG_AUTH = ROUTES_CONFIG_AUTH;
  protected readonly ROUTES_CONFIG_MUSIC = ROUTES_CONFIG_MUSIC;
  protected readonly ROUTES_CONFIG_SITE = ROUTES_CONFIG_SITE;
  protected readonly ROUTES_CONFIG_SUBSCRIPTION = ROUTES_CONFIG_SUBSCRIPTION;
  protected readonly ROUTES_CONFIG_USER = ROUTES_CONFIG_USER;
  private readonly authStateService = inject(AuthStateService);
  private readonly logoutUseCase = inject(LogoutUseCase);
  private readonly getUserPlaylistsUseCase = inject(GetUserPlaylistsUseCase);
  private readonly router = inject(Router);
  private readonly languageService = inject(LanguageService);
  private readonly materialThemeService = inject(MaterialThemeService);
  readonly viewModeService = inject(ViewModeService);

  isAuthenticated = this.authStateService.isAuthenticated;
  user = this.authStateService.user;

  // Signals para playlists
  playlists = signal<SidebarPlaylist[]>([]);
  isLoadingPlaylists = signal<boolean>(false);
  playlistsError = signal<string | null>(null);

  // Computed para estados de las playlists
  readonly hasPlaylists = computed(() => this.playlists().length > 0);
  readonly showEmptyState = computed(() => 
    !this.isLoadingPlaylists() && !this.playlistsError() && !this.hasPlaylists()
  );

  // Gestión de suscripciones
  private readonly subscriptions = new Set<Subscription>();

  constructor() {
    // Efecto para reaccionar a cambios de autenticación
    effect(() => {
      if (this.isAuthenticated()) {
        this.loadUserPlaylists();
      } else {
        this.clearPlaylists();
      }
    });
  }

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
    // El efecto en el constructor ya maneja la carga de playlists
  }

  ngOnDestroy() {
    // Cleanup de suscripciones
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions.clear();
  }

  private loadUserPlaylists() {
    this.isLoadingPlaylists.set(true);
    this.playlistsError.set(null);

    // Limitar a máximo 4 playlists para el sidebar
    const filters = { page: 1, page_size: 4 };

    const subscription = this.getUserPlaylistsUseCase.execute(filters).subscribe({
      next: (playlists) => {
        console.log('Playlists recibidas en el componente:', playlists);
        
        // Convertir las playlists del dominio al formato del sidebar
        const sidebarPlaylists: SidebarPlaylist[] = playlists.map(playlist => ({
          id: playlist.id,
          name: playlist.name,
          cover: '/assets/playlists/placeholder.jpg', // Por ahora usando placeholder hasta tener campo cover en backend
          total_songs: playlist.total_songs || 0,
          is_public: playlist.is_public
        }));

        this.playlists.set(sidebarPlaylists);
        this.isLoadingPlaylists.set(false);
        
        // Si no hay playlists, no es un error
        if (sidebarPlaylists.length === 0) {
          console.log('No se encontraron playlists del usuario');
        }
      },
      error: (error) => {
        console.error('Error cargando playlists del usuario:', error);
        this.playlistsError.set('Error al conectar con el servidor. Intenta más tarde.');
        this.playlists.set([]);
        this.isLoadingPlaylists.set(false);
      }
    });

    this.subscriptions.add(subscription);
  }

  private clearPlaylists() {
    this.playlists.set([]);
    this.isLoadingPlaylists.set(false);
    this.playlistsError.set(null);
  }

  openCreatePlaylistDialog() {
    // Redirigir a la página de mis playlists donde se puede crear una nueva
    this.router.navigate(['/my-playlists']);
  }
}
