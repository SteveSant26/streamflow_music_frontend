import { RenderMode, ServerRoute } from '@angular/ssr';
import { ROUTES_CONFIG_AUTH } from './config/routes-auth.config';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'artist/:id',
    renderMode: RenderMode.Client,
  },
  {
    path: 'playlist/:id',
    renderMode: RenderMode.Client,
  },
  {
    path: '',
    renderMode: RenderMode.Client,
  },
  {
    path: 'home',
    renderMode: RenderMode.Client,
  },
  {
    path: 'search',
    renderMode: RenderMode.Client,
  },
  {
    path: 'library',
    renderMode: RenderMode.Client,
  },
  {
    path: 'explore',
    renderMode: RenderMode.Client,
  },
  {
    path: 'currentSong',
    renderMode: RenderMode.Client,
  },
  {
    path: 'profile',
    renderMode: RenderMode.Client,
  },
  {
    path: `${ROUTES_CONFIG_AUTH.BASE_URL.path}/${ROUTES_CONFIG_AUTH.LOGIN.path}`,
    renderMode: RenderMode.Client,
  },
  {
    path: `${ROUTES_CONFIG_AUTH.BASE_URL.path}/${ROUTES_CONFIG_AUTH.REGISTER.path}`,
    renderMode: RenderMode.Client,
  },
  {
    path: `${ROUTES_CONFIG_AUTH.BASE_URL.path}/${ROUTES_CONFIG_AUTH.RESET_PASSWORD.path}`,
    renderMode: RenderMode.Client,
  },
  {
    path: 'explore',
    renderMode: RenderMode.Client,
  },
  {
    path: 'library',
    renderMode: RenderMode.Client,
  },
  {
    path: 'currentSong',
    renderMode: RenderMode.Client,
  },
];
