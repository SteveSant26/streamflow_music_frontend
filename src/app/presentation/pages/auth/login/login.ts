import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginSessionUseCase } from '../../../../domain/usecases/login-session.usecase';
import { LoginCredentials } from '../../../../domain/repositories/i-auth.repository';
import { SocialLoginUseCase } from '../../../../domain/usecases/social-login.usecase';
import { MatIcon } from '@angular/material/icon';
import { ROUTES_CONFIG_AUTH } from '@app/config';
import {
  AuthError,
  ValidationError,
  LoginError,
  NetworkError,
} from '@app/domain/errors/auth.errors';

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

  private readonly socialLoginUseCase = inject(SocialLoginUseCase);
  private readonly loginSessionUseCase = inject(LoginSessionUseCase);
  private readonly router = inject(Router);

  credentials: LoginCredentials = {
    email: '',
    password: '',
  };

  isLoading = signal(false);
  error = signal<string | null>(null);

  async onLogin(): Promise<void> {
    if (this.isLoading()) return;

    this.isLoading.set(true);
    this.error.set(null);

    try {
      const result = await this.loginSessionUseCase.execute(this.credentials);
      console.log('Login successful:', result);
      
      this.router.navigate(['/home']);
    } catch (error) {
      this.handleError(error);
    } finally {
      this.isLoading.set(false);
    }
  }

  private handleError(error: any): void {
    if (error instanceof ValidationError) {
      this.error.set(error.message);
    } else if (error instanceof LoginError) {
      this.error.set('Credenciales inválidas. Verifica tu email y contraseña.');
    } else if (error instanceof NetworkError) {
      this.error.set(
        'Error de conexión. Verifica tu internet e intenta de nuevo.',
      );
    } else if (error instanceof AuthError) {
      this.error.set(error.message);
    } else {
      this.error.set('Error inesperado. Intenta de nuevo.');
    }
    console.error('Login error:', error);
  }

  loginWithGoogle() {
    this.socialLoginUseCase.execute('google');
  }

  loginWithGithub() {
    this.socialLoginUseCase.execute('github');
  }

  loginWithTwitter() {
    this.socialLoginUseCase.execute('twitter');
  }

  loginWithDiscord() {
    this.socialLoginUseCase.execute('discord');
  }
}
