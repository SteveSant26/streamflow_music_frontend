import { Injectable } from "@angular/core";
import {
  IAuthRepository,
  RegisterCredentials,
  AuthResult,
} from "../repositories/i-auth.repository";
import { ValidationError } from "../errors/auth.errors";

@Injectable({
  providedIn: "root",
})
export class RegisterUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(credentials: RegisterCredentials): Promise<AuthResult> {
    if (!credentials.email || !credentials.password || !credentials.name) {
      throw new ValidationError("Name, email and password are required");
    }

    if (!this.isValidEmail(credentials.email)) {
      throw new ValidationError("Invalid email format");
    }

    if (credentials.password.length < 6) {
      throw new ValidationError("Password must be at least 6 characters long");
    }

    if (credentials.name.trim().length < 2) {
      throw new ValidationError("Name must be at least 2 characters long");
    }

    return await this.authRepository.register(credentials);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
