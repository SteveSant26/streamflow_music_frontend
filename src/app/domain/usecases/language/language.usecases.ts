import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LANGUAGE_REPOSITORY_TOKEN } from '../../repositories/i-language.repository';

export type Language = 'en' | 'es';

@Injectable({
  providedIn: 'root'
})
export class GetCurrentLanguageUseCase {
  private readonly languageRepository = inject(LANGUAGE_REPOSITORY_TOKEN);

  execute(): Observable<string> {
    const currentLanguage = this.languageRepository.getCurrentLanguage();
    return of(currentLanguage);
  }
}

@Injectable({
  providedIn: 'root'
})
export class GetAvailableLanguagesUseCase {
  private readonly languageRepository = inject(LANGUAGE_REPOSITORY_TOKEN);

  execute(): Observable<{ code: Language; name: string }[]> {
    const availableLanguages = this.languageRepository.getAvailableLanguages();
    const languagesWithNames = availableLanguages.map((code: string) => ({
      code: code as Language,
      name: this.getLanguageDisplayName(code)
    }));
    
    return of(languagesWithNames);
  }

  private getLanguageDisplayName(code: string): string {
    const displayNames: Record<string, string> = {
      'en': 'English',
      'es': 'Español'
    };
    return displayNames[code] || code;
  }
}

@Injectable({
  providedIn: 'root'
})
export class ChangeLanguageUseCase {
  private readonly languageRepository = inject(LANGUAGE_REPOSITORY_TOKEN);

  execute(language: Language): Observable<void> {
    return new Observable(observer => {
      try {
        this.languageRepository.setLanguage(language);
        observer.next();
        observer.complete();
      } catch (error) {
        observer.error(error);
      }
    });
  }
}
