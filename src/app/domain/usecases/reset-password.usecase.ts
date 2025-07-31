import { Injectable } from "@angular/core";
import { AuthService } from "../../shared/services/auth.service";

@Injectable({ providedIn: "root" })
export class ResetPasswordUseCase {
  constructor(private readonly authService: AuthService) {}

  async execute(email: string): Promise<void> {
    await this.authService.sendPasswordResetEmail(email);
  }
}
