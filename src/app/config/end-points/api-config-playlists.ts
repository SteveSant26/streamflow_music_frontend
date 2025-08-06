export const API_CONFIG_PLAYLISTS = {
  playlists: {
    // Endpoints basados en la API OpenAPI
    list: '/api/playlists/playlist/',
    create: '/api/playlists/playlist/',
    getById: (id: string) => `/api/playlists/playlist/${id}/`,
    update: (id: string) => `/api/playlists/playlist/${id}/`,
    delete: (id: string) => `/api/playlists/playlist/${id}/`,
    songs: {
      list: (id: string) => `/api/playlists/playlists/${id}/songs/`,
      add: (id: string) => `/api/playlists/playlists/${id}/songs/`,
      remove: (id: string, songId: string) => `/api/playlists/playlists/${id}/songs/${songId}/`,
    },
  },
};
