import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResetPasswordUseCase } from '../../../../domain/usecases/reset-password.usecase';
import {
  AuthError,
  ValidationError,
  NetworkError,
} from '@app/domain/errors/auth.errors';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, TranslateModule],
  templateUrl: './reset-password.html',
  styleUrls: ['./reset-password.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordComponent {
  email = '';
  isLoading = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);

  private readonly resetPasswordUseCase = inject(ResetPasswordUseCase);

  async onResetPassword(): Promise<void> {
    if (this.isLoading()) return;
    this.isLoading.set(true);
    this.error.set(null);
    this.success.set(null);

    try {
      await this.resetPasswordUseCase.execute(this.email);
      this.success.set(
        'Te hemos enviado un correo para restablecer tu contraseña.',
      );
    } catch (error) {
      this.handleError(error);
    } finally {
      this.isLoading.set(false);
    }
  }

  private handleError(error: any): void {
    if (error instanceof ValidationError) {
      this.error.set(error.message);
    } else if (error instanceof NetworkError) {
      this.error.set(
        'Error de conexión. Verifica tu internet e intenta de nuevo.',
      );
    } else if (error instanceof AuthError) {
      this.error.set(error.message);
    } else {
      this.error.set('Error inesperado. Intenta de nuevo.');
    }
    console.error('Reset password error:', error);
  }
}
