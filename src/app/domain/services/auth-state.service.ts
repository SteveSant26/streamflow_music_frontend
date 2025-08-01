import { Injectable, signal, computed } from '@angular/core';
import { IAuthRepository, AuthSession } from '@app/domain/repositories/i-auth.repository';

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  private readonly _session = signal<AuthSession | null>(null);
  
  constructor(private readonly authRepository: IAuthRepository) {}

  readonly session = this._session.asReadonly();
  
  readonly isAuthenticated = computed(() => {
    const session = this._session();
    return session?.isAuthenticated ?? false;
  });

  readonly user = computed(() => {
    const session = this._session();
    return session?.user ?? null;
  });

  readonly token = computed(() => {
    const session = this._session();
    return session?.token ?? null;
  });

  async initializeSession(): Promise<void> {
    try {
      const session = await this.authRepository.getCurrentSession();
      this._session.set(session);
    } catch (error) {
      console.error('Error initializing session:', error);
      this._session.set(null);
    }
  }

  updateSession(session: AuthSession | null): void {
    this._session.set(session);
  }

  clearSession(): void {
    this._session.set(null);
  }
}
