import { Injectable, InjectionToken, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IUserProfileRepository } from '../repositories/i-user-profile.repository';
import { GetUserProfileDto } from '../dtos/user-profile.dto';

export const USER_PROFILE_REPOSITORY_TOKEN =
  new InjectionToken<IUserProfileRepository>('IUserProfileRepository');

@Injectable({
  providedIn: 'root',
})
export class GetUserProfileUseCase {
  private readonly userProfileRepository = inject(
    USER_PROFILE_REPOSITORY_TOKEN,
  );

  execute(): Observable<GetUserProfileDto> {
    console.log('🔍 GetUserProfileUseCase: Obteniendo perfil del usuario');
    return this.userProfileRepository.getCurrentUserProfile();
  }
}
