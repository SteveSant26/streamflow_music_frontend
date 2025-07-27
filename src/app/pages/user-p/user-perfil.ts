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

  get username() {
    return this.profileForm.get("username");
  }

  get description() {
    return this.profileForm.get("description");
  }
}
