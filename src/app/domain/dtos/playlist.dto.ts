import { SongDto } from './song.dto';

export interface PlaylistDto {
  id: string;
  name: string;
  description?: string;
  coverImage?: string;
  isPublic: boolean;
  createdDate: string;
  songs: SongDto[];
  songCount: number;
  duration: number; // in seconds
  owner: {
    id: string;
    username: string;
  };
}

export interface CreatePlaylistDto {
  name: string;
  description?: string;
  isPublic?: boolean;
}

export interface UpdatePlaylistDto {
  name?: string;
  description?: string;
  isPublic?: boolean;
}

export interface AddSongToPlaylistDto {
  songId: string;
}

export interface PaginatedPlaylistResponse {
  count: number;
  next: string | null;
  previous: string | null;
  current_page: number;
  amount_of_pages: number;
  page_size: number;
  results: PlaylistDto[];
}
