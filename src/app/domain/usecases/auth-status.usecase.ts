import { Injectable } from "@angular/core";
import { AuthStateService } from "@app/domain/services/auth-state-service";
import { LogoutUseCase } from "./logout.usecase";

@Injectable({
  providedIn: "root",
})
export class AuthStatusUseCase {
  constructor(
    private readonly authStateService: AuthStateService,
    private readonly logoutUseCase: LogoutUseCase
  ) {}

  get isAuthenticated() {
    return this.authStateService.isAuthenticated;
  }

  get user() {
    return this.authStateService.user;
  }

  async logout(): Promise<void> {
    await this.logoutUseCase.execute();
  }

  get token(): string | null {
    const token = this.authStateService.token();
    console.log("🔑 AuthStatusUseCase - Obteniendo token:", {
      hasToken: !!token,
      tokenLength: token?.length || 0,
      tokenPreview: token ? token.substring(0, 30) + "..." : "null",
      authState: {
        isAuthenticated: this.authStateService.isAuthenticated(),
        hasUser: !!this.authStateService.user(),
      }
    });
    return token;
  }
}
