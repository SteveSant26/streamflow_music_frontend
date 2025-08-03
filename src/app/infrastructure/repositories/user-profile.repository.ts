import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IUserProfileRepository } from '../../domain/repositories/i-user-profile.repository';
import {
  GetUserProfileDto,
  UpdateUserProfileDto,
  UserProfileResponse,
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

  updateUserProfile(
    updateData: UpdateUserProfileDto,
  ): Observable<UserProfileResponse> {
    console.log(
      '🌐 UserProfileRepository: POST',
      API_CONFIG_PROFILE.profileMe.post,
      updateData,
    );
    return this.apiService.post<UserProfileResponse>(
      API_CONFIG_PROFILE.profileMe.post,
      updateData,
    );
  }

  uploadProfilePicture(file: File): Observable<{ profile_picture: string }> {
    console.log(
      '🌐 UserProfileRepository: POST (FormData)',
      API_CONFIG_PROFILE.profileMe.uploadProfilePicture,
    );

    const formData = new FormData();
    formData.append('profile_picture', file);

    return this.apiService.post<{ profile_picture: string }>(
      API_CONFIG_PROFILE.profileMe.uploadProfilePicture,
      formData,
    );
  }
}
