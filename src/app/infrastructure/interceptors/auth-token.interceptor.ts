import { Injectable, inject, PLATFORM_ID } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { isPlatformBrowser } from "@angular/common";
import { AuthStateService } from "@app/domain/services/auth-state-service";

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly authStateService = inject(AuthStateService);

  constructor() {}

  intercept(
    request: HttpRequest<unknown>,  
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    // Solo agregar token en el navegador (no durante SSR)
    if (isPlatformBrowser(this.platformId)) {
      const token: string | null = this.authStateService.token();

      if (token) {
        console.log(
          "🔑 AuthTokenInterceptor - Agregando token a la petición:",
          {
            url: request.url,
            method: request.method,
            token: token.substring(0, 20) + "...",
          },
        );

        const authRequest = request.clone({
          headers: request.headers.set("Authorization", `Bearer ${token}`),
        });

        return next.handle(authRequest);
      } else {
        console.log("🚫 AuthTokenInterceptor - No hay token disponible para:", {
          url: request.url,
          method: request.method,
        });
      }
    } else {
      console.log(
        "🖥️ AuthTokenInterceptor - Ejecutándose en servidor (SSR), no se agrega token",
      );
    }

    return next.handle(request);
  }
}
