export const API_CONFIG_ARTISTS = {
  artists: {
    list: '/api/artists/',
    getById: (id: string) => `/api/artists/${id}/`,
    byCountry: '/api/artists/by-country/',
    popular: '/api/artists/popular/',
    search: '/api/artists/search/',
    verified: '/api/artists/verified/',
  },
};
