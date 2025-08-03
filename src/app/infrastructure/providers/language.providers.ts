import { Provider } from '@angular/core';
import { LANGUAGE_REPOSITORY_TOKEN } from '../../domain/repositories/i-language.repository';
import { LanguageRepository } from '../repositories/language.repository';
import { ChangeLanguageUseCase, GetCurrentLanguageUseCase, GetAvailableLanguagesUseCase } from '../../domain/usecases';

export const languageProviders: Provider[] = [
  {
    provide: LANGUAGE_REPOSITORY_TOKEN,
    useClass: LanguageRepository,
  },
  ChangeLanguageUseCase,
  GetCurrentLanguageUseCase,
  GetAvailableLanguagesUseCase,
];
