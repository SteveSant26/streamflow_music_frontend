// DTOs para el perfil de usuario

export interface GetUserProfileDto {
  id: string;
  email: string;
  profile_picture?: string | null;
}

export interface UpdateUserProfileDto {
  email?: string;
  profile_picture?: string | null;
}

export interface UserProfileResponse {
  id: string;
  email: string;
  profile_picture?: string | null;
}

export interface UpdateUserProfilePictureDto {
  profile_picture?: string | null;
}
