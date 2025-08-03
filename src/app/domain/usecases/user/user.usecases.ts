import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { User } from '../../entities/user.entity';
import { ProfileService } from '../../../infrastructure/services/profile.service';
import { GetUserProfileDto, UpdateUserProfileDto } from '../../dtos/user-profile.dto';

export interface UpdateUserProfileData {
  name?: string;
  email?: string;
  phone?: string;
  bio?: string;
}

@Injectable({
  providedIn: 'root'
})
export class GetUserProfileUseCase {
  private readonly profileService = inject(ProfileService);

  execute(): Observable<User | null> {
    return this.profileService.getCurrentUserProfile().pipe(
      map((dto: GetUserProfileDto) => {
        // Mapear DTO a entidad User
        const user: User = {
          id: dto.id,
          email: dto.email,
          name: dto.email.split('@')[0], // Usar parte del email como nombre temporal
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        return user;
      })
    );
  }
}

@Injectable({
  providedIn: 'root'
})
export class UpdateUserProfileUseCase {
  private readonly profileService = inject(ProfileService);

  execute(data: UpdateUserProfileData): Observable<GetUserProfileDto> {
    const updateDto: UpdateUserProfileDto = {
      email: data.email,
      profile_picture: undefined // Se manejará por separado
    };

    return this.profileService.updateUserProfile(updateDto).pipe(
      map((response) => ({
        id: response.id,
        email: response.email,
        profile_picture: response.profile_picture
      }))
    );
  }
}

@Injectable({
  providedIn: 'root'
})
export class UploadProfilePictureUseCase {
  private readonly profileService = inject(ProfileService);

  execute(file: File): Observable<{ profile_picture: string }> {
    // Validar archivo antes de subir
    if (!file) {
      throw new Error('No se ha seleccionado ningún archivo');
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('El archivo es demasiado grande. Máximo 5MB.');
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Tipo de archivo no permitido. Solo JPEG, PNG, GIF y WebP.');
    }

    return this.profileService.uploadProfilePicture(file);
  }
}
