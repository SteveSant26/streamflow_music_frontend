// DTOs para Genres API basados en el OpenAPI
export interface GenreDto {
  id: string;
  name: string;
  description?: string;
  color?: string;
  created_at: string;
  updated_at: string;
}

export interface PopularGenresParams {
  limit?: number;
}
