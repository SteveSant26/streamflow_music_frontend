import { Injectable } from "@angular/core";
import { AuthService } from "../../shared/services/auth.service";

@Injectable({ providedIn: "root" })
export class SocialLoginUseCase {
  constructor(private readonly authService: AuthService) {}

  async execute(provider: 'google' | 'github' | 'facebook' | 'twitter' | 'discord'): Promise<void> {
    await this.authService.signInWithProvider(provider);
  }
}
