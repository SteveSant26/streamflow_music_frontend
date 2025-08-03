import { Provider } from '@angular/core';
import {
  USER_PROFILE_REPOSITORY_TOKEN,
  GetUserProfileUseCase,
} from '../../domain/usecases/get-user-profile.usecase';
import { UserProfileRepository } from '../repositories/user-profile.repository';
import { UpdateUserProfileUseCase } from '../../domain/usecases/update-user-profile.usecase';
import { UploadProfilePictureUseCase } from '../../domain/usecases/upload-profile-picture.usecase';

export const userProfileProviders: Provider[] = [
  {
    provide: USER_PROFILE_REPOSITORY_TOKEN,
    useClass: UserProfileRepository,
  },
  GetUserProfileUseCase,
  UpdateUserProfileUseCase,
  UploadProfilePictureUseCase,
];
