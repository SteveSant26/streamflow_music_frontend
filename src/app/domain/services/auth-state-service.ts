import { Injectable, signal, computed } from '@angular/core';

export interface AuthSession {
  user: any | null;
  isAuthenticated: boolean;
  token: string | null;
}

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  private readonly _session = signal<AuthSession | null>(null);

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

  updateSession(session: AuthSession | null): void {
    console.log('🔄 AuthStateService: Actualizando sesión:', session ? 'Con datos' : 'Null');
    this._session.set(session);
  }

  clearSession(): void {
    console.log('🗑️ AuthStateService: Limpiando sesión');
    this._session.set(null);
  }
}
