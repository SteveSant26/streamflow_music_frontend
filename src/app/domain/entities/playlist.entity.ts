import { Song } from './song.entity';

// Nueva interfaz para nuestro backend
export interface Playlist {
  id: string;
  name: string;
  description?: string;
  user_id: string;
  is_default: boolean;
  is_public: boolean;
  total_songs: number;
  created_at: string;
  updated_at: string;
}

export interface PlaylistSong {
  id: string;
  title: string;
  artist_name?: string;
  album_name?: string;
  duration_seconds: number;
  thumbnail_url?: string;
  position: number;
  added_at: string;
}

export interface PlaylistWithSongs extends Playlist {
  songs: PlaylistSong[];
}

// Interfaz de compatibilidad para el reproductor existente
export interface LegacyPlaylist {
  id: string;
  name: string;
  description?: string;
  coverImage?: string;
  isPublic: boolean;
  createdDate: string;
  songs: Song[];
  songCount: number;
  duration: number; // in seconds
  owner: {
    id: string;
    username: string;
  };
}

// DTOs para crear/actualizar playlists
export interface CreatePlaylistDto {
  name: string;
  description?: string;
  is_public?: boolean;
}

export interface UpdatePlaylistDto {
  name?: string;
  description?: string;
  is_public?: boolean;
}

export interface AddSongToPlaylistDto {
  song_id: string;
  position?: number;
}
