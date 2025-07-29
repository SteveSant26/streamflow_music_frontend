import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Ha ocurrido un error inesperado';

        if (error.error instanceof ErrorEvent) {
          // Error del lado del cliente
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Error del lado del servidor
          switch (error.status) {
            case 400:
              errorMessage = error.error?.message || 'Solicitud incorrecta';
              break;
            case 401:
              errorMessage = 'No autorizado. Por favor, inicia sesión nuevamente';
              // Si el token ha expirado, intentar renovarlo
              if (error.error?.code === 'TOKEN_EXPIRED') {
                return this.handleTokenExpired(request, next);
              }
              // Si no se puede renovar, cerrar sesión
              this.authService.logout().subscribe();
              break;
            case 403:
              errorMessage = 'Acceso denegado';
              break;
            case 404:
              errorMessage = 'Recurso no encontrado';
              break;
            case 422:
              if (error.error?.errors && Array.isArray(error.error.errors)) {
                errorMessage = error.error.errors.join(', ');
              } else {
                errorMessage = error.error?.message || 'Datos no válidos';
              }
              break;
            case 429:
              errorMessage = 'Demasiadas solicitudes. Intenta nuevamente más tarde';
              break;
            case 500:
              errorMessage = 'Error interno del servidor';
              break;
            case 503:
              errorMessage = 'Servicio no disponible temporalmente';
              break;
            default:
              if (error.error?.message) {
                errorMessage = error.error.message;
              }
          }
        }

        console.error('HTTP Error:', {
          status: error.status,
          message: errorMessage,
          url: error.url,
          error: error.error
        });

        return throwError(() => new Error(errorMessage));
      })
    );
  }

  private handleTokenExpired(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.refreshToken().pipe(
      switchMap(() => {
        // Token renovado exitosamente, reintentar la solicitud original
        const newToken = this.authService.getAuthToken();
        const authRequest = request.clone({
          setHeaders: {
            Authorization: `Bearer ${newToken}`
          }
        });
        return next.handle(authRequest);
      }),
      catchError((refreshError) => {
        // No se pudo renovar el token, cerrar sesión
        this.authService.logout().subscribe();
        return throwError(() => new Error('Sesión expirada. Por favor, inicia sesión nuevamente'));
      })
    );
  }
}
