// DTOs para Artists API basados en el OpenAPI
export interface ArtistDto {
  id: string;
  name: string;
  biography?: string;
  country?: string;
  image_url?: string;
  followers_count: number;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface ArtistSearchParams {
  name: string;
  limit?: number;
}

export interface ArtistsByCountryParams {
  country: string;
  limit?: number;
}

export interface PopularArtistsParams {
  limit?: number;
}

export interface VerifiedArtistsParams {
  limit?: number;
}
