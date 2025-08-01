import { Routes } from '@angular/router';
import { ROUTES_CONFIG_AUTH } from '@app/config/routes-config/routes-auth.config';
import { publicGuard } from '@app/shared/guards';
export const AUTH_ROUTES: Routes = [
  {
    path: ROUTES_CONFIG_AUTH.LOGIN.path,
    loadComponent: () =>
      import('./../presentation/pages/auth/login/login').then(
        (m) => m.LoginComponent,
      ),
    canActivate: [publicGuard],
  },
  {
    path: ROUTES_CONFIG_AUTH.REGISTER.path,
    loadComponent: () =>
      import('./../presentation/pages/auth/register/register').then(
        (m) => m.RegisterComponent,
      ),
  },
  {
    path: ROUTES_CONFIG_AUTH.RESET_PASSWORD.path,
    loadComponent: () =>
      import('./../presentation/pages/auth/reset-password/reset-password').then(
        (m) => m.ResetPasswordComponent,
      ),
  },
];
