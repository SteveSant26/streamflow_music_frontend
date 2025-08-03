import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiGetUseCase, ApiPostUseCase, ApiPatchUseCase, ApiUploadUseCase } from '../../domain/usecases/api/api.usecase';
import { API_CONFIG_PROFILE } from '../../config/end-points/api-config-profile';
import { GetUserProfileDto, UpdateUserProfileDto, UserProfileResponse } from '../../domain/dtos/user-profile.dto';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly apiGetUseCase = inject(ApiGetUseCase);
  private readonly apiPostUseCase = inject(ApiPostUseCase);
  private readonly apiPatchUseCase = inject(ApiPatchUseCase);
  private readonly apiUploadUseCase = inject(ApiUploadUseCase);

  /**
   * Obtener perfil del usuario actual
   */
  getCurrentUserProfile(): Observable<GetUserProfileDto> {
    return this.apiGetUseCase.execute<GetUserProfileDto>(
      API_CONFIG_PROFILE.profileMe.get
    );
  }

  /**
   * Obtener perfil por ID
   */
  getUserProfileById(id: string): Observable<GetUserProfileDto> {
    return this.apiGetUseCase.execute<GetUserProfileDto>(
      API_CONFIG_PROFILE.profile.getById(id)
    );
  }

  /**
   * Actualizar perfil del usuario
   * LIMITACIÓN: La API actual solo permite actualizar la imagen de perfil
   * No hay endpoint para actualizar otros campos del perfil
   */
  updateUserProfile(data: UpdateUserProfileDto): Observable<UserProfileResponse> {
    // La API actual NO tiene endpoint para actualizar perfil completo
    // Solo se puede actualizar la imagen usando uploadProfilePicture()
    throw new Error('Full profile update not supported. Use uploadProfilePicture() for image updates.');
  }

  /**
   * Actualizar solo la imagen de perfil (método recomendado)
   * Este es el único campo que se puede actualizar según la API actual
   */
  updateProfilePicture = this.uploadProfilePicture; // Alias más claro

  /**
   * Crear perfil de usuario
   * NOTA: Según la API, los perfiles se crean automáticamente
   * Este método está deshabilitado según la documentación del backend
   */
  private createUserProfile(data: UpdateUserProfileDto): Observable<UserProfileResponse> {
    // Este endpoint está bloqueado según la API YAML
    // "Bloquea la creación de perfiles ya que se crean automáticamente"
    throw new Error('Profile creation is automatic. Manual creation is not allowed.');
  }

  /**
   * Subir imagen de perfil
   */
  uploadProfilePicture(file: File): Observable<{ profile_picture: string }> {
    return this.apiUploadUseCase.execute<{ profile_picture: string }>(
      API_CONFIG_PROFILE.profileMe.uploadProfilePicture,
      file
    );
  }
}
