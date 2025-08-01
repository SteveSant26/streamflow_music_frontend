import { Song } from './song.entity';

export interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number; // 0 to 1
  currentTime: number; // in seconds
  duration: number; // in seconds
  progress: number; // 0 to 100 percentage
  isLoading: boolean;
  isMuted: boolean;
  repeatMode: 'none' | 'one' | 'all';
  isShuffleEnabled: boolean;
}

export interface CurrentMusic {
  song: Song;
  playlist: string | null;
  index: number;
}
