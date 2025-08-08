// DTOs que mapean exactamente la respuesta de la API según OpenAPI

export interface PlaylistDto {
  id: string;
  name: string;
  description?: string;
  user_id: string;
  is_default: boolean;
  is_public: boolean;
  song_count: number; // Cambiado de total_songs a song_count para coincidir con la API real
  playlist_img?: string; // URL de la imagen de la playlist
  created_at: string;
  updated_at: string;
}

export interface PlaylistSongDto {
  id: string;
  title: string;
  artist_name?: string;
  album_name?: string;
  duration_seconds: number;
  thumbnail_url?: string;
  position: number;
  added_at: string;
}

export interface PlaylistWithSongsDto extends PlaylistDto {
  songs: PlaylistSongDto[];
}

// DTOs para requests
export interface CreatePlaylistRequestDto {
  name: string;
  description?: string;
  is_public?: boolean;
}

export interface UpdatePlaylistRequestDto {
  name?: string;
  description?: string;
  is_public?: boolean;
}

export interface AddSongToPlaylistRequestDto {
  song_id: string;
  position?: number;
}

// DTOs para respuestas paginadas (según la API)
export interface PaginatedPlaylistResponseDto {
  count: number;
  next: string | null;
  previous: string | null;
  results: PlaylistDto[];
}

export interface PaginatedPlaylistSongResponseDto {
  count: number;
  next: string | null;
  previous: string | null;
  results: PlaylistSongDto[];
}

// DTOs para filtros y parámetros de consulta
export interface PlaylistQueryParamsDto {
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

// DTOs específicos para diferentes tipos de consultas
export interface MyPlaylistsQueryParamsDto {
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface PublicPlaylistsQueryParamsDto extends PlaylistQueryParamsDto {
  is_public: true; // Siempre true para playlists públicas
}

export interface PlaylistSongQueryParamsDto {
  ordering?: string;
  page?: number;
  page_size?: number;
  search?: string;
}
