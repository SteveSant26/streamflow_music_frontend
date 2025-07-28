import { Injectable } from "@angular/core";
import {
  AuthRepository,
  RegisterCredentials,
  AuthResult,
} from "../repositories/auth.repository";

@Injectable({
  providedIn: "root",
})
export class RegisterUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(credentials: RegisterCredentials): Promise<AuthResult> {
    if (!credentials.email || !credentials.password || !credentials.name) {
      throw new Error("Name, email and password are required");
    }

    if (!this.isValidEmail(credentials.email)) {
      throw new Error("Invalid email format");
    }

    if (credentials.password.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }

    if (credentials.name.trim().length < 2) {
      throw new Error("Name must be at least 2 characters long");
    }

    return await this.authRepository.register(credentials);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
