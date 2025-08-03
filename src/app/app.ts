import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthSessionUseCase } from './domain/usecases';
import { LanguageService } from './domain/services';
import { ThemeService } from './shared/services/theme.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private readonly themeService = inject(ThemeService);
  private readonly authSessionUseCase = inject(AuthSessionUseCase);
  private readonly languageService = inject(LanguageService);

  ngOnInit() {
    // Initialize theme first
    this.initializeTheme();

    // Initialize language service
    this.initializeLanguage();

    // Initialize auth session
    this.initializeAuth();
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

  private initializeTheme() {
    // Asegurar que el tema se aplique correctamente al iniciar la app
    this.themeService.getCurrentTheme().pipe(take(1)).subscribe();
  }
}
