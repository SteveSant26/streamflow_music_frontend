import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';
import { AUTH_ROUTES } from './app.routes.auth';

export const routes: Routes = [
  {
    path: "",
    redirectTo: "/home",
    pathMatch: "full",
  },
  ...AUTH_ROUTES,
  {
    path: "home",
    loadComponent: () =>
      import("./pages/home/home").then((m) => m.HomeComponent),
  },
  {
    path: "search",
    loadComponent: () =>
      import("./pages/search/search").then((m) => m.SearchComponent),
  },
  {
    path: "currentSong",
    loadComponent: () =>
      import("./pages/currentsong/current-song").then(
        (m) => m.CurrentSongComponent,
      ),
  },
  {
    path: "explore",
    loadComponent: () =>
      import("./pages/explore/explore").then((m) => m.ExploreComponent),
  },
  {
    path: "playlist/:id",
    loadComponent: () =>
      import("./pages/playlist/playlist").then((m) => m.PlaylistComponent),
  },
  {
    path: "library",
    loadComponent: () =>
      import("./pages/library/library").then((m) => m.LibraryComponent),
  },
  {
    path: "artist/:id",
    loadComponent: () =>
      import("./pages/artist/artist").then((m) => m.ArtistComponent),
  },
  {
    path: "profile",
    loadComponent: () =>
      import("./pages/user-p/user-perfil").then((m) => m.UserPerfilComponent),
  },
  {
    path: "library",
    loadComponent: () =>
      import('./pages/user-p/user-perfil').then((m) => m.UserPerfilComponent),
    canActivate: [authGuard],
  },
  {
    path: "test-connection",
    loadComponent: () =>
      import("./components/connection-test/connection-test.component").then(
        (m) => m.ConnectionTestComponent,
      ),
  },
  {
    path: "**",
    redirectTo: "/home",
  },
];
