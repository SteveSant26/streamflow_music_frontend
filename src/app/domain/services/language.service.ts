import { Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type Language = 'en' | 'es';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly currentLanguage = signal<Language>('en');

  constructor(private readonly translate: TranslateService) {
    this.initializeLanguage();
  }

  private initializeLanguage(): void {
    const savedLang = localStorage.getItem('app-language') as Language;
    const defaultLang: Language = savedLang || 'en';
    
    this.translate.setDefaultLang(defaultLang);
    this.translate.use(defaultLang);
    this.currentLanguage.set(defaultLang);
  }

  getCurrentLanguage() {
    return this.currentLanguage();
  }

  changeLanguage(language: Language): void {
    this.translate.use(language);
    this.currentLanguage.set(language);
    localStorage.setItem('app-language', language);
  }

  getAvailableLanguages(): { code: Language; name: string }[] {
    return [
      { code: 'en', name: 'English' },
      { code: 'es', name: 'Español' }
    ];
  }
}
