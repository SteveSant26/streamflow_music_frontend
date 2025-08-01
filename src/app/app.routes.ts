import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';
import { ROUTES_CONFIG_AUTH } from './config/routes-config/routes-auth.config';
import { AUTH_ROUTES } from './routes/app.routes.auth';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./pages/home/home').then((m) => m.HomeComponent),
  },
  {
    path: ROUTES_CONFIG_AUTH.BASE_URL.path,
    children: AUTH_ROUTES,
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home').then((m) => m.HomeComponent),
  },
  {
    path: 'search',
    loadComponent: () =>
      import('./pages/search/search').then((m) => m.SearchComponent),
  },
  {
    path: 'currentSong',
    loadComponent: () =>
      import('./presentation/pages/music/currentsong/current-song').then(
        (m) => m.CurrentSongComponent,
      ),
  },
  {
    path: 'explore',
    loadComponent: () =>
      import('./pages/explore/explore').then((m) => m.ExploreComponent),
  },
  {
    path: 'playlist/:id',
    loadComponent: () =>
      import('./pages/playlist/playlist').then((m) => m.PlaylistComponent),
  },
  {
    path: 'library',
    loadComponent: () =>
      import('./pages/library/library').then((m) => m.LibraryComponent),
  },
  {
    path: 'artist/:id',
    loadComponent: () =>
      import('./pages/artist/artist').then((m) => m.ArtistComponent),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./pages/user-p/user-perfil').then((m) => m.UserPerfilComponent),
    canActivate: [authGuard],
  },
  {
    path: 'library',
    loadComponent: () =>
      import('./pages/user-p/user-perfil').then((m) => m.UserPerfilComponent),
  },
  {
    path: 'subscription',
    children: [
      {
        path: 'plans',
        loadComponent: () =>
          import('./pages/subscription/subscription-plans/subscription-plans.component').then(
            (m) => m.SubscriptionPlansComponent
          ),
      },
      {
        path: 'success',
        loadComponent: () =>
          import('./pages/subscription/subscription-success/subscription-success.component').then(
            (m) => m.SubscriptionSuccessComponent
          ),
      },
      {
        path: 'manage',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/subscription/subscription-management/subscription-management.component').then(
            (m) => m.SubscriptionManagementComponent
          ),
      },
      {
        path: '',
        redirectTo: 'plans',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'test-connection',
    loadComponent: () =>
      import('./components/connection-test/connection-test.component').then(
        (m) => m.ConnectionTestComponent,
      ),
  },
  {
    path: '**',
    redirectTo: '/home',
  },
];
