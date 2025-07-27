import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";

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

  constructor(
    readonly router: Router,
    readonly fb: FormBuilder,
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
    // Simulamos datos del usuario - aquí conectarías con tu servicio de usuario
    const userData = {
      username: "StreamFlow User",
      description:
        "Amante de la música y los ritmos que mueven el alma. Siempre en busca de nuevos sonidos.",
    };

    this.originalValues = { ...userData };
    this.profileForm.patchValue(userData);
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
      const formData = this.profileForm.value;

      // Aquí conectarías con tu servicio para guardar los datos
      console.log("Guardando perfil:", formData);

      // Actualizamos los valores originales
      this.originalValues = { ...formData };
      this.isEditing = false;

      // Mostrar mensaje de éxito (puedes implementar un toast o similar)
      this.showSuccessMessage();
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
