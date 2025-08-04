import { Routes } from '@angular/router';
import { ROUTES_CONFIG_AUTH } from './config/routes-config/routes-auth.config';
import { AUTH_ROUTES } from './presentation/routes/app.routes.auth';
import { SUBSCRIPTION_ROUTES } from './presentation/routes/app.routes.subscription';
import { MUSIC_ROUTES } from './presentation/routes/app.routes.music';
import { SITE_ROUTES } from './presentation/routes/app.routes.site';
import { authGuard } from './shared/guards';
import { AuthLoyout } from './presentation/layout/auth-loyout/auth-loyout';
import { GlobalLoyout } from './presentation/layout/global-loyout/global-loyout';

export const routes: Routes = [
  // Rutas con pantalla completa (sin layout)
  {
    path: 'currentSong',
    loadComponent: () =>
      import('./presentation/pages/music/currentsong/current-song').then(
        (m) => m.CurrentSongComponent,
      ),
  },
  
  // Rutas principales con GlobalLayout
  {
    path: '',
    component: GlobalLoyout,
    children: [
      // Site routes (home, explore)
      ...SITE_ROUTES,
      
      // Nueva página de descubrimiento
      {
        path: 'discover',
        loadComponent: () =>
          import('./pages/discover/discover.component').then(
            (m) => m.DiscoverPageComponent,
          ),
      },
      
      // Music routes (library, search, playlist, artist, song)
      ...MUSIC_ROUTES,
      
      // Playlist routes
      {
        path: 'playlists',
        loadComponent: () =>
          import('./pages/playlist/playlists.component').then(
            (m) => m.PlaylistsComponent,
          ),
        canActivate: [authGuard],
      },
      {
        path: 'playlist/:id/detail',
        loadComponent: () =>
          import('./pages/playlist/playlist-detail.component').then(
            (m) => m.PlaylistDetailComponent,
          ),
        canActivate: [authGuard],
      },
      
      // Rutas de perfil
      {
        path: 'profile',
        loadComponent: () =>
          import('./presentation/pages/users/user-p/user-perfil').then(
            (m) => m.UserPerfilComponent,
          ),
        canActivate: [authGuard],
      },
      
      // Rutas de términos y condiciones
      {
        path: 'terms-and-conditions',
        loadComponent: () =>
          import(
            './presentation/pages/terms-and-condition/terms-and-condition'
          ).then((m) => m.TermsAndCondition),
      },
      
      // Rutas de suscripción
      {
        path: 'subscription',
        children: SUBSCRIPTION_ROUTES,
      },
    ],
  },
  
  // Rutas de autenticación con AuthLayout
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
  
  // Ruta por defecto
  {
    path: '**',
    redirectTo: '/home',
  },
];
