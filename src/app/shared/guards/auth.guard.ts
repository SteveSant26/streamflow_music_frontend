import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStateService } from '@app/shared/services';
import { ROUTES_CONFIG_AUTH } from '../../config/routes-config/routes-auth.config';
import { ROUTES_CONFIG_MUSIC } from '../../config/routes-config/routes-music.config';

// Guard para proteger rutas privadas (solo usuarios autenticados)
export const authGuard: CanActivateFn = () => {
  const authStateService = inject(AuthStateService);
  const router = inject(Router);
  
  // Usar el computed signal directamente
  const isAuthenticated = authStateService.isAuthenticated();
  
  if (isAuthenticated) {
    return true;
  } else {
    return router.createUrlTree([ROUTES_CONFIG_AUTH.LOGIN.link]);
  }
};

// Guard para rutas públicas (login/register): si ya está autenticado, redirige a home
export const publicGuard: CanActivateFn = () => {
  const authStateService = inject(AuthStateService);
  const router = inject(Router);
  
  // Usar el computed signal directamente
  const isAuthenticated = authStateService.isAuthenticated();
  
  if (isAuthenticated) {
    return router.createUrlTree([ROUTES_CONFIG_MUSIC.BASE_URL.link]);
  }
  
  return true;
};
