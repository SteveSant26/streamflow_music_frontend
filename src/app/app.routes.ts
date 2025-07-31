import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
  {
    path: "",
    redirectTo: "/home",
    pathMatch: "full",
  },
  {
    path: "login",
    loadComponent: () =>
      import("./presentation/pages/auth/login/login").then(
        (m) => m.LoginComponent,
      ),
  },
  {
    path: "register",
    loadComponent: () =>
      import("./presentation/pages/auth/register/register").then(
        (m) => m.RegisterComponent,
      ),
  },{
    path: "reset-password",
    loadComponent: () =>
      import("./presentation/pages/auth/reset-password/reset-password").then(
        (m) => m.ResetPasswordComponent,
      ),
  },
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
