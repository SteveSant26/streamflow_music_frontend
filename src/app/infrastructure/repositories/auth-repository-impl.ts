import { Injectable } from "@angular/core";
import {
  LoginCredentials,
  RegisterCredentials,
  AuthResult,
  AuthRepository,
} from "@app/domain/repositories/auth.repository";
import { User } from "@app/domain/entities/user.entity";
import { AuthToken } from "@app/domain/entities/auth-token.entity";
import { SupabaseService } from "../supabase/supabase.service";

@Injectable({
  providedIn: "root",
})
export class AuthRepositoryImpl extends AuthRepository {
  constructor(private readonly supabaseService: SupabaseService) {
    super();
  }

  async login(credentials: LoginCredentials): Promise<AuthResult> {
    console.log("Iniciando login para:", credentials.email);
    
    const { data, error } =
      await this.supabaseService.client.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

    console.log("Respuesta de login:", { data, error });

    if (error) {
      console.error("Error en el login:", error);
      // Manejo específico de errores comunes
      if (error.message.includes('Invalid login credentials')) {
        throw new Error("Email o contraseña incorrectos");
      }
      if (error.message.includes('Email not confirmed')) {
        throw new Error("Tu cuenta no ha sido confirmada. Por favor, revisa tu email y confirma tu cuenta.");
      }
      if (error.message.includes('Too many requests')) {
        throw new Error("Demasiados intentos de inicio de sesión. Espera un momento e intenta de nuevo.");
      }
      throw new Error(`Error en el login: ${error.message}`);
    }

    if (!data.user) {
      console.error("No se recibieron datos del usuario");
      throw new Error("Inicio de sesión fallido: No se recibieron datos del usuario");
    }

    if (!data.session) {
      console.error("No se recibió sesión");
      throw new Error("Inicio de sesión fallido: No se pudo crear la sesión");
    }

    console.log("Login exitoso para usuario:", data.user.id);

    return {
      user: this.mapSupabaseUserToUser(data.user),
      token: this.mapSupabaseSessionToToken(data.session),
    };
  }

  async register(credentials: RegisterCredentials): Promise<AuthResult> {
    console.log("Iniciando registro para:", credentials.email);
    
    // Intentamos registrar al usuario
    const { data, error } = await this.supabaseService.client.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: {
          name: credentials.name,
        },
      },
    });

    console.log("Respuesta de Supabase:", { data, error });

    if (error) {
      console.error("Error en el registro:", error);
      // Manejo específico de errores comunes
      if (error.message.includes('User already registered') || error.message.includes('already registered')) {
        throw new Error("Este email ya está registrado. Intenta iniciar sesión o usa otro email.");
      }
      if (error.message.includes('Password should be at least')) {
        throw new Error("La contraseña debe tener al menos 6 caracteres.");
      }
      if (error.message.includes('Invalid email')) {
        throw new Error("El formato del email no es válido.");
      }
      throw new Error(`Error en el registro: ${error.message}`);
    }

    if (!data.user) {
      console.error("No se recibieron datos del usuario");
      throw new Error("Registro fallido: No se recibieron datos del usuario");
    }

    console.log("Usuario creado:", data.user.id);
    console.log("Sesión:", data.session ? "Sí" : "No");

    // Si hay una sesión, el usuario se registró exitosamente sin confirmación
    if (data.session) {
      console.log("Registro exitoso con sesión inmediata");
      return {
        user: this.mapSupabaseUserToUser(data.user),
        token: this.mapSupabaseSessionToToken(data.session),
      };
    }

    // Si no hay sesión, intentamos hacer login inmediato
    // (esto funciona si el usuario ya confirmó el email o si está deshabilitada la confirmación)
    console.log("Intentando login inmediato después del registro...");
    
    try {
      // Esperamos un poco para que Supabase procese el registro
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const loginResult = await this.login({
        email: credentials.email,
        password: credentials.password,
      });
      
      console.log("Login inmediato exitoso");
      return loginResult;
    } catch (loginError) {
      console.log("Login inmediato falló, requiere confirmación de email");
      // Si el login falla, significa que realmente se requiere confirmación de email
      throw new Error(
        "Registro exitoso. Se ha enviado un email de confirmación a tu correo electrónico. Por favor, confirma tu cuenta e intenta iniciar sesión nuevamente."
      );
    }
  }

  async logout(): Promise<void> {
    const { error } = await this.supabaseService.client.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  }

  async getCurrentUser(): Promise<User | null> {
    const {
      data: { user },
    } = await this.supabaseService.client.auth.getUser();

    if (!user) {
      return null;
    }

    return this.mapSupabaseUserToUser(user);
  }

  async refreshToken(refreshToken: string): Promise<AuthToken> {
    const { data, error } =
      await this.supabaseService.client.auth.refreshSession({
        refresh_token: refreshToken,
      });

    if (error || !data.session) {
      throw new Error(error?.message || "Failed to refresh token");
    }

    return this.mapSupabaseSessionToToken(data.session);
  }

  private mapSupabaseUserToUser(supabaseUser: any): User {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || "",
      name: supabaseUser.user_metadata?.name || supabaseUser.email || "",
      createdAt: new Date(supabaseUser.created_at),
      updatedAt: new Date(supabaseUser.updated_at || supabaseUser.created_at),
    };
  }

  private mapSupabaseSessionToToken(session: any): AuthToken {
    return {
      accessToken: session.access_token,
      refreshToken: session.refresh_token,
      expiresAt: new Date(session.expires_at * 1000),
    };
  }
}
