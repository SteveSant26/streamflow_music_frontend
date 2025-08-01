
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@app/shared/services/auth.service';

// Guard para proteger rutas privadas (solo usuarios autenticados)
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.isAuthenticated() ? true : router.createUrlTree(['/login']);
};

// Guard para rutas públicas (login/register): si ya está autenticado, redirige a home
export const publicGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    // Intentar redirigir a la página anterior si existe
    const hasHistory = window.history.length > 1;
    if (hasHistory) {
      window.history.back();
      // Retornar false para cancelar la navegación actual
      return false;
    } else {
      // Si no hay historial, redirigir a home
      return router.createUrlTree(['/home']);
    }
  }
  return true;
};
