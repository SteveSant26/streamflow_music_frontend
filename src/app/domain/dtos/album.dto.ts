// DTOs para Albums API basados en el OpenAPI
export interface AlbumDto {
  id: string;
  title: string;
  artist_id: string;
  artist_name?: string;
  release_date?: string; // ISO date string
  description?: string;
  cover_image_url?: string;
  total_tracks: number;
  play_count: number;
  created_at?: string;
  updated_at?: string;
}

export interface AlbumSearchParams {
  title: string;
  limit?: number;
}

export interface AlbumsByArtistParams {
  artist_id: string;
  limit?: number;
}

export interface PopularAlbumsParams {
  limit?: number;
}
