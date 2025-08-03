import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RegisterSessionUseCase } from '@app/domain/usecases/register-session.usecase';
import { RegisterCredentials } from '@app/domain/repositories/i-auth.repository';
import { SocialLoginUseCase } from '../../../../domain/usecases/social-login.usecase';
import { MatIcon } from '@angular/material/icon';
import { ROUTES_CONFIG_AUTH } from '@app/config';
import {
  AuthError,
  ValidationError,
  RegisterError,
  NetworkError,
} from '@app/domain/errors/auth.errors';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatIcon, TranslateModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  protected readonly ROUTES_CONFIG_AUTH = ROUTES_CONFIG_AUTH;

  private readonly socialLoginUseCase = inject(SocialLoginUseCase);
  private readonly registerSessionUseCase = inject(RegisterSessionUseCase);
  private readonly router = inject(Router);

  credentials: RegisterCredentials = {
    email: '',
    password: '',
    name: '',
  };

  isLoading = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);

  async onRegister(): Promise<void> {
    if (this.isLoading()) return;

    this.isLoading.set(true);
    this.error.set(null);
    this.success.set(null);

    try {
      const result = await this.registerSessionUseCase.execute(
        this.credentials,
      );
      console.log('Register successful:', result);

      this.success.set('¡Registro exitoso! Bienvenido a StreamFlow Music.');

      // Redirigir después de mostrar el mensaje de éxito
      setTimeout(() => {
        this.router.navigate(['/home']);
      }, 2000);
    } catch (error) {
      this.handleError(error);
    } finally {
      this.isLoading.set(false);
    }
  }

  private handleError(error: any): void {
    if (error instanceof ValidationError) {
      this.error.set(error.message);
    } else if (error instanceof RegisterError) {
      this.error.set(
        'Error al crear la cuenta. Verifica que el email no esté en uso.',
      );
    } else if (error instanceof NetworkError) {
      this.error.set(
        'Error de conexión. Verifica tu internet e intenta de nuevo.',
      );
    } else if (error instanceof AuthError) {
      this.error.set(error.message);
    } else {
      this.error.set('Error inesperado. Intenta de nuevo.');
    }
    console.error('Register error:', error);
  }

  registerWithGoogle() {
    this.socialLoginUseCase.execute('google');
  }

  registerWithGithub() {
    this.socialLoginUseCase.execute('github');
  }

  registerWithTwitter() {
    this.socialLoginUseCase.execute('twitter');
  }

  registerWithDiscord() {
    this.socialLoginUseCase.execute('discord');
  }
}
