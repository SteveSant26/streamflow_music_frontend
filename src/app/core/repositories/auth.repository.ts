import { Observable } from "rxjs";
import { User } from "../entities/user.entity";

export abstract class AuthRepository {
  abstract login(email: string, password: string): Observable<User>;
  abstract register(
    name: string,
    email: string,
    password: string
  ): Observable<User>;
  abstract current(): Observable<User | null>;
  abstract logout(): Observable<void>;
}
