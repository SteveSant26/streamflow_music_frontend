import { Component, OnInit } from '@angular/core';
import {
  Router,
  RouterOutlet,
  RouterLink,
  NavigationEnd,
} from '@angular/router';
import { AuthSessionUseCase } from '@app/domain/usecases/auth-session.usecase';
import { AsideMenu } from './components/aside-menu/aside-menu';
import { Player } from './components/player/player';
import { CommonModule } from '@angular/common';
import { GlobalPlayerStateService } from './shared/services/global-player-state.service';
import { filter } from 'rxjs';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from './domain/services/language.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, AsideMenu, Player, CommonModule, MatIcon, TranslateModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  showLayout = true;

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
    // Initialize language service first
    this.initializeLanguage();

    // Initialize auth session
    this.initializeAuth();

    // Initialize global player state when app starts
    this.globalPlayerState.initializePlayer().catch((error) => {
      console.error('Failed to initialize global player state:', error);
    });
  }

  private initializeLanguage() {
    // Language service automatically initializes on construction
    console.log('🌐 App: Language service initialized with:', this.languageService.getCurrentLanguage());
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
