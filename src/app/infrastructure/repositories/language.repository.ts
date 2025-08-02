import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ILanguageRepository } from '../../domain/repositories/i-language.repository';

@Injectable({
  providedIn: 'root'
})
export class LanguageRepository implements ILanguageRepository {
  private readonly translateService = inject(TranslateService);
  private readonly STORAGE_KEY = 'app-language';
  private readonly DEFAULT_LANGUAGE = 'en';
  private readonly SUPPORTED_LANGUAGES = ['en', 'es'];

  constructor() {
    this.initializeLanguage();
  }

  getCurrentLanguage(): string {
    return this.translateService.currentLang || this.DEFAULT_LANGUAGE;
  }

  setLanguage(language: string): void {
    if (!this.isLanguageSupported(language)) {
      throw new Error(`Language '${language}' is not supported`);
    }

    this.translateService.use(language);
    this.storeLanguage(language);
  }

  getAvailableLanguages(): string[] {
    return [...this.SUPPORTED_LANGUAGES];
  }

  isLanguageSupported(language: string): boolean {
    return this.SUPPORTED_LANGUAGES.includes(language);
  }

  getStoredLanguage(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }
    return localStorage.getItem(this.STORAGE_KEY);
  }

  private initializeLanguage(): void {
    const storedLanguage = this.getStoredLanguage();
    const browserLanguage = this.getBrowserLanguage();
    
    const languageToUse = storedLanguage && this.isLanguageSupported(storedLanguage) 
      ? storedLanguage 
      : this.isLanguageSupported(browserLanguage) 
        ? browserLanguage 
        : this.DEFAULT_LANGUAGE;

    this.translateService.setDefaultLang(this.DEFAULT_LANGUAGE);
    this.setLanguage(languageToUse);
  }

  private storeLanguage(language: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, language);
    }
  }

  private getBrowserLanguage(): string {
    if (typeof window === 'undefined') {
      return this.DEFAULT_LANGUAGE;
    }
    
    const browserLang = navigator.language.split('-')[0];
    return browserLang;
  }
}
