export const API_CONFIG_SONGS = {
  songs: {
    getById: (song_id: string) => `/api/songs/${song_id}/`,
    incrementPlayCount: (song_id: string) => `/api/songs/${song_id}/increment-play-count/`,
    mostPopular: '/api/songs/most-popular/',
    processYoutube: '/api/songs/process-youtube/',
    random: '/api/songs/random/',
    search: '/api/songs/search/',
  },
};
