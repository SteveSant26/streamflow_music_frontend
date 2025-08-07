export const API_CONFIG_LYRICS = {
  lyrics: {
    getSongLyrics: (song_id: string) => `/api/songs/${song_id}/lyrics/`,
    // Note: Backend automatically searches for lyrics when getting them
    // No separate update endpoint exists
  },
};
