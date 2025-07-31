import { Injectable, signal, inject, PLATFORM_ID, computed } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { Router } from "@angular/router";
import { SupabaseService } from "@app/infrastructure/supabase/supabase.service";
import { AuthChangeEvent, Session, User as SupabaseUser } from "@supabase/supabase-js";
import { User } from "../../domain/entities/user.entity";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  /**
   * Renueva la sesión de Supabase y retorna la nueva sesión (con el nuevo access_token).
   */
  async refreshSession(): Promise<Session | null> {
    try {
      const { data, error } = await this.supabaseService.client.auth.refreshSession();
      if (error) throw error;
      this.session.set(data.session);
      this._supabaseUser.set(data.session?.user ?? null);
      this.isAuthenticated.set(!!data.session);
      return data.session;
    } catch (error) {
      console.error("Error refreshing session:", error);
      return null;
    }
  }
  private readonly supabaseService = inject(SupabaseService);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  // Private signals
  private readonly _supabaseUser = signal<SupabaseUser | null>(null);

  // Public signals
  readonly session = signal<Session | null>(null);
  readonly isAuthenticated = signal<boolean>(false);
  readonly isLoading = signal<boolean>(true);
  readonly error = signal<string | null>(null);

  readonly user = computed<User | null>(() => {
    const supabaseUser = this._supabaseUser();
    if (!supabaseUser) return null;

    return {
      id: supabaseUser.id,
      email: supabaseUser.email ?? "",
      name: supabaseUser.user_metadata?.["name"] ?? "",
      createdAt: new Date(supabaseUser.created_at ?? ""),
      updatedAt: new Date(supabaseUser.updated_at ?? ""),
    };
  });

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.supabaseService.client.auth
        .onAuthStateChange(
          (event: AuthChangeEvent, session: Session | null) => {
            this.handleAuthStateChange(event, session);
          },
        );

      // Set initial state
      this.setInitialSession();
    } else {
      this.isLoading.set(false);
    }
  }

  private async setInitialSession() {
    try {
      const {
        data: { session },
      } = await this.supabaseService.client.auth.getSession();
      this.handleAuthStateChange("INITIAL_SESSION", session);
    } catch (error) {
      console.error("Error getting initial session:", error);
      this.handleAuthStateChange("SIGNED_OUT", null);
    } finally {
      this.isLoading.set(false);
    }
  }

  private handleAuthStateChange(
    event: AuthChangeEvent,
    session: Session | null,
  ) {
    this.session.set(session);
    this._supabaseUser.set(session?.user ?? null);
    this.isAuthenticated.set(!!session);

    console.log(`Auth event: ${event}`);

    if (event === "SIGNED_IN" || (event === "INITIAL_SESSION" && session)) {
      this.router.navigate(["/home"]);
    } else if (event === "SIGNED_OUT") {
      this.router.navigate(["/login"]);
    }
  }

  setAuth(user: User, token: string) {
    const supabaseUser: SupabaseUser = {
      id: user.id,
      email: user.email,
      user_metadata: { name: user.name },
      app_metadata: {},
      aud: "authenticated",
      created_at: user.createdAt.toISOString(),
      updated_at: user.updatedAt.toISOString(),
    };

    this._supabaseUser.set(supabaseUser);
    this.session.set({
      access_token: token,
      refresh_token: "",
      token_type: "bearer",
      user: supabaseUser,
      expires_in: 3600,
      expires_at: Date.now() + 3600 * 1000,
    });
    this.isAuthenticated.set(true);
  }

  async signInWithPassword(credentials: { email: string; password: string }) {
    this.isLoading.set(true);
    this.error.set(null);
    try {
      const { error } =
        await this.supabaseService.client.auth.signInWithPassword(credentials);
      if (error) throw error;
    } catch (error: any) {
      this.error.set(error.message);
      console.error("Sign in error:", error);
    } finally {
      this.isLoading.set(false);
    }
  }

  async signUp(credentials: { email: string; password: string; name: string }) {
    this.isLoading.set(true);
    this.error.set(null);
    try {
      const {
        data: { user },
        error,
      } = await this.supabaseService.client.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            name: credentials.name,
          },
        },
      });
      if (error) throw error;
      if (!user) throw new Error("Sign up failed: no user returned.");
    } catch (error: any) {
      this.error.set(error.message);
      console.error("Sign up error:", error);
    } finally {
      this.isLoading.set(false);
    }
  }

  async signOut() {
    this.isLoading.set(true);
    try {
      await this.supabaseService.client.auth.signOut();
    } catch (error:  any) {
      this.error.set(error.message || "Error al cerrar sesión");
      console.error("Sign out error:", error);
    } finally {
      this.isLoading.set(false);
    }
  }
}
