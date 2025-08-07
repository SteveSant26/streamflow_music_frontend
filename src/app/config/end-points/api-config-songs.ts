export const API_CONFIG_SONGS = {
  songs: {
    list: '/api/songs/list/',
    getById: (song_id: string) => `/api/songs/list/${song_id}/`,
    incrementPlayCount: (song_id: string) => `/api/songs/${song_id}/increment-play-count/`,
    getLyrics: (song_id: string) => `/api/songs/${song_id}/lyrics/`,
    mostPopular: '/api/songs/most-popular/',
    random: '/api/songs/random/',
  },
};
