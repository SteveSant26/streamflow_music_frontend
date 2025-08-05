// DTOs para Songs API basados en el OpenAPI
export interface SongDto {
  id: string;
  title: string;
  artist_id?: string;
  artist_name?: string;
  album_id?: string;
  album_title?: string;  // Backend usa "album_title", no "album_name"
  album_name?: string;   // Mantener para compatibilidad
  duration_seconds?: number;
  duration_formatted?: string; // Formato MM:SS (calculado)
  genre_ids?: string[];
  genre_names?: string[];
  genre_names_display?: string; // Géneros como string separado por comas (calculado)
  track_number?: number;
  file_url?: string;     // ✅ URL del archivo de audio
  thumbnail_url?: string;
  lyrics?: string;
  play_count: number;
  favorite_count?: number;
  download_count?: number;
  source_type?: string;  // Backend devuelve esto
  source_id?: string;    // Backend devuelve esto (es el YouTube ID)
  source_url?: string;   // Backend devuelve esto (es el YouTube URL)
  youtube_url?: string;  // Mantener para compatibilidad
  youtube_id?: string;   // Mantener para compatibilidad
  is_active?: boolean;
  audio_quality?: string;
  audio_downloaded?: boolean;
  created_at?: string;
  updated_at?: string;
  release_date?: string;
  published_at?: string;
  // Legacy fields for compatibility
  youtube_view_count?: number;
  youtube_like_count?: number;
  is_explicit?: boolean;
}

// DTO simplificado para listas (SongList de la API)
export interface SongListDto {
  id: string;
  title: string;
  artist_id?: string;
  artist_name?: string;
  album_id?: string;
  album_name?: string;
  album_title?: string;  // Backend uses this field
  duration_formatted: string;
  duration_seconds?: number;
  genre_ids?: string[];
  genre_names?: string[];
  genre_names_display: string;
  track_number?: number;
  file_url?: string;     // ✅ Backend provides this!
  thumbnail_url?: string;
  lyrics?: string;
  play_count: number;
  favorite_count?: number;
  download_count?: number;
  source_type?: string;  // Backend field
  source_id?: string;    // Backend field (YouTube ID)
  source_url?: string;   // Backend field (YouTube URL)
  youtube_url?: string;  // Legacy compatibility
  youtube_id?: string;   // Legacy compatibility
  is_active?: boolean;
  audio_quality?: string;
  audio_downloaded?: boolean;
  created_at?: string;
  updated_at?: string;
  release_date?: string;
  published_at?: string;
  // Legacy fields for compatibility
  youtube_view_count?: number;
  youtube_like_count?: number;
  is_explicit?: boolean;
}

export interface PlayCountResponseDto {
  play_count: number;
}

export interface SongSearchParams {
  q: string;
  include_youtube?: boolean;
  limit?: number;
}

export interface PaginationParams {
  page?: number;
  page_size?: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  current_page: number;
  amount_of_pages: number;
  page_size: number;
  results: T[];
}

// Legacy DTOs for compatibility
export interface SongSearchDto {
  name: string;
  limit?: number;
}

export interface ProcessYoutubeDto {
  video_id?: string;
  youtube_url?: string;
  title?: string;
  artist_name?: string;
}
