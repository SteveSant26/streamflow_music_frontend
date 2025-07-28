import { Injectable, signal } from "@angular/core";
import { User } from "@app/domain/entities/user.entity";
import { AuthToken } from "@app/domain/entities/auth-token.entity";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly _user = signal<User | null>(null);
  private readonly _token = signal<AuthToken | null>(null);
  private readonly _isAuthenticated = signal<boolean>(false);

  // Public read-only signals
  readonly user = this._user.asReadonly();
  readonly token = this._token.asReadonly();
  readonly isAuthenticated = this._isAuthenticated.asReadonly();

  constructor() {
    this.loadFromStorage();
  }

  setAuth(user: User, token: AuthToken): void {
    this._user.set(user);
    this._token.set(token);
    this._isAuthenticated.set(true);

    // Almacenar en localStorage
    localStorage.setItem("auth_token", token.accessToken);
    localStorage.setItem("refresh_token", token.refreshToken);
    localStorage.setItem("user", JSON.stringify(user));
  }

  clearAuth(): void {
    this._user.set(null);
    this._token.set(null);
    this._isAuthenticated.set(false);

    // Limpiar localStorage
    localStorage.removeItem("auth_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
  }

  private loadFromStorage(): void {
    try {
      const tokenString = localStorage.getItem("auth_token");
      const refreshTokenString = localStorage.getItem("refresh_token");
      const userString = localStorage.getItem("user");

      if (tokenString && refreshTokenString && userString) {
        const user = JSON.parse(userString);
        const token: AuthToken = {
          accessToken: tokenString,
          refreshToken: refreshTokenString,
          expiresAt: new Date(), // Simplificado, deberías almacenar la fecha real
        };

        this._user.set(user);
        this._token.set(token);
        this._isAuthenticated.set(true);
      }
    } catch (error) {
      console.error("Error loading auth from storage:", error);
      this.clearAuth();
    }
  }
}
