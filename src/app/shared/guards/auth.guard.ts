import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@app/shared/services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Si no está autenticado, redirigir a la página de login
  return router.createUrlTree(['/login']);
};

export const authGuardRedirect: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return router.createUrlTree(['/home']);
  }

  // Si no está autenticado, redirigir a la página de login
  return router.createUrlTree(['/login']);
};

export const authGuardRedirectIfNotAuthenticated: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/login']);
  }

  return true;
  // Si no está autenticado, redirigir a la página de login
};

export const authGuardRedirectIfAuthenticated: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return router.createUrlTree(['/home']);
  }

  // Si no está autenticado, redirigir a la página de login
  return true;
};
