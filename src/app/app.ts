import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthSessionUseCase } from './domain/usecases';
import { LanguageService } from '@app/shared/services';
import { MaterialThemeService } from './shared/services/material-theme.service';
import { GlobalPlayerStateService } from './infrastructure/services/global-player-state.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
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

    // Initializek language service
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
    // Simplemente verificar que el servicio de idioma esté inicializado
    // El LanguageRepository ya maneja la inicialización automática
    console.log('🌐 Language service initialized');
    
    this.languageService.getCurrentLanguage().subscribe((currentLang) => {
      console.log('📍 Current language:', currentLang);
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
