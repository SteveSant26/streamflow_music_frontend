import { Provider } from '@angular/core';
import { GetUserProfileUseCase, UpdateUserProfileUseCase, UploadProfilePictureUseCase } from '../../domain/usecases';
import { UserProfileRepository } from '../repositories/user-profile.repository';

// Create the token locally since it's not exported from the new consolidated file
export const USER_PROFILE_REPOSITORY_TOKEN = 'USER_PROFILE_REPOSITORY_TOKEN';

export const userProfileProviders: Provider[] = [
  {
    provide: USER_PROFILE_REPOSITORY_TOKEN,
    useClass: UserProfileRepository,
  },
  GetUserProfileUseCase,
  UpdateUserProfileUseCase,
  UploadProfilePictureUseCase,
];
