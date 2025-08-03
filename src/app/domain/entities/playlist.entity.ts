import { Song } from './song.entity';

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  coverImage?: string;
  isPublic: boolean;
  createdDate: string;
  songs: Song[];
  songCount: number;
  duration: number; // in seconds
  owner: {
    id: string;
    username: string;
  };
}
