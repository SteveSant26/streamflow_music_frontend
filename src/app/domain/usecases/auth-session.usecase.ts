import { Injectable } from '@angular/core';
import { IAuthRepository } from '@app/domain/repositories/i-auth.repository';
import { AuthStateService } from '@app/domain/services/auth-state-service';

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

      if (session?.token && session?.user) {
        console.log('✅ AuthSessionUseCase: Sesión válida encontrada:', {
          userEmail: session.user.email,
          isAuthenticated: session.isAuthenticated,
          hasToken: !!session.token,
        });
        this.authStateService.updateSession(session);
      } else {
        console.log('❌ AuthSessionUseCase: No hay sesión válida');
        this.authStateService.clearSession();
      }
    } catch (error) {
      console.error('❌ AuthSessionUseCase: Error obteniendo sesión:', error);
      this.authStateService.clearSession();
    }
  }
}
