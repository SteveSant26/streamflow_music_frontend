import { Observable } from "rxjs";
import { AuthRepository } from "../../repositories/auth.repository";
import { User } from "../../entities/user.entity";

export class LoginUseCase {
  constructor(private readonly userRepo: AuthRepository) {}
  execute(email: string, password: string): Observable<User> {
    return this.userRepo.login(email, password);
  }
}
