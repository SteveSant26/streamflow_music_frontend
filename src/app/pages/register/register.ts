import { Component } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-register",
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: "./register.html",
  styleUrls: ["./register.css"],
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = "";
  successMessage = "";

  constructor(
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
  ) {
    this.registerForm = this.fb.group(
      {
        email: ["", [Validators.required, Validators.email]],
        password: ["", [Validators.required, Validators.minLength(6)]],
        confirmPassword: ["", [Validators.required]],
      },
      { validators: this.passwordMatchValidator },
    );
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get("password");
    const confirmPassword = group.get("confirmPassword");
    return password &&
      confirmPassword &&
      password.value === confirmPassword.value
      ? null
      : { passwordMismatch: true };
  }

  onRegister() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = "";
      this.successMessage = "";

      const { email, password } = this.registerForm.value;

      // Generar username basado en el email
      const username = email.split("@")[0];

      console.log("🚀 Iniciando registro con:", {
        email,
        username,
        password: "***",
      });

      this.authService.register({ email, password, username }).subscribe({
        next: (response) => {
          console.log("✅ Registro exitoso:", response);
          this.successMessage = "Cuenta creada exitosamente. Redirigiendo...";

          // Guardar token en localStorage
          if (response.token) {
            localStorage.setItem("authToken", response.token);
            console.log("🔑 Token guardado en localStorage");
          }

          // Redirigir al home después de 1 segundo
          setTimeout(() => {
            this.router.navigate(["/home"]);
          }, 1000);
        },
        error: (error) => {
          console.error("❌ Error en registro:", error);
          this.errorMessage =
            error.error?.message ||
            "Error al crear la cuenta. Intenta nuevamente.";
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        },
      });
    } else {
      console.log("❌ Formulario inválido:", this.registerForm.errors);
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched() {
    Object.keys(this.registerForm.controls).forEach((key) => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });
  }

  // Helpers para el template
  get email() {
    return this.registerForm.get("email");
  }
  get password() {
    return this.registerForm.get("password");
  }
  get confirmPassword() {
    return this.registerForm.get("confirmPassword");
  }
}
