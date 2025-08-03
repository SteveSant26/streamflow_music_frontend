import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { AuthStateService } from '@app/domain/services/auth-state-service';

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly authStateService = inject(AuthStateService);

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    console.log('🔄 AuthTokenInterceptor - Interceptando petición:', {
      url: request.url,
      method: request.method,
      originalHeaders: request.headers
        .keys()
        .map((k) => ({ [k]: request.headers.get(k) })),
    });

    // Solo agregar token en el navegador (no durante SSR)
    if (isPlatformBrowser(this.platformId)) {
      console.log('✅ isPlatformBrowser: true - Agregando token');

      const token: string | null = this.authStateService.token();

      console.log('🔍 Token obtenido de authStateService:', {
        hasToken: !!token,
        tokenLength: token?.length || 0,
        tokenPreview: token ? token.substring(0, 30) + '...' : 'null',
      });

      if (token) {
        console.log(
          '🔑 AuthTokenInterceptor - Agregando token a la petición:',
          {
            url: request.url,
            method: request.method,
            token: token, // Mostrar token completo para debug
          },
        );
        const authRequest = request.clone({
          headers: request.headers.set('Authorization', `Bearer ${token}`),
        });
        // Mostrar todos los headers antes de enviar
        console.log(
          '🔎 Headers enviados:',
          authRequest.headers
            .keys()
            .map((k) => ({ [k]: authRequest.headers.get(k) })),
        );
        return next.handle(authRequest);
      } else {
        console.log('🚫 AuthTokenInterceptor - No hay token disponible para:', {
          url: request.url,
          method: request.method,
        });
      }
    } else {
      console.log(
        '🖥️ AuthTokenInterceptor - Ejecutándose en servidor (SSR), no se agrega token',
      );
    }

    return next.handle(request);
  }
}
