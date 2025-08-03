export const API_CONFIG_GENRES = {
  genres: {
    list: '/api/genres/',
    getById: (id: string) => `/api/genres/${id}/`,
    popular: '/api/genres/popular/',
    search: '/api/genres/search/',
    searchMusic: '/api/genres/search-music/',
  },
};
