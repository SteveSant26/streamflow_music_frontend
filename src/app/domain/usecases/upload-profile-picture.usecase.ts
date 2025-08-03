import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { USER_PROFILE_REPOSITORY_TOKEN } from './get-user-profile.usecase';

@Injectable({
  providedIn: 'root',
})
export class UploadProfilePictureUseCase {
  private readonly userProfileRepository = inject(
    USER_PROFILE_REPOSITORY_TOKEN,
  );

  execute(file: File): Observable<{ profile_picture: string }> {
    console.log('📸 UploadProfilePictureUseCase: Subiendo foto de perfil');

    // Validaciones de negocio
    this.validateFile(file);

    return this.userProfileRepository.uploadProfilePicture(file);
  }

  private validateFile(file: File): void {
    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error(
        'Tipo de archivo no permitido. Solo se permiten: JPEG, PNG, GIF, WebP',
      );
    }

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error(
        'El archivo es demasiado grande. El tamaño máximo es 5MB',
      );
    }
  }
}
