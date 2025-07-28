import { User } from "app/core/entities/user.entity";
import { AuthRepository } from "app/core/repositories/auth.repository";
import { Observable } from "rxjs";

export class RegisterUseCase {
  constructor(private readonly userRepo: AuthRepository) {}
  execute(email: string, password: string): Observable<User> {
    return this.userRepo.register(email, password);
  }
}
