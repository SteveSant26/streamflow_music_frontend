export const API_CONFIG_ALBUMS = {
  albums: {
    list: '/api/albums/',
    getById: (id: string) => `/api/albums/${id}/`,
    byArtist: '/api/albums/by-artist/',
    popular: '/api/albums/popular/',
    search: '/api/albums/search/',
  },
};
