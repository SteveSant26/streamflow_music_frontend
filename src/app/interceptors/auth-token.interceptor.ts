import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    // Solo agregar token en el browser, no en SSR
    if (!isPlatformBrowser(this.platformId)) {
      console.log("SSR detectado, omitiendo token");
      return next.handle(request);
    }

    // Obtener token del localStorage
    const token = localStorage.getItem("authToken");

    console.log("AuthTokenInterceptor:", {
      url: request.url,
      method: request.method,
      hasToken: !!token,
      tokenPreview: token ? token.substring(0, 20) + "..." : "null",
      existingAuth: request.headers.get("Authorization"),
    });

    // Si hay token y la request no tiene Authorization header ya
    if (token && !request.headers.has("Authorization")) {
      // Clonar la request y agregar el header de autorización
      const authRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`, // Usar Bearer como espera el backend
        },
      });

      console.log("Token agregado a la petición:", {
        url: request.url,
        authHeader:
          authRequest.headers.get("Authorization")?.substring(0, 30) + "...",
        method: request.method,
      });

      return next.handle(authRequest);
    }

    console.log("Petición sin token:", {
      url: request.url,
      reason: token ? "ya tiene auth header" : "no hay token",
    });
    return next.handle(request);
  }
}
