import { Injectable } from "@angular/core";
import {
  LoginCredentials,
  RegisterCredentials,
  AuthResult,
  AuthRepository
} from "@app/domain/repositories/auth.repository";
import { User } from "@app/domain/entities/user.entity";
import { AuthToken } from "@app/domain/entities/auth-token.entity";
import { supabase } from "../supabase/supabase.client";

@Injectable({
  providedIn: "root",
})
export class AuthRepositoryImpl extends AuthRepository {
  async login(credentials: LoginCredentials): Promise<AuthResult> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user || !data.session) {
      throw new Error('Login failed: No user or session data received');
    }

    return {
      user: this.mapSupabaseUserToUser(data.user),
      token: this.mapSupabaseSessionToToken(data.session)
    };
  }

  async register(credentials: RegisterCredentials): Promise<AuthResult> {
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: {
          name: credentials.name
        }
      }
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user || !data.session) {
      throw new Error('Registration failed: No user or session data received');
    }

    return {
      user: this.mapSupabaseUserToUser(data.user),
      token: this.mapSupabaseSessionToToken(data.session)
    };
  }

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  }

  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }

    return this.mapSupabaseUserToUser(user);
  }

  async refreshToken(refreshToken: string): Promise<AuthToken> {
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken
    });

    if (error || !data.session) {
      throw new Error(error?.message || 'Failed to refresh token');
    }

    return this.mapSupabaseSessionToToken(data.session);
  }

  private mapSupabaseUserToUser(supabaseUser: any): User {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name: supabaseUser.user_metadata?.name || supabaseUser.email || '',
      createdAt: new Date(supabaseUser.created_at),
      updatedAt: new Date(supabaseUser.updated_at || supabaseUser.created_at)
    };
  }

  private mapSupabaseSessionToToken(session: any): AuthToken {
    return {
      accessToken: session.access_token,
      refreshToken: session.refresh_token,
      expiresAt: new Date(session.expires_at * 1000)
    };
  }
}
