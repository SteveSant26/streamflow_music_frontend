import { Injectable } from "@angular/core";
import { IAuthRepository } from "../repositories/i-auth.repository";

@Injectable({ providedIn: "root" })
export class AuthSessionUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async initSession() {
    await this.authRepository.getCurrentSession();
  }
}
