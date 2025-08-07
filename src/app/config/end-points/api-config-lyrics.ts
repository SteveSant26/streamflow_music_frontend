export const API_CONFIG_LYRICS = {
  lyrics: {
    getSongLyrics: (song_id: string) => `/api/songs/list/${song_id}/lyrics/`,
    updateSongLyrics: (song_id: string) => `/api/songs/list/${song_id}/lyrics/update/`,
  },
};
