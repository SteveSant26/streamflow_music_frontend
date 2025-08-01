import { Injectable } from "@angular/core";
import {
  IAuthRepository,
  RegisterCredentials,
  AuthResult,
} from "../repositories/i-auth.repository";
import { AuthStateService } from "../services/auth-state.service";
import { ValidationError } from "../errors/auth.errors";

@Injectable({
  providedIn: "root",
})
export class RegisterSessionUseCase {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly authStateService: AuthStateService
  ) {}

  async execute(credentials: RegisterCredentials): Promise<AuthResult> {
    // Validaciones
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

    // Ejecutar registro
    const result = await this.authRepository.register(credentials);

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
