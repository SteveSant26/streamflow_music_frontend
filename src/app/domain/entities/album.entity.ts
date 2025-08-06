// Entidades para Albums
export interface Album {
  id: string;
  title: string;
  artist_name: string;
  artist_id: string;
  release_date: Date | null;
  cover_url?: string;
  genre?: string;
  total_tracks: number;
  duration_formatted: string; // "HH:MM:SS"
  created_at: Date;
  updated_at: Date;
}

export interface AlbumListItem {
  id: string;
  title: string;
  artist_name: string;
  artist_id: string;
  cover_url?: string;
  release_date: Date | null;
  total_tracks: number;
}
