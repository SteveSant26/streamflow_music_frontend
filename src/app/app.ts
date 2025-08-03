import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { AuthSessionUseCase } from '@app/domain/usecases';
import { AsideMenu } from './components/aside-menu/aside-menu';
import { Player } from './components/player/player';
import { CommonModule } from '@angular/common';
import { GlobalPlayerStateService } from './shared/services/global-player-state.service';
import { filter, take } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from './domain/services/language.service';
import { ThemeToggleComponent } from './presentation/components/theme-toggle/theme-toggle';
import { ThemeService } from './shared/services/theme.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    AsideMenu,
    Player,
    CommonModule,
    TranslateModule,
    ThemeToggleComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  showLayout = true;
  private readonly themeService = inject(ThemeService);

  constructor(
    private readonly router: Router,
    private readonly authSessionUseCase: AuthSessionUseCase,
    private readonly globalPlayerState: GlobalPlayerStateService,
    private readonly languageService: LanguageService,
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // Hide layout for login, register and current song pages
        this.showLayout =
          !event.url.includes('/login') &&
          !event.url.includes('/register') &&
          !event.url.includes('/currentSong');
      });
  }

  ngOnInit() {
    // Initialize theme first
    this.initializeTheme();
    
    // Initialize language service
    this.initializeLanguage();

    // Initialize auth session
    this.initializeAuth();

    // Initialize global player state when app starts
    this.globalPlayerState.initializePlayer().catch((error) => {
      console.error('Failed to initialize global player state:', error);
    });
  }

  private initializeTheme() {
    // Asegurar que el tema se aplique correctamente al iniciar la app
    this.themeService.getCurrentTheme().pipe(take(1)).subscribe(theme => {
      console.log('🎨 App: Theme initialized:', theme);
    });
  }

  private initializeLanguage() {
    // Language service automatically initializes on construction
    console.log(
      '🌐 App: Language service initialized with:',
      this.languageService.getCurrentLanguage(),
    );
  }

  private async initializeAuth() {
    try {
      console.log('🔐 App: Inicializando sesión de autenticación');
      await this.authSessionUseCase.initSession();
      console.log('✅ App: Sesión de autenticación inicializada');
    } catch (error) {
      console.error('❌ App: Error inicializando sesión:', error);
    }
  }
}
