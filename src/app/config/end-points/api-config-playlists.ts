export const API_CONFIG_PLAYLISTS = {
  playlists: {
    list: '/api/playlists/playlists/',
    create: '/api/playlists/playlists/',
    getById: (id: string) => `/api/playlists/playlists/${id}/`,
    update: (id: string) => `/api/playlists/playlists/${id}/`,
    delete: (id: string) => `/api/playlists/playlists/${id}/`,
    songs: {
      list: (id: string) => `/api/playlists/playlists/${id}/songs/`,
      add: (id: string) => `/api/playlists/playlists/${id}/songs/`,
      remove: (id: string, songId: string) => `/api/playlists/playlists/${id}/songs/${songId}/`,
    },
  },
};
