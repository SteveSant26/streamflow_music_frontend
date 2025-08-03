import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IAuthRepository, LoginCredentials, RegisterCredentials } from '@app/domain/repositories/i-auth.repository';
import { AuthStateService } from '@app/shared/services';

@Injectable({ providedIn: 'root' })
export class AuthSessionUseCase {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly authStateService: AuthStateService,
  ) {}

  async initSession() {
    console.log('🔄 AuthSessionUseCase: Inicializando sesión');

    try {
      const session = await this.authRepository.getCurrentSession();

      if (session?.token && session?.user && session?.isAuthenticated) {
        console.log('✅ AuthSessionUseCase: Sesión válida encontrada:', {
          userEmail: session.user.email,
          isAuthenticated: session.isAuthenticated,
          hasToken: !!session.token,
          userId: session.user.id,
        });
        this.authStateService.updateSession(session);
      } else {
        console.log('❌ AuthSessionUseCase: No hay sesión válida o datos incompletos');
        this.authStateService.clearSession();
      }
    } catch (error) {
      console.error('❌ AuthSessionUseCase: Error obteniendo sesión:', error);
      this.authStateService.clearSession();
    }
  }
}

@Injectable({ providedIn: 'root' })
export class AuthStatusUseCase {
  constructor(private readonly authStateService: AuthStateService) {}

  execute(): Observable<boolean> {
    return of(this.authStateService.isAuthenticated());
  }
}

@Injectable({ providedIn: 'root' })
export class LoginSessionUseCase {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly authStateService: AuthStateService,
  ) {}

  async execute(credentials: LoginCredentials) {
    try {
      const authResult = await this.authRepository.login(credentials);
      const session = {
        user: authResult.user,
        token: authResult.token,
        isAuthenticated: true
      };
      this.authStateService.updateSession(session);
      return authResult;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  }
}

@Injectable({ providedIn: 'root' })
export class RegisterSessionUseCase {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly authStateService: AuthStateService,
  ) {}

  async execute(credentials: RegisterCredentials) {
    try {
      const authResult = await this.authRepository.register(credentials);
      const session = {
        user: authResult.user,
        token: authResult.token,
        isAuthenticated: true
      };
      this.authStateService.updateSession(session);
      return authResult;
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  }
}

@Injectable({ providedIn: 'root' })
export class LogoutUseCase {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly authStateService: AuthStateService,
  ) {}

  async execute() {
    try {
      await this.authRepository.logout();
      this.authStateService.clearSession();
    } catch (error) {
      console.error('Error en logout:', error);
      this.authStateService.clearSession();
    }
  }
}

@Injectable({ providedIn: 'root' })
export class SocialLoginUseCase {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly authStateService: AuthStateService,
  ) {}

  async execute(provider: 'google' | 'github' | 'facebook' | 'twitter' | 'discord') {
    try {
      await this.authRepository.signInWithProvider(provider);
      // El estado se actualizará cuando se complete el flujo OAuth
    } catch (error) {
      console.error('Error en social login:', error);
      throw error;
    }
  }
}

@Injectable({ providedIn: 'root' })
export class ResetPasswordUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(email: string) {
    try {
      return await this.authRepository.sendPasswordResetEmail(email);
    } catch (error) {
      console.error('Error en reset password:', error);
      throw error;
    }
  }
}
