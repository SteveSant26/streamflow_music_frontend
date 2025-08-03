// DTO para gender API

export interface GenderDTO {
  id: number;
  name: string;
  description: string;
  imaage_url: string;
  color_hex: string;
  popularity_score: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}


export interface GenderSearchDTO {
  id: number;
  name: string;
  description: string;
  image_url: string;
  color_hex: string;
  popularity_score: number;
  is_active: boolean;
}

export interface GenderSearchParams {
  q: string;
  limit?: number;
}