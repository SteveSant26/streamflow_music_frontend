import { Injectable, inject, signal } from '@angular/core';
import { ChangeLanguageUseCase } from '../usecases/change-language.usecase';
import { GetCurrentLanguageUseCase } from '../usecases/get-current-language.usecase';
import { GetAvailableLanguagesUseCase } from '../usecases/get-available-languages.usecase';

export type Language = 'en' | 'es';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly changeLanguageUseCase = inject(ChangeLanguageUseCase);
  private readonly getCurrentLanguageUseCase = inject(GetCurrentLanguageUseCase);
  private readonly getAvailableLanguagesUseCase = inject(GetAvailableLanguagesUseCase);

  // Signal para reactivity
  private readonly currentLanguageSignal = signal<Language>('en');

  constructor() {
    // Initialize the signal with current language
    const currentLang = this.getCurrentLanguage() as Language;
    this.currentLanguageSignal.set(currentLang);
  }

  getCurrentLanguage(): string {
    return this.getCurrentLanguageUseCase.execute();
  }

  changeLanguage(language: Language): void {
    try {
      this.changeLanguageUseCase.execute(language);
      this.currentLanguageSignal.set(language);
    } catch (error) {
      console.error('Error changing language:', error);
      throw error;
    }
  }

  getAvailableLanguages(): { code: Language; name: string }[] {
    const languages = this.getAvailableLanguagesUseCase.execute();
    
    return languages.map(lang => ({
      code: lang as Language,
      name: lang === 'en' ? 'English' : 'Español'
    }));
  }

  // Getter for reactive signal
  get currentLanguage() {
    return this.currentLanguageSignal.asReadonly();
  }
}
