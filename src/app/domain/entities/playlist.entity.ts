import { Song } from './song.entity';

export interface Playlist {
  id: string;
  name: string;
  songs: Song[];
}
