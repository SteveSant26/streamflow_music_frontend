export interface Song {
  id: string;
  title: string;
  artist: string;
  duration: number;
  albumCover?: string;
  audioUrl: string; // Dynamic audio file path
}
