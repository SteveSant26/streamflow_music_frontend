import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "@app/shared/services/auth.service";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.token();

  if (token?.accessToken) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    });
  }

  return next(req);
};
