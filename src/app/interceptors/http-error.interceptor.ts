import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { AuthService } from "../services/auth.service";

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    // DEBUG: Log de todas las peticiones
    console.log("HttpErrorInterceptor - Petición:", {
      url: request.url,
      method: request.method,
      headers: {
        Authorization: request.headers.get("Authorization"),
        ContentType: request.headers.get("Content-Type"),
      },
    });

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = "Ha ocurrido un error inesperado";

        if (error.error instanceof ErrorEvent) {
          // Error del lado del cliente
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Error del lado del servidor
          switch (error.status) {
            case 400:
              errorMessage = error.error?.message || "Solicitud incorrecta";
              break;
            case 401:
              errorMessage =
                "No autorizado. Por favor, inicia sesión nuevamente";
              // Evitar bucle infinito - no llamar logout automáticamente
              console.warn("Error 401 detectado:", error.url);

              // DEBUG: Verificar estado de autenticación
              const token = localStorage.getItem("authToken");
              console.log(
                "Debug 401 - Token en localStorage:",
                token ? token.substring(0, 20) + "..." : "null",
              );
              console.log(
                "Debug 401 - Auth service isAuthenticated:",
                this.authService.isAuthenticated(),
              );
              console.log(
                "Debug 401 - Request headers:",
                request.headers.get("Authorization"),
              );

              // Si el token ha expirado, intentar renovarlo
              if (error.error?.code === "TOKEN_EXPIRED") {
                return this.handleTokenExpired(request, next);
              }
              // No llamar logout automáticamente para evitar bucles infinitos
              break;
            case 403:
              errorMessage = "Acceso denegado";
              break;
            case 404:
              errorMessage = "Recurso no encontrado";
              break;
            case 422:
              if (error.error?.errors && Array.isArray(error.error.errors)) {
                errorMessage = error.error.errors.join(", ");
              } else {
                errorMessage = error.error?.message || "Datos no válidos";
              }
              break;
            case 429:
              errorMessage =
                "Demasiadas solicitudes. Intenta nuevamente más tarde";
              break;
            case 500:
              errorMessage = "Error interno del servidor";
              break;
            case 503:
              errorMessage = "Servicio no disponible temporalmente";
              break;
            default:
              if (error.error?.message) {
                errorMessage = error.error.message;
              }
          }
        }

        console.error("HTTP Error:", {
          status: error.status,
          message: errorMessage,
          url: error.url,
          error: error.error,
        });

        return throwError(() => new Error(errorMessage));
      }),
    );
  }

  private handleTokenExpired(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    return this.authService.refreshToken().pipe(
      switchMap(() => {
        // Token renovado exitosamente, reintentar la solicitud original
        const newToken = this.authService.getAuthToken();
        const authRequest = request.clone({
          setHeaders: {
            Authorization: `Bearer ${newToken}`,
          },
        });
        return next.handle(authRequest);
      }),
      catchError((refreshError) => {
        // No se pudo renovar el token
        console.warn("Error al renovar token:", refreshError);
        // Solo limpiar datos localmente para evitar bucles infinitos
        // No llamar logout() para evitar petición HTTP
        return throwError(
          () =>
            new Error("Sesión expirada. Por favor, inicia sesión nuevamente"),
        );
      }),
    );
  }
}
