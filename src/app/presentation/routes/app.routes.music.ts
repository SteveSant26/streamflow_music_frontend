import { Routes } from '@angular/router';

export const MUSIC_ROUTES: Routes = [
  {
    path: 'library',
    loadComponent: () =>
      import('../pages/music/library/library-main/library').then(
        (m) => m.LibraryComponent,
      ),
  },
  {
    path: 'search',
    loadComponent: () =>
      import('../pages/music/search/search-main/search').then(
        (m) => m.SearchComponent,
      ),
  },
  {
    path: 'discover',
    loadComponent: () =>
      import('../pages/music/discover/discover.component').then(
        (m) => m.DiscoverPageComponent,
      ),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('../pages/music/home/home.component').then(
        (m) => m.HomePageComponent,
      ),
  },
  {
    path: 'playlists',
    loadComponent: () =>
      import('../pages/music/playlist/playlists.component').then(
        (m) => m.PlaylistsComponent,
      ),
  },
  {
    path: 'playlist/:id',
    loadComponent: () =>
      import('../pages/music/playlist/playlist-detail.component').then(
        (m) => m.PlaylistDetailComponent,
      ),
  },
  {
    path: 'artist/:id',
    loadComponent: () =>
      import('../pages/music/artist/artist-main/artist').then(
        (m) => m.ArtistComponent,
      ),
  },
  {
    path: 'song/:id',
    loadComponent: () =>
      import('../pages/music/song/song-description/song-description').then(
        (m) => m.SongDescriptionComponent,
      ),
  },
  {
    path: 'current-song',
    loadComponent: () =>
      import('../pages/music/currentsong/current-song').then(
        (m) => m.CurrentSongComponent,
      ),
  },
];
