import { Component } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { RegisterDto } from "../../models";

@Component({
  selector: "app-register",
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: "./register.html",
  styleUrls: ["./register.css"],
})
export class RegisterComponent {
  // Datos del formulario
  registerData: RegisterDto = {
    username: "",
    email: "",
    password: "",
  };

  confirmPassword: string = "";
  termsAccepted: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = "";

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
  ) {}

  onRegister() {
    this.errorMessage = "";

    // Validaciones básicas
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;

    this.authService.register(this.registerData).subscribe({
      next: (response) => {
        console.log("Registro exitoso:", response);
        // Redirigir al home después del registro exitoso
        this.router.navigate(["/home"]);
      },
      error: (error) => {
        console.error("Error en registro:", error);
        this.errorMessage =
          error.error?.message ||
          "Error al crear la cuenta. Inténtalo de nuevo.";
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  private validateForm(): boolean {
    // Validar email
    if (!this.registerData.email || !this.registerData.email.includes("@")) {
      this.errorMessage = "Por favor ingresa un email válido";
      return false;
    }

    // Validar contraseña
    if (!this.registerData.password || this.registerData.password.length < 6) {
      this.errorMessage = "La contraseña debe tener al menos 6 caracteres";
      return false;
    }

    // Validar confirmación de contraseña
    if (this.registerData.password !== this.confirmPassword) {
      this.errorMessage = "Las contraseñas no coinciden";
      return false;
    }

    // Validar términos
    if (!this.termsAccepted) {
      this.errorMessage = "Debes aceptar los términos y condiciones";
      return false;
    }

    // Generar username a partir del email si no se proporciona
    if (!this.registerData.username) {
      this.registerData.username = this.registerData.email.split("@")[0];
    }

    return true;
  }
}
