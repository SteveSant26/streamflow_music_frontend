import { AuthSession } from './i-auth.repository';

export abstract class IAuthService {
  abstract initializeSession(): Promise<void>;
  abstract getSession(): AuthSession | null;
  abstract isAuthenticated(): boolean;
  abstract getUser(): any;
  abstract onAuthStateChange(callback: (session: AuthSession | null) => void): void;
}
