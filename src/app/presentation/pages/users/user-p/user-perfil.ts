import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { GetUserProfileUseCase } from '@app/domain/usecases/get-user-profile.usecase';
import { UpdateUserProfileUseCase } from '@app/domain/usecases/update-user-profile.usecase';
import { UploadProfilePictureUseCase } from '@app/domain/usecases/upload-profile-picture.usecase';
import { GetUserProfileDto } from '@app/domain/dtos/user-profile.dto';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-user-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, MatIconModule],
  templateUrl: './user-perfil.html',
  styleUrls: ['./user-perfil.css'],
})
export class UserPerfilComponent {
  readonly fb: FormBuilder = inject(FormBuilder);
  private readonly getUserProfileUseCase: GetUserProfileUseCase = inject(
    GetUserProfileUseCase,
  );
  private readonly updateUserProfileUseCase: UpdateUserProfileUseCase = inject(
    UpdateUserProfileUseCase,
  );
  private readonly uploadProfilePictureUseCase: UploadProfilePictureUseCase =
    inject(UploadProfilePictureUseCase);

  isEditing = signal(false);

  // Profile data
  currentUser = signal<GetUserProfileDto | null>(null);
  profileImageUrl = signal<string | null>(null);
  selectedImageFile = signal<File | null>(null);

  // Loading and state properties
  isLoading = signal(false);
  errorMessage = signal<string>('');
  successMessage = signal<string>('');

  profileForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  // Comentado temporalmente hasta que el backend esté listo
  /*
    console.log('🔍 Cargando datos del usuario desde backend...');

    // Usar el caso de uso para obtener el perfil
    this.getUserProfileUseCase.execute().subscribe({
      next: (userProfile: GetUserProfileDto) => {
        console.log('✅ Datos del usuario cargados:', userProfile);

        this.currentUser.set(userProfile);

        // Actualizar formulario
        this.profileForm.patchValue({
          email: userProfile.email,
        });

        // Cargar imagen de perfil si existe
        if (userProfile.profile_picture) {
          this.profileImageUrl.set(userProfile.profile_picture);
        }

        this.isLoading.set(false);
      },
      error: (error: any) => {
        console.error('❌ Error al cargar perfil:', error);
        this.errorMessage.set('Error al cargar los datos del perfil');
        this.isLoading.set(false);
      },
    });
    */

  enableEdit(): void {
    this.isEditing.set(true);
  }

  cancelEdit(): void {
    this.isEditing.set(false);
    // Restaurar valores originales
    const user = this.currentUser();
    if (user) {
      this.profileForm.patchValue({
        email: user.email,
      });
    }
  }

  saveProfile(): void {
    if (this.profileForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set('');
      this.successMessage.set('');

      const formData = this.profileForm.value;
      console.log('🔄 Guardando perfil (mock):', formData);

      // Simular guardado con datos mock
      setTimeout(() => {
        const updatedUser: GetUserProfileDto = {
          id: '1',
          email: formData.email || '',
          profile_picture: this.currentUser()?.profile_picture || null,
        };

        console.log('✅ Perfil actualizado exitosamente (mock):', updatedUser);

        // Actualizar datos locales
        this.currentUser.set(updatedUser);
        this.isEditing.set(false);
        this.isLoading.set(false);

        // Mostrar mensaje de éxito
        this.successMessage.set('Perfil actualizado exitosamente');

        // Limpiar mensaje después de 3 segundos
        setTimeout(() => {
          this.successMessage.set('');
        }, 3000);
      }, 1500);

      // Comentado temporalmente hasta que el backend esté listo
      /*
      // Usar caso de uso para actualizar perfil
      this.updateUserProfileUseCase
        .execute({ email: formData.email as string })
        .subscribe({
          next: (updatedUser) => {
            console.log('✅ Perfil actualizado exitosamente:', updatedUser);

            // Actualizar datos locales
            this.currentUser.set(updatedUser);
            this.isEditing.set(false);
            this.isLoading.set(false);

            // Mostrar mensaje de éxito
            this.successMessage.set('Perfil actualizado exitosamente');

            // Limpiar mensaje después de 3 segundos
            setTimeout(() => {
              this.successMessage.set('');
            }, 3000);
          },
          error: (error: any) => {
            console.error('❌ Error al actualizar perfil:', error);
            this.errorMessage.set(
              error.message || 'Error al actualizar el perfil',
            );
            this.isLoading.set(false);
          },
        });
      */
    } else {
      console.log('❌ Formulario inválido');
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.profileForm.controls).forEach((key) => {
      const control = this.profileForm.get(key);
      control?.markAsTouched();
    });
  }

  // Profile image methods
  triggerImageUpload(): void {
    const input = document.getElementById(
      'profileImageInput',
    ) as HTMLInputElement;
    input?.click();
  }

  onImageSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (file) {
      try {
        // Usar caso de uso para validar el archivo
        this.uploadProfilePictureUseCase.execute(file).subscribe({
          next: (response) => {
            console.log('✅ Imagen subida exitosamente:', response);
            this.profileImageUrl.set(response.profile_picture);
            this.successMessage.set('Imagen de perfil actualizada');

            // Actualizar el usuario actual
            const currentUser = this.currentUser();
            if (currentUser) {
              this.currentUser.set({
                ...currentUser,
                profile_picture: response.profile_picture,
              });
            }

            setTimeout(() => this.successMessage.set(''), 3000);
          },
          error: (error) => {
            console.error('❌ Error al subir imagen:', error);
            this.errorMessage.set(error.message || 'Error al subir la imagen');
          },
        });

        // Crear preview inmediato
        this.selectedImageFile.set(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          this.profileImageUrl.set(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } catch (error: any) {
        console.error('❌ Error de validación:', error);
        this.errorMessage.set(error.message);
      }
    }
  }

  removeProfileImage(): void {
    this.selectedImageFile.set(null);
    this.profileImageUrl.set(null);

    // Clear the input
    const input = document.getElementById(
      'profileImageInput',
    ) as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  }

  get email() {
    return this.profileForm.get('email');
  }
}
