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
  SONG: {
    path: 'song/:id',
    link: '/song',
    getLinkWithId: (id: string) => `/song/${id}`,
  },
  ALBUM: {
    path: 'album/:id',
    link: '/album',
    getLinkWithId: (id: string) => `/album/${id}`,
  },
};
