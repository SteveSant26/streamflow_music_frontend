import { Injectable } from "@angular/core";
import { IAuthRepository } from "../repositories/i-auth.repository";
import { AuthStateService } from "../services/auth-state.service";

@Injectable({ providedIn: "root" })
export class LogoutUseCase {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly authStateService: AuthStateService
  ) {}

  async execute(): Promise<void> {
    try {
      // Ejecutar logout en el repositorio
      await this.authRepository.logout();

      // Limpiar el estado de autenticación
      this.authStateService.clearSession();
    } catch (error) {
      // Aunque falle el logout remoto, limpiamos el estado local
      this.authStateService.clearSession();
      throw error;
    }
  }
}
