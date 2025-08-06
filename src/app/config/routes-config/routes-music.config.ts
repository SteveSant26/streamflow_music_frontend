// Archivo centralizado para rutas de música
export const ROUTES_CONFIG_MUSIC = {
  BASE_URL: {
    path: 'music',
    link: '/music',
  },
  LIBRARY: {
    path: 'library',
    link: '/library',
  },
  SEARCH: {
    path: 'search',
    link: '/search',
  },
  DISCOVER: {
    path: 'discover',
    link: '/discover',
  },
  CURRENT_SONG: {
    path: 'current-song',
    link: '/current-song',
  },
  PLAYLIST: {
    path: 'playlist/:id',
    link: '/playlist',
    getLinkWithId: (id: string) => `/playlist/${id}`,
  },
  ARTIST: {
    path: 'artist/:id',
    link: '/artist',
    getLinkWithId: (id: string) => `/artist/${id}`,
  },
  ARTISTS: {
    path: 'artists',
    link: '/artists',
  },
  SONG: {
    path: 'song/:id',
    link: '/song',
    getLinkWithId: (id: string) => `/song/${id}`,
  },
  SONGS: {
    path: 'songs',
    link: '/songs',
  },
  RANDOM_SONGS: {
    path: 'random-songs',
    link: '/random-songs',
  },
  ALBUM: {
    path: 'album/:id',
    link: '/album',
    getLinkWithId: (id: string) => `/album/${id}`,
  },
  ALBUMS: {
    path: 'albums',
    link: '/albums',
  },
  GENRE: {
    path: 'genre/:id',
    link: '/genre',
    getLinkWithId: (id: string) => `/genre/${id}`,
  },
  GENRES: {
    path: 'genres',
    link: '/genres',
  },
};
