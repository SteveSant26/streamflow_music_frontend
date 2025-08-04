import { Routes } from '@angular/router';

export const SITE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../../pages/home/home').then((m) => m.HomePage),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('../../pages/home/home').then((m) => m.HomePage),
  },
  {
    path: 'explore',
    loadComponent: () =>
      import('../pages/site/explore/explore').then((m) => m.ExploreComponent),
  },
];
