// Entidades de dominio para Songs
export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  duration: string;
  durationSeconds: number;
  fileUrl: string;
  thumbnailUrl: string;
  youtubeUrl: string;
  tags: string[];
  playCount: number;
  youtubeViewCount: number;
  youtubeLikeCount: number;
  isExplicit: boolean;
  audioDownloaded: boolean;
  createdAt: Date;
  publishedAt: Date;
  // Additional properties for compatibility
  albumCover?: string; // Alias for thumbnailUrl
  audioUrl?: string;   // Alias for fileUrl
  lyrics?: string;     // Optional lyrics
}

export interface PlaylistItem extends Song {
  position: number;
  addedAt: Date;
}

export interface Playlist {
  id: string;
  name: string;
  items: PlaylistItem[];
  currentIndex: number;
  isShuffled: boolean;
  repeatMode: 'none' | 'one' | 'all';
}

export interface PlaybackState {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  hasPlayedFirstQuarter: boolean;
}
