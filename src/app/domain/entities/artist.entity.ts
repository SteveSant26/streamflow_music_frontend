// Entidades para Artists
export interface Artist {
  id: string;
  name: string;
  biography?: string;
  image_url?: string;
  followers_count: number;
  is_verified: boolean;
  verified?: boolean; // Alias para compatibilidad
  created_at: Date;
  updated_at: Date;
}

export interface ArtistListItem {
  id: string;
  name: string;
  image_url?: string;
  followers_count: number;
  is_verified: boolean;
  verified?: boolean; // Alias para compatibilidad
}
