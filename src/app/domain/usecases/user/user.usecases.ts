import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { User } from '../../entities/user.entity';
import { ProfileService } from '../../../infrastructure/services/profile.service';
import { GetUserProfileDto } from '../../dtos/user-profile.dto';
import { mapUserProfileDtoToEntity } from '../../mappers/user.mapper';

@Injectable({
  providedIn: 'root',
})
export class GetUserProfileUseCase {
  private readonly profileService = inject(ProfileService);

  execute(): Observable<User | null> {
    return this.profileService.getCurrentUserProfile().pipe(
      map((dto: GetUserProfileDto) => {
        console.log('✅ Perfil obtenido:', dto);
        // Usar mapper para convertir DTO a entidad User
        return mapUserProfileDtoToEntity(dto);
      }),
    );
  }
}

@Injectable({
  providedIn: 'root',
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
      throw new Error(
        'Tipo de archivo no permitido. Solo JPEG, PNG, GIF y WebP.',
      );
    }

    return this.profileService.uploadProfilePicture(file);
  }
}
