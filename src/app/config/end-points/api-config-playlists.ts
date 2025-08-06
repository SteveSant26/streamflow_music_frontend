export const API_CONFIG_PLAYLISTS = {
  // Mis playlists (autenticadas)
  myPlaylists: {
    list: '/api/user/profile/playlists/',
    create: '/api/playlists/playlist/', // Crear sigue siendo el mismo endpoint
    getById: (id: string) => `/api/playlists/playlist/${id}/`,
    update: (id: string) => `/api/playlists/playlist/${id}/`,
    delete: (id: string) => `/api/playlists/playlist/${id}/`,
    songs: {
      list: (id: string) => `/api/playlists/playlists/${id}/songs/`,
      add: (id: string) => `/api/playlists/playlists/${id}/songs/`,
      remove: (id: string, songId: string) => `/api/playlists/playlists/${id}/songs/${songId}/`,
    },
  },
  // Playlists públicas (pueden ser anónimas)
  publicPlaylists: {
    list: '/api/playlists/playlist/', // Con filtro is_public=true
    getById: (id: string) => `/api/playlists/playlist/${id}/`,
    songs: {
      list: (id: string) => `/api/playlists/playlists/${id}/songs/`,
    },
  },
};
