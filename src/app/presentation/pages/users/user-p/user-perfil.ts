import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  GetUserProfileUseCase,
  UploadProfilePictureUseCase,
} from '@app/domain/usecases';
import { User } from '@app/domain/entities/user.entity';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-user-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, MatIconModule],
  templateUrl: './user-perfil.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./user-perfil.css'],
})
export class UserPerfilComponent implements OnInit {
  showImageModal = false;
  openImageModal(): void {
    if (this.profileImageUrl()) {
      this.showImageModal = true;
    }
  }

  closeImageModal(): void {
    this.showImageModal = false;
  }
  readonly fb: FormBuilder = inject(FormBuilder);
  private readonly getUserProfileUseCase: GetUserProfileUseCase = inject(
    GetUserProfileUseCase,
  );
  private readonly uploadProfilePictureUseCase: UploadProfilePictureUseCase =
    inject(UploadProfilePictureUseCase);

  // Solo trabajamos con la entidad User
  currentUser = signal<User | null>(null);
  profileImageUrl = signal<string | null>(null);

  // Loading and state properties
  isLoading = signal(false);
  errorMessage = signal<string>('');
  successMessage = signal<string>('');

  // El formulario solo muestra información de solo lectura según la API
  profileForm = this.fb.group({
    email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
    name: [{ value: '', disabled: true }],
  });

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');
    console.log('🔍 Cargando datos del usuario desde backend...');

    this.getUserProfileUseCase.execute().subscribe({
      next: (user: User | null) => {
        if (user) {
          this.currentUser.set(user);
          
          // Actualizar formulario con datos del usuario
          this.profileForm.patchValue({
            email: user.email,
            name: user.name,
          });

          this.profileImageUrl.set(user.profile_picture || null);
          console.log('✅ Perfil cargado:', user);
        } else {
          this.currentUser.set(null);
        }

        this.isLoading.set(false);
      },
      error: (error: any) => {
        console.error('❌ Error al cargar perfil:', error);
        this.errorMessage.set('Error al cargar los datos del perfil');
        this.isLoading.set(false);
      },
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
      this.isLoading.set(true);
      this.errorMessage.set('');
      
      try {
        // Usar caso de uso para validar y subir el archivo
        this.uploadProfilePictureUseCase.execute(file).subscribe({
          next: (response) => {
            console.log('✅ Imagen subida exitosamente:', response);
            
            // Actualizar la URL de la imagen
            this.profileImageUrl.set(response.profile_picture);
            this.successMessage.set('Imagen de perfil actualizada');

            // Actualizar el usuario actual con la nueva imagen
            const currentUser = this.currentUser();
            if (currentUser) {
              this.currentUser.set({
                ...currentUser,
                profile_picture: response.profile_picture,
              });
            }

            this.isLoading.set(false);
            setTimeout(() => this.successMessage.set(''), 3000);
          },
          error: (error) => {
            console.error('❌ Error al subir imagen:', error);
            this.errorMessage.set(error.message || 'Error al subir la imagen');
            this.isLoading.set(false);
          },
        });

        // Crear preview inmediato mientras se sube
        const reader = new FileReader();
        reader.onload = (e) => {
          this.profileImageUrl.set(e.target?.result as string);
        };
        reader.readAsDataURL(file);
        
      } catch (error: any) {
        console.error('❌ Error de validación:', error);
        this.errorMessage.set(error.message);
        this.isLoading.set(false);
      }
    }
  }


  get email() {
    return this.profileForm.get('email');
  }

  get name() {
    return this.profileForm.get('name');
  }
}
