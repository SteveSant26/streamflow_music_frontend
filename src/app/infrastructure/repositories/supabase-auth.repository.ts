import { Injectable, inject } from '@angular/core';
import {
  IAuthRepository,
  LoginCredentials,
  RegisterCredentials,
  AuthResult,
  AuthSession,
} from '@app/domain/repositories/i-auth.repository';
import { SupabaseService } from '../supabase/supabase.service';
import { User } from '@app/domain/entities/user.entity';
import {
  AuthError,
  LoginError,
  RegisterError,
  SessionError,
  NetworkError,
} from '@app/domain/errors/auth.errors';

@Injectable()
export class SupabaseAuthRepository implements IAuthRepository {
  private readonly supabaseService = inject(SupabaseService);

  async login(credentials: LoginCredentials): Promise<AuthResult> {
    try {
      const { data, error } =
        await this.supabaseService.client.auth.signInWithPassword(credentials);

      if (error) {
        throw new LoginError('Error al iniciar sesión', error);
      }

      if (!data.user || !data.session) {
        throw new LoginError('No se pudo obtener la sesión del usuario');
      }

      return {
        user: this.mapSupabaseUserToDomain(data.user),
        token: data.session.access_token,
      };
    } catch (error) {
      if (error instanceof AuthError) throw error;
      throw new NetworkError('Error de conexión al iniciar sesión', error);
    }
  }

  async register(credentials: RegisterCredentials): Promise<AuthResult> {
    try {
      const { data, error } = await this.supabaseService.client.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            name: credentials.name,
          },
        },
      });

      if (error) {
        throw new RegisterError('Error al registrarse', error);
      }

      if (!data.user || !data.session) {
        throw new RegisterError('No se pudo crear la cuenta del usuario');
      }

      return {
        user: this.mapSupabaseUserToDomain(data.user),
        token: data.session.access_token,
      };
    } catch (error) {
      if (error instanceof AuthError) throw error;
      throw new NetworkError('Error de conexión al registrarse', error);
    }
  }

  async logout(): Promise<void> {
    try {
      const { error } = await this.supabaseService.client.auth.signOut();
      if (error) {
        throw new SessionError('Error al cerrar sesión', error);
      }
    } catch (error) {
      if (error instanceof AuthError) throw error;
      throw new NetworkError('Error de conexión al cerrar sesión', error);
    }
  }

  async getCurrentSession(): Promise<AuthSession> {
    try {
      const { data, error } =
        await this.supabaseService.client.auth.getSession();

      if (error) {
        throw new SessionError('Error al obtener la sesión', error);
      }

      return {
        user: data.session?.user
          ? this.mapSupabaseUserToDomain(data.session.user)
          : null,
        isAuthenticated: !!data.session,
        token: data.session?.access_token || null,
      };
    } catch (error) {
      if (error instanceof AuthError) throw error;
      throw new NetworkError('Error de conexión al obtener la sesión', error);
    }
  }

  async refreshSession(): Promise<AuthSession | null> {
    try {
      const { data, error } =
        await this.supabaseService.client.auth.refreshSession();

      if (error) {
        throw new SessionError('Error al refrescar la sesión', error);
      }

      if (!data.session) return null;

      return {
        user: data.session.user
          ? this.mapSupabaseUserToDomain(data.session.user)
          : null,
        isAuthenticated: !!data.session,
        token: data.session.access_token,
      };
    } catch (error) {
      if (error instanceof AuthError) throw error;
      throw new NetworkError('Error de conexión al refrescar la sesión', error);
    }
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      const { error } =
        await this.supabaseService.client.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin + '/reset-password',
        });

      if (error) {
        throw new AuthError(
          'Error al enviar el correo de recuperación',
          'PASSWORD_RESET_ERROR',
          error,
        );
      }
    } catch (error) {
      if (error instanceof AuthError) throw error;
      throw new NetworkError('Error de conexión al enviar el correo', error);
    }
  }

  async signInWithProvider(
    provider: 'google' | 'github' | 'facebook' | 'twitter' | 'discord',
  ): Promise<void> {
    try {
      const { error } = await this.supabaseService.client.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) {
        throw new LoginError(`Error al iniciar sesión con ${provider}`, error);
      }
    } catch (error) {
      if (error instanceof AuthError) throw error;
      throw new NetworkError(`Error de conexión con ${provider}`, error);
    }
  }

  private mapSupabaseUserToDomain(supabaseUser: any): User {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email ?? '',
      name: supabaseUser.user_metadata?.name ?? '',
      createdAt: new Date(supabaseUser.created_at ?? ''),
      updatedAt: new Date(supabaseUser.updated_at ?? ''),
    };
  }
}
