import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthSessionUseCase } from './domain/usecases';
import { LanguageService } from '@app/shared/services';
import { MaterialThemeService } from './shared/services/material-theme.service';
import { GlobalPlayerStateService } from './infrastructure/services/global-player-state.service';
import { ThemeDirective } from './shared/directives/theme.directive';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ThemeDirective],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private readonly materialThemeService = inject(MaterialThemeService);
  private readonly authSessionUseCase = inject(AuthSessionUseCase);
  private readonly languageService = inject(LanguageService);
  private readonly globalPlayerStateService = inject(GlobalPlayerStateService);

  ngOnInit() {
    // Initialize Material theme (se inicializa automáticamente)
    this.initializeMaterialTheme();

    // Initialize language service
    this.initializeLanguage();

    // Initialize auth session
    this.initializeAuth();

    // Initialize global player state
    this.initializeGlobalPlayerState();
  }
  
  private initializeMaterialTheme() {
    // El MaterialThemeService se inicializa automáticamente en el constructor
    // this.materialThemeService.initSystemThemeListener();
  }

  private initializeLanguage() {
    // Initialize language service and set default language
    this.languageService.getCurrentLanguage().subscribe((currentLang) => {
      // Force a manual translation update to ensure UI reflects the language
      this.languageService.changeLanguage(currentLang as 'en' | 'es');
    });
  }

  private async initializeAuth() {
    try {
      await this.authSessionUseCase.initSession();
    } catch (error) {
      console.error('❌ App: Error inicializando sesión:', error);
      // No lanzar error para evitar que falle la inicialización de la app
    }
  }

  private initializeGlobalPlayerState() {
    // Initialize the global player state service
    console.log('🎵 Initializing global player state...');
    this.globalPlayerStateService.ensureInitialized();
  }
}
