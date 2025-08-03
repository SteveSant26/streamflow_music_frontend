import { Routes } from '@angular/router';
import { authGuard } from '@app/shared/guards';

export const SUBSCRIPTION_ROUTES: Routes = [
  {
    path: 'plans',
    loadChildren: () =>
      import(
        '../pages/subscription/subscription-plans/subscription-plans.component'
      ).then((m) => m.SubscriptionPlansComponent),
  },
  {
    path: 'success',
    loadChildren: () =>
      import(
        '../pages/subscription/subscription-success/subscription-success.component'
      ).then((m) => m.SubscriptionSuccessComponent),
  },
  {
    path: 'manage',
    canActivate: [authGuard],
    loadChildren: () =>
      import(
        '../pages/subscription/subscription-management/subscription-management.component'
      ).then((m) => m.SubscriptionManagementComponent),
  },
  {
    path: '',
    redirectTo: 'plans',
    pathMatch: 'full',
  },
];
