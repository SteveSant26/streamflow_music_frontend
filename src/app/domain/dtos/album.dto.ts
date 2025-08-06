// DTOs para Albums API basados en el OpenAPI
export interface AlbumDto {
  id: string;
  title: string;
  artist_id: string;
  artist_name: string;
  artist_verified: boolean;
  release_date: string | null; // ISO date string
  description?: string | null;
  cover_image_url?: string | null;
  total_tracks: number;
  play_count: number;
  source_type: 'manual' | 'youtube' | 'spotify' | 'soundcloud';
  source_id?: string | null;
  source_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface AlbumSearchParams {
  // Filtros de búsqueda
  title?: string;
  search?: string;
  artist_name?: string;
  artist_id?: string;
  
  // Filtros de tipo
  source_type?: string;
  
  // Filtros de fecha
  min_release_date?: string;
  max_release_date?: string;
  release_year?: number;
  created_after?: string;
  created_before?: string;
  
  // Filtros de rango
  min_total_tracks?: number;
  max_total_tracks?: number;
  min_play_count?: number;
  max_play_count?: number;
  
  // Filtros booleanos
  has_cover_image?: boolean;
  has_description?: boolean;
  popular?: boolean;
  recent?: boolean;
  
  // Paginación
  page?: number;
  page_size?: number;
  
  // Ordenamiento
  ordering?: string;
}
