import { Injectable } from "@angular/core";
import { IAuthRepository } from "../repositories/i-auth.repository";
import { AuthStateService } from "@app/domain/services/auth-state-service";

@Injectable({ providedIn: "root" })
export class LogoutUseCase {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly authStateService: AuthStateService
  ) {}

  async execute(): Promise<void> {
    console.log('🔄 LogoutUseCase: Iniciando proceso de logout');
    
    try {
      // Primero limpiamos el estado local para prevenir peticiones con token inválido
      console.log('🧹 LogoutUseCase: Limpiando estado local');
      this.authStateService.clearSession();
      
      // Luego ejecutamos logout en el repositorio
      console.log('🌐 LogoutUseCase: Ejecutando logout remoto');
      await this.authRepository.logout();
      
      console.log('✅ LogoutUseCase: Logout completado exitosamente');
    } catch (error) {
      console.error('❌ LogoutUseCase: Error en logout remoto:', error);
      // El estado local ya está limpio, así que el logout local funcionó
      console.log('✅ LogoutUseCase: Estado local limpiado correctamente');
    }
  }
}
