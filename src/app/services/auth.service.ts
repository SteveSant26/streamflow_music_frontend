import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { Observable, BehaviorSubject, tap, map } from "rxjs";
import { ApiService } from "./api.service";
import { User, LoginDto, RegisterDto, AuthResponse } from "../models";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private endpoint = "/auth";
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);

  // Observables públicos
  public currentUser$ = this.currentUserSubject.asObservable();
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(
    private apiService: ApiService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    // Verificar si hay un token guardado al inicializar
    this.checkAuthState();
  }

  /**
   * Iniciar sesión
   */
  login(credentials: LoginDto): Observable<AuthResponse> {
    return this.apiService
      .post<AuthResponse>(`${this.endpoint}/login`, credentials)
      .pipe(
        tap((response) => {
          this.setAuthData(response);
        }),
      );
  }

  /**
   * Registrarse
   */
  register(userData: RegisterDto): Observable<AuthResponse> {
    return this.apiService
      .post<AuthResponse>(`${this.endpoint}/register`, userData)
      .pipe(
        tap((response) => {
          this.setAuthData(response);
        }),
      );
  }

  /**
   * Cerrar sesión
   */
  logout(): Observable<void> {
    return this.apiService.post<void>(`${this.endpoint}/logout`, {}).pipe(
      tap(() => {
        this.clearAuthData();
      }),
    );
  }

  /**
   * Refrescar token
   */
  refreshToken(): Observable<AuthResponse> {
    let refreshToken = null;
    if (isPlatformBrowser(this.platformId)) {
      refreshToken = localStorage.getItem("refreshToken");
    }
    return this.apiService
      .post<AuthResponse>(`${this.endpoint}/refresh`, { refreshToken })
      .pipe(
        tap((response) => {
          this.setAuthData(response);
        }),
      );
  }

  /**
   * Obtener perfil del usuario actual
   */
  getCurrentUser(): Observable<User> {
    return this.apiService
      .get<{ user: User; message: string }>(`${this.endpoint}/me`)
      .pipe(
        map((response: { user: User; message: string }) => {
          // El backend devuelve { user: {...}, message: "..." }
          // Extraemos solo el objeto user
          return response.user;
        }),
        tap((user) => {
          this.currentUserSubject.next(user);
        }),
      );
  }

  /**
   * Actualizar perfil del usuario
   */
  updateProfile(userData: Partial<User>): Observable<User> {
    return this.apiService
      .put<{
        user: User;
        message: string;
      }>(`${this.endpoint}/profile`, userData)
      .pipe(
        map((response: { user: User; message: string }) => {
          // El backend devuelve { user: {...}, message: "..." }
          // Extraemos solo el objeto user
          return response.user;
        }),
        tap((user) => {
          this.currentUserSubject.next(user);
        }),
      );
  }

  /**
   * Cambiar contraseña
   */
  changePassword(passwordData: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Observable<void> {
    return this.apiService.post<void>(
      `${this.endpoint}/change-password`,
      passwordData,
    );
  }

  /**
   * Solicitar restablecimiento de contraseña
   */
  requestPasswordReset(email: string): Observable<void> {
    return this.apiService.post<void>(`${this.endpoint}/forgot-password`, {
      email,
    });
  }

  /**
   * Restablecer contraseña
   */
  resetPassword(resetData: {
    token: string;
    newPassword: string;
    confirmPassword: string;
  }): Observable<void> {
    return this.apiService.post<void>(
      `${this.endpoint}/reset-password`,
      resetData,
    );
  }

  /**
   * Subir foto de perfil
   */
  uploadProfileImage(file: File): Observable<User> {
    return this.apiService
      .upload<User>(`${this.endpoint}/profile-image`, file)
      .pipe(
        tap((user) => {
          this.currentUserSubject.next(user);
        }),
      );
  }

  /**
   * Verificar email
   */
  verifyEmail(token: string): Observable<void> {
    return this.apiService.post<void>(`${this.endpoint}/verify-email`, {
      token,
    });
  }

  /**
   * Reenviar email de verificación
   */
  resendVerificationEmail(): Observable<void> {
    return this.apiService.post<void>(
      `${this.endpoint}/resend-verification`,
      {},
    );
  }

  /**
   * Eliminar cuenta
   */
  deleteAccount(password: string): Observable<void> {
    return this.apiService
      .post<void>(`${this.endpoint}/delete-account`, { password })
      .pipe(
        tap(() => {
          this.clearAuthData();
        }),
      );
  }

  // Métodos privados para manejo de autenticación

  private setAuthData(authResponse: AuthResponse): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem("authToken", authResponse.token);
      if (authResponse.refreshToken) {
        localStorage.setItem("refreshToken", authResponse.refreshToken);
      }
      localStorage.setItem("user", JSON.stringify(authResponse.user));
    }

    this.currentUserSubject.next(authResponse.user);
    this.isLoggedInSubject.next(true);
  }

  private clearAuthData(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    }

    this.currentUserSubject.next(null);
    this.isLoggedInSubject.next(false);
  }

  private checkAuthState(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return; // No hacer nada en el servidor
    }

    const token = localStorage.getItem("authToken");
    const userStr = localStorage.getItem("user");

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
        this.isLoggedInSubject.next(true);
      } catch (error) {
        console.error("Error parsing user data:", error);
        this.clearAuthData();
      }
    }
  }

  // Métodos de utilidad pública

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return this.isLoggedInSubject.value;
  }

  /**
   * Obtener el usuario actual (síncrono)
   */
  getCurrentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Obtener el token de autenticación
   */
  getAuthToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }
    return localStorage.getItem("authToken");
  }

  /**
   * Verificar si el token ha expirado
   */
  isTokenExpired(): boolean {
    const token = this.getAuthToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const exp = payload.exp * 1000; // Convertir a milisegundos
      return Date.now() > exp;
    } catch (error) {
      console.error("Error checking token expiration:", error);
      return true;
    }
  }
}
