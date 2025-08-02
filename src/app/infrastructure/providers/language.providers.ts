import { Provider } from '@angular/core';
import { LANGUAGE_REPOSITORY_TOKEN } from '../../domain/repositories/i-language.repository';
import { LanguageRepository } from '../repositories/language.repository';
import { ChangeLanguageUseCase } from '../../domain/usecases/change-language.usecase';
import { GetCurrentLanguageUseCase } from '../../domain/usecases/get-current-language.usecase';
import { GetAvailableLanguagesUseCase } from '../../domain/usecases/get-available-languages.usecase';

export const languageProviders: Provider[] = [
  {
    provide: LANGUAGE_REPOSITORY_TOKEN,
    useClass: LanguageRepository
  },
  ChangeLanguageUseCase,
  GetCurrentLanguageUseCase,
  GetAvailableLanguagesUseCase
];
