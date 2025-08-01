import { Injectable } from "@angular/core";
import {
  IAuthRepository,
  LoginCredentials,
  AuthResult,
} from "../repositories/i-auth.repository";
import { ValidationError } from "../errors/auth.errors";

@Injectable({
  providedIn: "root",
})
export class LoginUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(credentials: LoginCredentials): Promise<AuthResult> {
    if (!credentials.email || !credentials.password) {
      throw new ValidationError("Email and password are required");
    }

    if (!this.isValidEmail(credentials.email)) {
      throw new ValidationError("Invalid email format");
    }

    if (credentials.password.length < 6) {
      throw new ValidationError("Password must be at least 6 characters long");
    }

    return await this.authRepository.login(credentials);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
