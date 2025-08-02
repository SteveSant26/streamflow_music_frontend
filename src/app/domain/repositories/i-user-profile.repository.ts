import { Observable } from 'rxjs';
import { GetUserProfileDto, UpdateUserProfileDto, UserProfileResponse } from '../dtos/user-profile.dto';

export interface IUserProfileRepository {
  getCurrentUserProfile(): Observable<GetUserProfileDto>;
  updateUserProfile(updateData: UpdateUserProfileDto): Observable<UserProfileResponse>;
  uploadProfilePicture(file: File): Observable<{ profile_picture: string }>;
}
