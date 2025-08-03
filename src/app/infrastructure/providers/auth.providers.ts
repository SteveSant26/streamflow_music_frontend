import { Provider } from '@angular/core';
import { IAuthRepository } from '@app/domain/repositories/i-auth.repository';
import { SupabaseAuthRepository } from '@app/infrastructure/repositories/supabase-auth.repository';
import { AUTH_REPOSITORY_TOKEN } from '@app/infrastructure/tokens/auth.tokens';
import { AuthStateService } from '@app/shared/services';

export const authProviders: Provider[] = [
  {
    provide: AUTH_REPOSITORY_TOKEN,
    useClass: SupabaseAuthRepository,
  },
  {
    provide: IAuthRepository,
    useClass: SupabaseAuthRepository,
  },
  AuthStateService,
];
