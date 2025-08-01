import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
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
  originalValues: { username: string; description: string } = {
    username: "",
    description: "",
  };

  // Profile image properties
  profileImageUrl: string | null = null;
  selectedImageFile: File | null = null;

  // Loading and state properties
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  currentUser: User | null = null;

  constructor(
    readonly fb: FormBuilder,
    private readonly authService: AuthService
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
      description: ["", [Validators.maxLength(500)]],
    });
  }

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    this.isLoading = true;
    this.errorMessage = "";

    console.log("🔍 Iniciando carga de datos del usuario...");

    // Verificar si hay usuario autenticado
    const currentUserValue = this.authService.getCurrentUserValue();
    const isAuth = this.authService.isAuthenticated();
    const token = this.authService.getAuthToken();

    console.log("🔐 Estado de autenticación:", {
      currentUserValue,
      isAuthenticated: isAuth,
      hasToken: !!token,
      token: token ? token.substring(0, 20) + "..." : null,
    });

    console.log("🔍 Cargando datos del usuario desde backend...");

    // Cargar datos del perfil desde el backend
    this.authService.getCurrentUser().subscribe({
      next: (user: User) => {
        console.log("✅ Datos del usuario cargados:", user);
        console.log("📋 Propiedades del usuario:", {
          id: user.id,
          username: user.username,
          email: user.email,
          profileImage: user.profileImage,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          hasEmail: !!user.email,
          emailType: typeof user.email,
        });

        this.currentUser = user;

        // Validar que los datos del usuario estén completos
        if (!user?.email) {
          console.error("❌ Datos del usuario incompletos:", user);
          console.error("❌ user existe:", !!user);
          console.error("❌ user.email existe:", !!user.email);
          console.error("❌ user.email valor:", user.email);
          this.errorMessage = "Error: Datos del usuario incompletos";
          this.isLoading = false;
          return;
        }

        const userData = {
          username: user.username || user.email.split("@")[0],
          email: user.email,
          description: user.profileImage || "", // Usando profileImage como descripción temporal
        };

        this.originalValues = { ...userData };
        this.profileForm.patchValue(userData);

        // Cargar imagen de perfil si existe
        if (user.profileImage) {
          this.profileImageUrl = user.profileImage;
        }

        this.isLoading = false;
      },
      error: (error: any) => {
        console.error("❌ Error al cargar perfil:", error);
        this.errorMessage = "Error al cargar los datos del perfil";
        this.isLoading = false;
      },
    });
  }

  enableEdit(): void {
    this.isEditing = true;
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.profileForm.patchValue(this.originalValues);
  }

  saveProfile(): void {
    if (this.profileForm.valid) {
      this.isLoading = true;
      this.errorMessage = "";
      this.successMessage = "";

      this.isLoading = true;
      this.errorMessage = "";
      this.successMessage = "";

      const formData = this.profileForm.value;

      console.log("🔄 Guardando perfil en backend:", formData);

      // Actualizar perfil usando el AuthService
      this.authService
        .updateProfile({
          username: formData.username,
          email: formData.email,
          // description no está en el modelo User por ahora
        })
        .subscribe({
          next: (updatedUser: User) => {
            console.log("✅ Perfil actualizado exitosamente:", updatedUser);

            // Actualizar datos locales
            this.currentUser = updatedUser;
            this.originalValues = { ...formData };
            this.isEditing = false;
            this.isLoading = false;

            // Mostrar mensaje de éxito
            this.successMessage = "Perfil actualizado exitosamente";

            // Limpiar mensaje después de 3 segundos
            setTimeout(() => {
              this.successMessage = "";
            }, 3000);
          },
          error: (error: any) => {
            console.error("❌ Error al actualizar perfil:", error);
            this.errorMessage =
              error.error?.message || "Error al actualizar el perfil";
            this.isLoading = false;
          },
        });
    } else {
      console.log("❌ Formulario inválido");
      this.markFormGroupTouched();
    }
  }


  // Mantener solo una implementación de markFormGroupTouched

  private markFormGroupTouched(): void {
    Object.keys(this.profileForm.controls).forEach((key) => {
      const control = this.profileForm.get(key);
      control?.markAsTouched();
    });
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
        alert("Por favor selecciona una imagen válida (JPEG, PNG, GIF, WebP)");
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        alert("La imagen es demasiado grande. El tamaño máximo es 5MB");
        return;
      }

      this.selectedImageFile = file;

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        this.profileImageUrl = e.target?.result as string;
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
