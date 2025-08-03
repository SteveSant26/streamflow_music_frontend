import { Observable } from 'rxjs';
import {
  GetUserProfileDto,
} from '../dtos/user-profile.dto';

export interface IUserProfileRepository {
  getCurrentUserProfile(): Observable<GetUserProfileDto>;
  uploadProfilePicture(file: File): Observable<{ profile_picture: string }>;
}
