import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "../../services/auth.service";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getAuthToken();

  console.log('🔑 AuthInterceptor - Procesando petición:', {
    url: req.url,
    method: req.method,
    hasToken: !!token,
    token: token ? token.substring(0, 20) + '...' : 'No token'
  });

  if (token) {
    const cloned = req.clone({
      headers: req.headers.set("Authorization", `Bearer ${token}`),
    });
    return next(cloned);
  }

  return next(req);
};
