// DTOs para Songs API
export interface SongDto {
  id: string;
  title: string;
  youtube_video_id: string;
  artist_name: string;
  album_title: string;
  genre_name: string;
  duration_seconds: number;
  duration_formatted: string;
  file_url: string;
  thumbnail_url: string;
  youtube_url: string;
  tags: string[];
  play_count: number;
  youtube_view_count: number;
  youtube_like_count: number;
  is_explicit: boolean;
  audio_downloaded: boolean;
  created_at: string;
  published_at: string;
}

export interface SongSearchDto {
  id: string;
  title: string;
  artist_name: string;
  album_title: string;
  duration_formatted: string;
  thumbnail_url: string;
  play_count: number;
  audio_downloaded: boolean;
  file_url: string;
}

export interface ProcessYoutubeDto {
  video_id: string;
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
