import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStateService } from '@app/shared/services';

// Guard para proteger rutas privadas (solo usuarios autenticados)
export const authGuard: CanActivateFn = () => {
  const authStateService = inject(AuthStateService);
  const router = inject(Router);
  
  // Usar el computed signal directamente
  const isAuthenticated = authStateService.isAuthenticated();
  
  if (isAuthenticated) {
    return true;
  } else {
    return router.createUrlTree(['/auth/login']);
  }
};

// Guard para rutas públicas (login/register): si ya está autenticado, redirige a home
export const publicGuard: CanActivateFn = () => {
  const authStateService = inject(AuthStateService);
  const router = inject(Router);
  
  // Usar el computed signal directamente
  const isAuthenticated = authStateService.isAuthenticated();
  
  if (isAuthenticated) {
    return router.createUrlTree(['/home']);
  }
  
  return true;
};
