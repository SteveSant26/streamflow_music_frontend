import { Injectable, inject } from '@angular/core';
import { Language, LanguageService } from '../services/language.service';

@Injectable({
  providedIn: 'root',
})
export class GetCurrentLanguageUseCase {
  private readonly languageRepository = inject(LanguageService);

  execute(): string {
    return 'en';
  }

  async getCurrentLanguage(): Promise<string> {
    return this.languageRepository.getCurrentLanguage();
  }

  async getAvailableLanguages(): Promise<{ code: Language; name: string }[]> {
    return this.languageRepository.getAvailableLanguages();
  }

  async changeLanguage(language: Language): Promise<void> {
    this.languageRepository.changeLanguage(language);
  }
}
