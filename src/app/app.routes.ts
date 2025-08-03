import { Routes } from '@angular/router';
import { ROUTES_CONFIG_AUTH } from './config/routes-config/routes-auth.config';
import { AUTH_ROUTES } from './presentation/routes/app.routes.auth';
import { SUSBSRIPTION_ROUTES } from './presentation/routes/app.routes.subscription';
import { authGuard } from './shared/guards';
import { AuthLoyout } from './presentation/layout/auth-loyout/auth-loyout';
import { GlobalLoyout } from './presentation/layout/global-loyout/global-loyout';

export const routes: Routes = [
  {
    path: '',
    component: GlobalLoyout,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./presentation/pages/site/home/home').then(
            (m) => m.HomeComponent,
          ),
      },

      {
        path: 'home',
        loadComponent: () =>
          import('./presentation/pages/site/home/home').then(
            (m) => m.HomeComponent,
          ),
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
        path: 'playlist/:id',
        loadComponent: () =>
          import('./pages/playlist/playlist').then((m) => m.PlaylistComponent),
      },
      {
        path: 'song/:id',
        loadComponent: () =>
          import('./pages/song-description/song-description').then(
            (m) => m.SongDescriptionComponent,
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./presentation/pages/users/user-p/user-perfil').then(
            (m) => m.UserPerfilComponent,
          ),
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
          import('./presentation/pages/users/user-p/user-perfil').then(
            (m) => m.UserPerfilComponent,
          ),
      },
      {
        path: 'terms-and-conditions',
        loadComponent: () =>
          import(
            './presentation/pages/terms-and-condition/terms-and-condition'
          ).then((m) => m.TermsAndCondition),
      },
      {
        path: 'subscription',
        children: SUSBSRIPTION_ROUTES,
      },
    ],
  },
  {
    path: '',
    component: AuthLoyout,
    children: [
      {
        path: ROUTES_CONFIG_AUTH.BASE_URL.path,
        children: AUTH_ROUTES,
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/home',
  },
];
