import { Song } from './song.entity';

// Entidades principales basadas en el backend
export interface Playlist {
  id: string;
  name: string;
  description?: string;
  user_id: string;
  is_default: boolean;
  is_public: boolean;
  total_songs: number;
  playlist_img?: string; // URL de la imagen de la playlist
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

// Entidad para respuesta paginada
export interface PaginatedPlaylistResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Playlist[];
}

export interface PaginatedPlaylistSongResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PlaylistSong[];
}

// Entidades para filtros de búsqueda
export interface PlaylistFilters {
  name?: string;
  description?: string;
  is_public?: boolean;
  is_default?: boolean;
  user_id?: string;
  user_username?: string;
  has_description?: boolean;
  min_song_count?: number;
  max_song_count?: number;
  created_after?: string;
  created_before?: string;
  updated_after?: string;
  updated_before?: string;
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

// DTOs para operaciones CRUD
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

// Eventos del dominio
export interface PlaylistCreatedEvent {
  type: 'PLAYLIST_CREATED';
  payload: Playlist;
}

export interface PlaylistUpdatedEvent {
  type: 'PLAYLIST_UPDATED';
  payload: Playlist;
}

export interface PlaylistDeletedEvent {
  type: 'PLAYLIST_DELETED';
  payload: { id: string };
}

export interface SongAddedToPlaylistEvent {
  type: 'SONG_ADDED_TO_PLAYLIST';
  payload: { playlist: Playlist; song: PlaylistSong };
}

export interface SongRemovedFromPlaylistEvent {
  type: 'SONG_REMOVED_FROM_PLAYLIST';
  payload: { playlistId: string; songId: string };
}

export type PlaylistDomainEvent = 
  | PlaylistCreatedEvent
  | PlaylistUpdatedEvent
  | PlaylistDeletedEvent
  | SongAddedToPlaylistEvent
  | SongRemovedFromPlaylistEvent;
