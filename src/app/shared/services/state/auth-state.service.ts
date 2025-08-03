import {
  Injectable,
  signal,
  computed,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  IAuthRepository,
  AuthSession,
} from '@app/domain/repositories/i-auth.repository';

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly _session = signal<AuthSession | null>(null);
  private readonly STORAGE_KEY = 'auth-session';

  constructor(private readonly authRepository: IAuthRepository) {
    // Inicializar desde localStorage si estamos en el navegador
    if (isPlatformBrowser(this.platformId)) {
      this.loadFromStorage();
    }
  }

  readonly session = this._session.asReadonly();

  readonly isAuthenticated = computed(() => {
    const session = this._session();
    return !!session?.isAuthenticated && !!session?.token && !!session?.user;
  });

  readonly user = computed(() => {
    const session = this._session();
    return session?.user ?? null;
  });

  readonly token = computed(() => {
    const session = this._session();
    return session?.token ?? null;
  });

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const session = JSON.parse(stored) as AuthSession;
        // Verificar que la sesión tenga los campos necesarios
        if (session?.token && session?.user) {
          console.log('📦 AuthStateService: Sesión cargada desde localStorage');
          this._session.set(session);
        } else {
          console.log(
            '🗑️ AuthStateService: Sesión inválida en localStorage, limpiando',
          );
          this.clearStorage();
        }
      }
    } catch (error) {
      console.error(
        '❌ AuthStateService: Error cargando desde localStorage:',
        error,
      );
      this.clearStorage();
    }
  }

  private saveToStorage(session: AuthSession | null): void {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      if (session) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(session));
        console.log('💾 AuthStateService: Sesión guardada en localStorage');
      } else {
        this.clearStorage();
      }
    } catch (error) {
      console.error(
        '❌ AuthStateService: Error guardando en localStorage:',
        error,
      );
    }
  }

  private clearStorage(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      localStorage.removeItem(this.STORAGE_KEY);
      console.log('🗑️ AuthStateService: localStorage limpiado');
    } catch (error) {
      console.error(
        '❌ AuthStateService: Error limpiando localStorage:',
        error,
      );
    }
  }

  async initializeSession(): Promise<void> {
    try {
      const session = await this.authRepository.getCurrentSession();
      this.updateSession(session);
    } catch (error) {
      console.error('Error initializing session:', error);
      this.clearSession();
    }
  }

  updateSession(session: AuthSession | null): void {
    console.log(
      '🔄 AuthStateService: Actualizando sesión:',
      session ? 'Con datos' : 'Null',
    );
    this._session.set(session);
    this.saveToStorage(session);
  }

  clearSession(): void {
    console.log('🗑️ AuthStateService: Limpiando sesión');
    this._session.set(null);
    this.clearStorage();
  }
}
