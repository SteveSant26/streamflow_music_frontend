import { InjectionToken } from '@angular/core';
import { IAuthRepository } from '@app/domain/repositories/i-auth.repository';
import { IAuthService } from '@app/domain/repositories/i-auth.service';

export const AUTH_REPOSITORY_TOKEN = new InjectionToken<IAuthRepository>(
  'AuthRepository',
);
export const AUTH_SERVICE_TOKEN = new InjectionToken<IAuthService>(
  'AuthService',
);
