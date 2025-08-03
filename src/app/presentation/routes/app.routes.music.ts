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
    path: 'playlist/:id',
    loadComponent: () =>
      import('../pages/music/playlist/playlist-main/playlist').then(
        (m) => m.PlaylistComponent,
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
