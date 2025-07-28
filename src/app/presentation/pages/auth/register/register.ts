import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RegisterUseCase } from "@app/domain/usecases/register.usecase";
import { RegisterCredentials } from "@app/domain/repositories/auth.repository";

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
  ) {}

  async onRegister(): Promise<void> {
    if (this.isLoading()) return;

    this.isLoading.set(true);
    this.error.set(null);
    this.success.set(null);

    try {
      const result = await this.registerUseCase.execute(this.credentials);
      console.log("Registration successful:", result);

      this.success.set(
        "¡Registro exitoso! Revisa tu email para confirmar tu cuenta.",
      );

      // Opcional: redirigir automáticamente después de unos segundos
      setTimeout(() => {
        this.router.navigate(["/login"]);
      }, 3000);
    } catch (error) {
      this.error.set(
        error instanceof Error ? error.message : "Error al registrarse",
      );
      console.error("Registration error:", error);
    } finally {
      this.isLoading.set(false);
    }
  }
}
