import { User } from '../entities/user.entity';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
}

export interface AuthResult {
  user: User;
  token: string;
}

export interface AuthSession {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}

export abstract class IAuthRepository {
  abstract login(credentials: LoginCredentials): Promise<AuthResult>;
  abstract register(credentials: RegisterCredentials): Promise<AuthResult>;
  abstract logout(): Promise<void>;
  abstract getCurrentSession(): Promise<AuthSession>;
  abstract refreshSession(): Promise<AuthSession | null>;
  abstract sendPasswordResetEmail(email: string): Promise<void>;
  abstract signInWithProvider(provider: 'google' | 'github' | 'facebook' | 'twitter' | 'discord'): Promise<void>;
}
