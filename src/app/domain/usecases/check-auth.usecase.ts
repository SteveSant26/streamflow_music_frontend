import { Injectable, inject } from "@angular/core";
import { IAuthRepository } from "../repositories/i-auth.repository";

@Injectable({ providedIn: "root" })
export class CheckAuthUseCase {
  private readonly authRepository = inject(IAuthRepository);

  async isAuthenticated(): Promise<boolean> {
    try {
      const session = await this.authRepository.getCurrentSession();
      return session.isAuthenticated;
    } catch {
      return false;
    }
  }

  async getCurrentUser() {
    try {
      const session = await this.authRepository.getCurrentSession();
      return session.user;
    } catch {
      return null;
    }
  }
}
