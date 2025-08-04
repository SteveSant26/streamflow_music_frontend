import { Routes } from '@angular/router';

export const SITE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../pages/music/home/home.component').then((m) => m.HomePageComponent),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('../pages/music/home/home.component').then((m) => m.HomePageComponent),
  },
  {
    path: 'explore',
    loadComponent: () =>
      import('../pages/site/explore/explore').then((m) => m.ExploreComponent),
  },
];
