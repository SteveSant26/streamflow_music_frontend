import { Injectable } from '@angular/core';
import { AuthStateService } from '@app/domain/services/auth-state-service';

@Injectable({ providedIn: 'root' })
export class AuthUseCase {
  constructor(private readonly authStateService: AuthStateService) {}

  isAuthenticated(): boolean {
    return this.authStateService.isAuthenticated();
  }
}
