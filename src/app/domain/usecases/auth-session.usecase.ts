import { Injectable } from "@angular/core";
import { IAuthRepository } from "../repositories/i-auth.repository";
import { AuthStateService } from "../services/auth-state.service";

@Injectable({ providedIn: "root" })
export class AuthSessionUseCase {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly authStateService: AuthStateService
  ) {}

  async initSession() {
    try {
      const session = await this.authRepository.getCurrentSession();
      this.authStateService.updateSession(session);
      console.log('Session initialized:', session);
    } catch (error) {
      console.error('Error initializing session:', error);
      this.authStateService.clearSession();
    }
  }
}
