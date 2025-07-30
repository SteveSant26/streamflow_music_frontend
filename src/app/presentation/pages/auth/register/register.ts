import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RegisterUseCase } from "@app/domain/usecases/register.usecase";
import {  RegisterCredentials } from "@app/domain/repositories/auth.repository";
import { AuthService } from "../../../../shared/services/auth.service";

@Component({
  selector: "app-register",
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: "./register.html",
  styleUrls: ["./register.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  credentials: RegisterCredentials = {
    name: "",
    email: "",
    password: "",
  };

  isLoading = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);

  constructor(
    private readonly router: Router,
    private readonly registerUseCase: RegisterUseCase,
    private readonly authService: AuthService,
  ) {}

  async onRegister(): Promise<void> {
    if (this.isLoading()) return;

    this.isLoading.set(true);
    this.error.set(null);
    this.success.set(null);

    try {
      const result = await this.registerUseCase.execute(this.credentials);
      console.log("Registration successful:", result);

      // Usar el servicio de auth para manejar el estado
      this.authService.setAuth(result.user, result.token.accessToken);

      this.success.set(
        "¡Registro exitoso! Bienvenido a StreamFlow Music.",
      );

      // Redirigir automáticamente después de unos segundos
      setTimeout(() => {
        this.router.navigate(["/home"]);
      }, 2000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error al registrarse";
      this.error.set(errorMessage);
      console.error("Registration error:", error);
      
      // Si el mensaje indica que necesita confirmación de email, mostrar como info
      if (errorMessage.includes("confirmación")) {
        this.success.set(errorMessage);
        this.error.set(null);
        
        // Redirigir al login después de mostrar el mensaje
        setTimeout(() => {
          this.router.navigate(["/login"]);
        }, 5000);
      }
    } finally {
      this.isLoading.set(false);
    }
  }
}
