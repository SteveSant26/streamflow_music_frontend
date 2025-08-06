// Entidades de dominio para Songs basadas en la nueva API
import type { Artist } from './artist.entity';
import type { Album } from './album.entity';

export interface Song {
  id: string;
  title: string;
  artist_id?: string;  // Made optional to match DTO
  artist_name?: string;
  artist?: Artist; // Información completa del artista
  album_id?: string;
  album_name?: string;  // Legacy field
  album_title?: string; // Backend uses this field
  album?: Album; // Información completa del álbum
  duration_formatted?: string; // Made optional to match DTO
  duration_seconds?: number; // Calculado localmente si es necesario
  genre_names_display?: string; // Made optional to match DTO
  file_url?: string;
  thumbnail_url?: string;
  source_type?: string;  // Backend field
  source_id?: string;    // Backend field (YouTube ID)
  source_url?: string;   // Backend field (YouTube URL)
  youtube_url?: string;  // Legacy field
  youtube_id?: string;   // Legacy field
  play_count: number;
  youtube_view_count?: number;
  youtube_like_count?: number;
  is_explicit?: boolean;
  audio_downloaded?: boolean;
  created_at?: Date;
  updated_at?: Date;
  published_at?: Date;
  // Additional properties for compatibility
  albumCover?: string; // Alias for thumbnail_url
  audioUrl?: string;   // Alias for file_url
  lyrics?: string;     // Optional lyrics
}

// Versión simplificada para listas (SongList de la API)
export interface SongListItem {
  id: string;
  title: string;
  artist_name?: string;
  duration_formatted: string;
  genre_names_display: string;
  thumbnail_url?: string;
  play_count: number;
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
  // Nuevos campos para contexto inteligente
  type?: 'circular' | 'expandable' | 'single';
  contextType?: 'user_playlist' | 'album' | 'artist' | 'search' | 'random' | 'popular' | 'single';
  searchQuery?: string;
  currentPage?: number;
  canLoadMore?: boolean;
  totalItems?: number;
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
