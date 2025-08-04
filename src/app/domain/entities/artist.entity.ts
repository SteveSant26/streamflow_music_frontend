// Entidades para Artists
export interface Artist {
  id: string;
  name: string;
  biography?: string;
  country?: string;
  image_url?: string;
  followers_count: number;
  is_verified: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface ArtistListItem {
  id: string;
  name: string;
  country?: string;
  image_url?: string;
  followers_count: number;
  is_verified: boolean;
}
