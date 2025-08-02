import { Injectable, inject } from '@angular/core';
import { LANGUAGE_REPOSITORY_TOKEN } from '../repositories/i-language.repository';

@Injectable({
  providedIn: 'root'
})
export class ChangeLanguageUseCase {
  private readonly languageRepository = inject(LANGUAGE_REPOSITORY_TOKEN);

  execute(language: string): void {
    if (!this.languageRepository.isLanguageSupported(language)) {
      throw new Error(`Language '${language}' is not supported`);
    }
    
    this.languageRepository.setLanguage(language);
  }
}
