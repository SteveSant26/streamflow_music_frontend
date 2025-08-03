import { User } from '../entities/user.entity';
import { GetUserProfileDto, UserProfileResponse } from '../dtos/user-profile.dto';

/**
 * Mapea GetUserProfileDto a entidad User
 */
export function mapUserProfileDtoToEntity(dto: GetUserProfileDto): User {
  return {
    id: dto.id,
    email: dto.email,
    name: dto.email.split('@')[0], // Usar parte del email como nombre temporal
    profile_picture: dto.profile_picture,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * Mapea UserProfileResponse a GetUserProfileDto
 */
export function mapUserProfileResponseToDto(response: UserProfileResponse): GetUserProfileDto {
  return {
    id: response.id,
    email: response.email,
    profile_picture: response.profile_picture,
  };
}

/**
 * Mapea User a GetUserProfileDto
 */
export function mapUserEntityToDto(user: User): GetUserProfileDto {
  return {
    id: user.id,
    email: user.email,
    profile_picture: user.profile_picture,
  };
}
