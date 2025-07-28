import { Provider } from '@angular/core';
import { AuthRepository } from '@app/domain/repositories/auth.repository';
import { AuthRepositoryImpl } from '@app/infrastructure/repositories/auth-repository-impl';

export const authProviders: Provider[] = [
  {
    provide: AuthRepository,
    useClass: AuthRepositoryImpl
  }
];
