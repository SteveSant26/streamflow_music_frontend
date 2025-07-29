import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { User } from "../../models";

@Component({
  selector: "app-user-perfil",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./user-perfil.html",
  styleUrls: ["./user-perfil.css"],
})
export class UserPerfilComponent implements OnInit {
  profileForm: FormGroup;
  isEditing = false;
  currentUser: User | null = null;
  originalValues: { username: string; description: string } = {
    username: "",
    description: "",
  };

  // Profile image properties
  profileImageUrl: string | null = null;
  selectedImageFile: File | null = null;
  isLoading = false;
  errorMessage = "";
  successMessage = "";

  constructor(
    readonly router: Router,
    readonly fb: FormBuilder,
    private authService: AuthService,
  ) {
    this.profileForm = this.fb.group({
      username: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ],
      ],
      email: [{ value: "", disabled: true }], // Email no editable
      description: ["", [Validators.maxLength(500)]],
    });
  }

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    // Verificar si el usuario está autenticado
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(["/login"]);
      return;
    }

    // Obtener el usuario actual del AuthService
    this.currentUser = this.authService.getCurrentUserValue();

    if (this.currentUser) {
      const userData = {
        username:
          this.currentUser.username || this.currentUser.email.split("@")[0],
        email: this.currentUser.email,
        description: "", // Por ahora no tenemos descripción en el backend
      };

      this.originalValues = {
        username: userData.username,
        description: userData.description,
      };

      this.profileForm.patchValue(userData);

      // Cargar imagen de perfil si existe
      if (this.currentUser.profileImage) {
        this.profileImageUrl = this.currentUser.profileImage;
      }
    }
  }

  enableEdit(): void {
    this.isEditing = true;
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.errorMessage = "";
    this.successMessage = "";
    this.profileForm.patchValue(this.originalValues);
  }

  saveProfile(): void {
    if (this.profileForm.valid) {
      this.isLoading = true;
      this.errorMessage = "";
      this.successMessage = "";

      const formData = this.profileForm.value;

      // Actualizar perfil usando AuthService
      this.authService
        .updateProfile({
          username: formData.username,
          // Agregar más campos según sea necesario
        })
        .subscribe({
          next: (updatedUser) => {
            console.log("Perfil actualizado:", updatedUser);

            // Actualizar datos locales
            this.currentUser = updatedUser;
            this.originalValues = {
              username: formData.username,
              description: formData.description,
            };
            this.isEditing = false;
            this.isLoading = false;
            this.successMessage = "Perfil actualizado exitosamente";

            // Limpiar mensaje después de 3 segundos
            setTimeout(() => (this.successMessage = ""), 3000);
          },
          error: (error) => {
            console.error("Error al actualizar perfil:", error);
            this.errorMessage =
              error.error?.message || "Error al actualizar el perfil";
            this.isLoading = false;
          },
        });
    }
  }

  // Método para subir imagen de perfil
  uploadProfileImage(): void {
    if (this.selectedImageFile) {
      this.isLoading = true;
      this.errorMessage = "";

      this.authService.uploadProfileImage(this.selectedImageFile).subscribe({
        next: (updatedUser) => {
          console.log("Imagen de perfil actualizada:", updatedUser);
          this.currentUser = updatedUser;
          this.profileImageUrl = updatedUser.profileImage || null;
          this.selectedImageFile = null;
          this.isLoading = false;
          this.successMessage = "Imagen de perfil actualizada exitosamente";

          // Limpiar mensaje después de 3 segundos
          setTimeout(() => (this.successMessage = ""), 3000);
        },
        error: (error) => {
          console.error("Error al subir imagen:", error);
          this.errorMessage =
            error.error?.message || "Error al subir la imagen";
          this.isLoading = false;
        },
      });
    }
  }

  private showSuccessMessage(): void {
    // Implementar notificación de éxito
    console.log("Perfil actualizado exitosamente");
  }

  // Profile image methods
  triggerImageUpload(): void {
    const input = document.getElementById(
      "profileImageInput",
    ) as HTMLInputElement;
    input?.click();
  }

  onImageSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (file) {
      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        this.errorMessage =
          "Por favor selecciona una imagen válida (JPEG, PNG, GIF, WebP)";
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        this.errorMessage =
          "La imagen es demasiado grande. El tamaño máximo es 5MB";
        return;
      }

      this.selectedImageFile = file;

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        this.profileImageUrl = e.target?.result as string;

        // Subir automáticamente la imagen al backend
        this.uploadProfileImage();
      };
      reader.readAsDataURL(file);
    }
  }

  removeProfileImage(): void {
    this.selectedImageFile = null;
    this.profileImageUrl = null;

    // Clear the input
    const input = document.getElementById(
      "profileImageInput",
    ) as HTMLInputElement;
    if (input) {
      input.value = "";
    }
  }

  get username() {
    return this.profileForm.get("username");
  }

  get description() {
    return this.profileForm.get("description");
  }
}
