import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiGetUseCase, ApiPostUseCase } from '../../domain/usecases/api/api.usecase';
import { API_CONFIG_PROFILE } from '../../config/end-points/api-config-profile';
import { GetUserProfileDto } from '../../domain/dtos/user-profile.dto';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly apiGetUseCase = inject(ApiGetUseCase);
  private readonly apiPostUseCase = inject(ApiPostUseCase);

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
   * Subir imagen de perfil usando FormData
   * Según la API: POST /api/user/profile/upload-profile-picture/
   */
  uploadProfilePicture(file: File): Observable<{ profile_picture: string }> {
    const formData = new FormData();
    formData.append('profile_picture', file);
    
    return this.apiPostUseCase.execute<{ profile_picture: string }>(
      API_CONFIG_PROFILE.profileUploadPicture.post,
      formData
    );
  }
}
