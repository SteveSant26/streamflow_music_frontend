import { Routes } from '@angular/router';
import { authGuard } from '@app/shared/guards';

export const SUSBSRIPTION_ROUTES: Routes = [
  {
    path: 'plans',
    loadChildren: () =>
      import(
        '../presentation/pages/subscription/subscription-plans/subscription-plans.component'
      ).then((m) => m.SubscriptionPlansComponent),
  },
  {
    path: 'success',
    loadChildren: () =>
      import(
        '../presentation/pages/subscription/subscription-success/subscription-success.component'
      ).then((m) => m.SubscriptionSuccessComponent),
  },
  {
    path: 'manage',
    canActivate: [authGuard],
    loadChildren: () =>
      import(
        '../presentation/pages/subscription/subscription-management/subscription-management.component'
      ).then((m) => m.SubscriptionManagementComponent),
  },
  {
    path: '',
    redirectTo: 'plans',
    pathMatch: 'full',
  },
];
