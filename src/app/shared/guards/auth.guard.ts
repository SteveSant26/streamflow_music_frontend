
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthUseCase } from '@app/domain/use-cases/auth.use-case';

// Guard para proteger rutas privadas (solo usuarios autenticados)
  const authUseCase = inject(AuthUseCase);
  const router = inject(Router);
  return authUseCase.isAuthenticated() ? true : router.createUrlTree(['/login']);
};

// Guard para rutas públicas (login/register): si ya está autenticado, redirige a home
  const authUseCase = inject(AuthUseCase);
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
