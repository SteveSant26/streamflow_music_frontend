import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginUseCase } from '../../../../domain/usecases/login.usecase';
import { LoginCredentials } from '../../../../domain/repositories/auth.repository';
import { AuthService } from '../../../../shared/services/auth.service';
import { SocialLoginUseCase } from '../../../../domain/usecases/social-login.usecase';
import { MatIcon } from '@angular/material/icon';
import { ROUTES_CONFIG_AUTH } from '@app/config/routes-auth.config';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatIcon],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  protected readonly ROUTES_CONFIG_AUTH = ROUTES_CONFIG_AUTH;
  // ...existing code...

  private readonly socialLoginUseCase = inject(SocialLoginUseCase);

  loginWithGoogle() {
    this.socialLoginUseCase.execute('google');
  }
  loginWithGithub() {
    this.socialLoginUseCase.execute('github');
  }
  loginWithFacebook() {
    this.socialLoginUseCase.execute('facebook');
  }
  loginWithTwitter() {
    this.socialLoginUseCase.execute('twitter');
  }
  loginWithDiscord() {
    this.socialLoginUseCase.execute('discord');
  }
  credentials: LoginCredentials = {
    email: '',
    password: '',
  };

  isLoading = signal(false);
  error = signal<string | null>(null);

  constructor(
    private readonly router: Router,
    private readonly loginUseCase: LoginUseCase,
    private readonly authService: AuthService,
  ) {}

  async onLogin(): Promise<void> {
    if (this.isLoading()) return;

    this.isLoading.set(true);
    this.error.set(null);

    try {
      const result = await this.loginUseCase.execute(this.credentials);
      console.log('Login successful:', result);

      // Usar el servicio de auth para manejar el estado
      this.authService.setAuth(result.user, result.token.accessToken);

      // Navegar a la página principal
      this.router.navigate(['/home']);
    } catch (error) {
      this.error.set(
        error instanceof Error ? error.message : 'Error al iniciar sesión',
      );
      console.error('Login error:', error);
    } finally {
      this.isLoading.set(false);
    }
  }
}
