// DTOs para Genres API basados en el OpenAPI
export interface GenreDto {
  id: string;
  name: string;
  description?: string;
  color_hex?: string;
  image_url?: string;
  popularity_score: number;
  created_at: string;
  updated_at: string;
}

export interface GenreSearchParams {
  // Filtros de búsqueda
  name?: string;
  search?: string;
  
  // Filtros booleanos
  has_color?: boolean;
  has_description?: boolean;
  has_image?: boolean;
  
  // Filtros de rango
  min_popularity_score?: number;
  max_popularity_score?: number;
  
  // Filtros de fecha
  created_after?: string;
  created_before?: string;
  
  // Paginación
  page?: number;
  page_size?: number;
  
  // Ordenamiento
  ordering?: string;
}
