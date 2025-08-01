import { Injectable } from "@angular/core";
import { IAuthRepository } from "../repositories/i-auth.repository";

@Injectable({ providedIn: "root" })
export class SocialLoginUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(provider: 'google' | 'github' | 'facebook' | 'twitter' | 'discord'): Promise<void> {
    await this.authRepository.signInWithProvider(provider);
  }
}
