import { RenderMode, ServerRoute } from '@angular/ssr';

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
    path: 'login',
    renderMode: RenderMode.Client,
  },
  {
    path: 'register',
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
