import { InjectionToken } from '@angular/core';

export interface ILanguageRepository {
  getCurrentLanguage(): string;
  setLanguage(language: string): void;
  getAvailableLanguages(): string[];
  isLanguageSupported(language: string): boolean;
  getStoredLanguage(): string | null;
}

export const LANGUAGE_REPOSITORY_TOKEN =
  new InjectionToken<ILanguageRepository>('ILanguageRepository');
