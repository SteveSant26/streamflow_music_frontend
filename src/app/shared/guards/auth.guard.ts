

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStatusUseCase } from '@app/domain/usecases/auth-status.usecase';


// Guard para proteger rutas privadas (solo usuarios autenticados)
export const authGuard: CanActivateFn = () => {
  const authUseCase = inject(AuthStatusUseCase);
  const router = inject(Router);
  return authUseCase.isAuthenticated() ? true : router.createUrlTree(['/login']);
};


// Guard para rutas públicas (login/register): si ya está autenticado, redirige a home o a la página anterior
export const publicGuard: CanActivateFn = () => {
  const authUseCase = inject(AuthStatusUseCase);
  const router = inject(Router);

  if (authUseCase.isAuthenticated()) {
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
