import { User } from "../entities/user.entity";
import { AuthToken } from "../entities/auth-token.entity";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface AuthResult {
  user: User;
  token: AuthToken;
  needsEmailConfirmation?: boolean;
}

export abstract class AuthRepository {
  abstract login(credentials: LoginCredentials): Promise<AuthResult>;
  abstract register(credentials: RegisterCredentials): Promise<AuthResult>;
  abstract logout(): Promise<void>;
  abstract getCurrentUser(): Promise<User | null>;
  abstract refreshToken(refreshToken: string): Promise<AuthToken>;
}