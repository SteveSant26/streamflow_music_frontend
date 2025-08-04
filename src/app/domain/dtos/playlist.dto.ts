export interface PlaylistDto {
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

export interface PaginatedPlaylistResponse {
  count: number;
  next: string | null;
  previous: string | null;
  current_page: number;
  amount_of_pages: number;
  page_size: number;
  results: PlaylistDto[];
}
