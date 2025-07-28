import { Injectable } from "@angular/core";
import {
  AuthRepository,
  LoginCredentials,
  AuthResult,
} from "../repositories/auth.repository";

@Injectable({
  providedIn: "root",
})
export class LoginUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(credentials: LoginCredentials): Promise<AuthResult> {
    if (!credentials.email || !credentials.password) {
      throw new Error("Email and password are required");
    }

    if (!this.isValidEmail(credentials.email)) {
      throw new Error("Invalid email format");
    }

    if (credentials.password.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }

    return await this.authRepository.login(credentials);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
