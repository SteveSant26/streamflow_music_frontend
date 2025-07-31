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

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
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
      this.error.set(
        error instanceof Error
          ? error.message
          : 'Error al enviar el correo de recuperación',
      );
    } finally {
      this.isLoading.set(false);
    }
  }
}
