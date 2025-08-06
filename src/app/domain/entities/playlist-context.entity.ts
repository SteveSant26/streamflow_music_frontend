import { Song } from './song.entity';

export type PlaylistType = 'circular' | 'expandable' | 'single';

export type PlaylistContextType = 
  | 'user_playlist' 
  | 'album' 
  | 'artist' 
  | 'search' 
  | 'random' 
  | 'popular'
  | 'single';

export interface PlaylistContext {
  type: PlaylistContextType;
  songs: Song[];
  name?: string;
  query?: string; // Para búsquedas
  albumId?: string; // Para álbumes
  artistId?: string; // Para artistas
  playlistId?: string; // Para playlists de usuario
  page?: number; // Para paginación
  hasMore?: boolean; // Si hay más contenido disponible
}

export interface PlaylistMetadata {
  type: PlaylistType;
  context: PlaylistContext;
  searchQuery?: string;
  currentPage?: number;
  canLoadMore?: boolean;
}
