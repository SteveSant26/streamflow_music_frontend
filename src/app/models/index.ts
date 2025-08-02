// Interfaces para los modelos de datos del backend

export interface User {
  id: string;
  email: string;
  profile_picture?: string | null;
}

export interface Artist {
  id: string;
  name: string;
  image?: string;
  description?: string;
  followers?: number;
  verified?: boolean;
  genres?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Album {
  id: string;
  title: string;
  artistId: string;
  artist?: Artist;
  coverImage?: string;
  releaseDate: string;
  totalTracks: number;
  duration: number;
  createdAt: string;
  updatedAt: string;
}

export interface Song {
  id: string;
  title: string;
  artistId: string;
  artist?: Artist;
  albumId?: string;
  album?: Album;
  duration: number; // en segundos
  fileUrl: string;
  coverImage?: string;
  lyrics?: string;
  plays: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  userId: string;
  user?: User;
  coverImage?: string;
  songs: Song[];
  isPublic: boolean;
  totalDuration: number;
  totalSongs: number;
  createdAt: string;
  updatedAt: string;
}

export interface PlaylistSong {
  id: string;
  playlistId: string;
  songId: string;
  song: Song;
  addedAt: string;
  order: number;
}

// DTOs para las peticiones
export interface CreatePlaylistDto {
  name: string;
  description?: string;
  isPublic?: boolean;
  coverImage?: string;
}

export interface UpdatePlaylistDto {
  name?: string;
  description?: string;
  isPublic?: boolean;
  coverImage?: string;
}

export interface AddSongToPlaylistDto {
  songId: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

// Respuestas de la API
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
}

// Filtros y búsquedas
export interface SearchFilters {
  query?: string;
  type?: "song" | "artist" | "album" | "playlist";
  genre?: string;
  limit?: number;
  offset?: number;
}

export interface PlaylistFilters {
  userId?: string;
  isPublic?: boolean;
  limit?: number;
  offset?: number;
  sortBy?: "createdAt" | "name" | "totalSongs";
  sortOrder?: "asc" | "desc";
}
