import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IUserProfileRepository } from '../../domain/repositories/i-user-profile.repository';
import {
  GetUserProfileDto,
} from '../../domain/dtos/user-profile.dto';
import { ApiService } from '../services/api-service';
import { API_CONFIG_PROFILE } from '../../config/end-points/api-config-profile';

@Injectable({
  providedIn: 'root',
})
export class UserProfileRepository implements IUserProfileRepository {
  private readonly apiService = inject(ApiService);

  getCurrentUserProfile(): Observable<GetUserProfileDto> {
    console.log(
      '🌐 UserProfileRepository: GET',
      API_CONFIG_PROFILE.profileMe.get,
    );
    return this.apiService.get<GetUserProfileDto>(
      API_CONFIG_PROFILE.profileMe.get,
    );
  }

  uploadProfilePicture(file: File): Observable<{ profile_picture: string }> {
    console.log(
      '🌐 UserProfileRepository: POST (FormData)',
      API_CONFIG_PROFILE.profileUploadPicture.post,
    );

    const formData = new FormData();
    formData.append('profile_picture', file);

    return this.apiService.post<{ profile_picture: string }>(
      API_CONFIG_PROFILE.profileUploadPicture.post,
      formData,
    );
  }
}
