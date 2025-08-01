import { Injectable } from "@angular/core";
import {
  IAuthRepository,
  LoginCredentials,
  AuthResult,
} from "../repositories/i-auth.repository";
import { AuthStateService } from "../services/auth-state.service";
import { ValidationError } from "../errors/auth.errors";

@Injectable({
  providedIn: "root",
})
export class LoginSessionUseCase {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly authStateService: AuthStateService
  ) {}

  async execute(credentials: LoginCredentials): Promise<AuthResult> {
    // Validaciones
    if (!credentials.email || !credentials.password) {
      throw new ValidationError("Email and password are required");
    }

    if (!this.isValidEmail(credentials.email)) {
      throw new ValidationError("Invalid email format");
    }

    if (credentials.password.length < 6) {
      throw new ValidationError("Password must be at least 6 characters long");
    }

    // Ejecutar login
    const result = await this.authRepository.login(credentials);

    // Actualizar el estado de autenticación
    this.authStateService.updateSession({
      user: result.user,
      isAuthenticated: true,
      token: result.token
    });

    return result;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
