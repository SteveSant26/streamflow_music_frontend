// DTOs para Artists API basados en el OpenAPI
export interface ArtistDto {
  id: string;
  name: string;
  biography?: string | null;
  image_url?: string | null;
  followers_count: number;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface ArtistSearchParams {
  // Filtros de búsqueda
  name?: string;
  search?: string;
  country?: string;
  
  // Filtros booleanos
  is_verified?: boolean;
  popular?: boolean;
  verified?: boolean;
  recent?: boolean;
  has_biography?: boolean;
  has_image?: boolean;
  
  // Filtros de rango
  min_followers_count?: number;
  max_followers_count?: number;
  
  // Filtros de fecha
  created_after?: string;
  created_before?: string;
  
  // Paginación
  page?: number;
  page_size?: number;
  
  // Ordenamiento
  ordering?: string;
}
