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
   */
  updateUserProfile(data: UpdateUserProfileDto): Observable<UserProfileResponse> {
    return this.apiPatchUseCase.execute<UserProfileResponse>(
      API_CONFIG_PROFILE.profileMe.get,
      data
    );
  }

  /**
   * Crear perfil de usuario
   */
  createUserProfile(data: UpdateUserProfileDto): Observable<UserProfileResponse> {
    return this.apiPostUseCase.execute<UserProfileResponse>(
      API_CONFIG_PROFILE.profileMe.post,
      data
    );
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
