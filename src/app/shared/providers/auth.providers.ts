import { Provider } from "@angular/core";
import { AuthRepository } from "@app/domain/repositories/auth.repository";
import { AuthRepositoryImpl } from "@app/infrastructure/repositories/auth-repository-impl";
import { SupabaseService } from "@app/infrastructure/supabase/supabase.service";
import { AuthService } from "../services/auth.service";

export const authProviders: Provider[] = [
  SupabaseService,
  AuthService,
  {
    provide: AuthRepository,
    useClass: AuthRepositoryImpl,
  },
];
