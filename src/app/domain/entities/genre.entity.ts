// Entidades para Genres
export interface Genre {
  id: string;
  name: string;
  description?: string;
  color?: string;
  created_at: Date;
  updated_at: Date;
}

export interface GenreListItem {
  id: string;
  name: string;
  description?: string;
  color?: string;
}
