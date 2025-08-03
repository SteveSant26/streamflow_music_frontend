import { Injectable, inject, signal } from '@angular/core';
import { ChangeLanguageUseCase, GetCurrentLanguageUseCase, GetAvailableLanguagesUseCase } from '@app/domain/usecases';
import { Observable } from 'rxjs';

export type Language = 'en' | 'es';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly changeLanguageUseCase = inject(ChangeLanguageUseCase);
  private readonly getCurrentLanguageUseCase = inject(
    GetCurrentLanguageUseCase,
  );
  private readonly getAvailableLanguagesUseCase = inject(
    GetAvailableLanguagesUseCase,
  );

  // Signal para reactivity
  private readonly currentLanguageSignal = signal<Language>('en');

  constructor() {
    // Initialize the signal with current language
    this.getCurrentLanguage().subscribe(currentLang => {
      const lang = currentLang as Language;
      this.currentLanguageSignal.set(lang);
    });
  }

  getCurrentLanguage(): Observable<string> {
    return this.getCurrentLanguageUseCase.execute();
  }

  changeLanguage(language: Language): void {
    try {
      this.changeLanguageUseCase.execute(language).subscribe({
        next: () => {
          this.currentLanguageSignal.set(language);
          console.log('✅ Language changed to:', language);
        },
        error: (error) => {
          console.error('Error changing language:', error);
          throw error;
        }
      });
    } catch (error) {
      console.error('Error changing language:', error);
      throw error;
    }
  }

  getAvailableLanguages(): Observable<{ code: Language; name: string }[]> {
    return this.getAvailableLanguagesUseCase.execute();
  }

  // Getter for reactive signal
  get currentLanguage() {
    return this.currentLanguageSignal.asReadonly();
  }
}
