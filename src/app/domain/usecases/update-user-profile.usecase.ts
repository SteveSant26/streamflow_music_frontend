import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { USER_PROFILE_REPOSITORY_TOKEN } from './get-user-profile.usecase';
import {
  UpdateUserProfileDto,
  UserProfileResponse,
} from '../dtos/user-profile.dto';

@Injectable({
  providedIn: 'root',
})
export class UpdateUserProfileUseCase {
  private readonly userProfileRepository = inject(
    USER_PROFILE_REPOSITORY_TOKEN,
  );

  execute(updateData: UpdateUserProfileDto): Observable<UserProfileResponse> {
    console.log(
      '🔄 UpdateUserProfileUseCase: Actualizando perfil:',
      updateData,
    );

    // Validaciones de negocio
    if (updateData.email && !this.isValidEmail(updateData.email)) {
      throw new Error('El formato del email es inválido');
    }

    return this.userProfileRepository.updateUserProfile(updateData);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
