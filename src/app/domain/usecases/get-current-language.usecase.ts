import { Injectable, inject } from '@angular/core';
import { LANGUAGE_REPOSITORY_TOKEN } from '../repositories/i-language.repository';

@Injectable({
  providedIn: 'root'
})
export class GetCurrentLanguageUseCase {
  private readonly languageRepository = inject(LANGUAGE_REPOSITORY_TOKEN);

  execute(): string {
    return this.languageRepository.getCurrentLanguage();
  }
}
