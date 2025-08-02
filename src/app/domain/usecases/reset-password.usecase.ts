import { Injectable } from "@angular/core";
import { IAuthRepository } from "../repositories/i-auth.repository";
import { ValidationError } from "../errors/auth.errors";

@Injectable({ providedIn: "root" })
export class ResetPasswordUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(email: string): Promise<void> {
    if (!email || email.trim() === '') {
      throw new ValidationError("Email is required");
    }

    if (!this.isValidEmail(email)) {
      throw new ValidationError("Invalid email format");
    }

    await this.authRepository.sendPasswordResetEmail(email);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
