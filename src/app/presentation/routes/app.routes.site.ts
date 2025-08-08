import { Routes } from '@angular/router';

export const SITE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../pages/site/home/home').then((m) => m.HomeComponent),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('../pages/site/home/home').then((m) => m.HomeComponent),
  },
  {
    path: 'explore',
    loadComponent: () =>
      import('../pages/site/explore/explore').then((m) => m.ExploreComponent),
  },
];
