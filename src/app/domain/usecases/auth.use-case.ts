import { Injectable } from '@angular/core';
import { AuthService } from '@app/shared/services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthUseCase {
  constructor(private readonly authService: AuthService) {}

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }
}
