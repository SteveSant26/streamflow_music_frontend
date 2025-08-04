// DTOs para Songs API basados en el OpenAPI
export interface SongDto {
  id: string;
  title: string;
  artist_id: string;
  artist_name?: string;
  album_id?: string;
  album_name?: string;
  duration_formatted: string; // Formato MM:SS
  genre_names_display: string; // Géneros como string separado por comas
  file_url?: string;
  thumbnail_url?: string;
  youtube_url?: string;
  youtube_id?: string;
  play_count: number;
  youtube_view_count?: number;
  youtube_like_count?: number;
  is_explicit?: boolean;
  audio_downloaded?: boolean;
  created_at?: string;
  updated_at?: string;
  published_at?: string;
}

// DTO simplificado para listas (SongList de la API)
export interface SongListDto {
  id: string;
  title: string;
  artist_name?: string;
  duration_formatted: string;
  genre_names_display: string;
  thumbnail_url?: string;
  play_count: number;
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
  youtube_url: string;
  title?: string;
  artist_name?: string;
}
