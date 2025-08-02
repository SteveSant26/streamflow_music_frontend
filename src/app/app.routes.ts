import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';
import { ROUTES_CONFIG_AUTH } from './config/routes-config/routes-auth.config';
import { AUTH_ROUTES } from './routes/app.routes.auth';
import { SUSBSRIPTION_ROUTES } from './routes/app.routes.subscription';

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
      import('./presentation/pages/users/user-p/user-perfil').then((m) => m.UserPerfilComponent),
    canActivate: [authGuard],
  },
  {
    path: 'subscription-plans',
    loadComponent: () =>
      import('./pages/subscription-plans/subscription-plans').then(
        (m) => m.SubscriptionPlansComponent,
      ),
  },
  {
    path: 'library',
    loadComponent: () =>
      import('./presentation/pages/users/user-p/user-perfil').then((m) => m.UserPerfilComponent),
  },
  {
    path: 'subscription',
    children: SUSBSRIPTION_ROUTES,
  },

  {
    path: '**',
    redirectTo: '/home',
  },
];
