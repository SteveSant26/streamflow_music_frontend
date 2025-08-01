import { Injectable } from "@angular/core";
import { IAuthRepository } from "../repositories/i-auth.repository";

@Injectable({ providedIn: "root" })
export class LogoutUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(): Promise<void> {
    await this.authRepository.logout();
  }
}
