import { Observable } from 'rxjs';
import {
  Playlist,
  PlaylistWithSongs,
  CreatePlaylistDto,
  UpdatePlaylistDto,
  AddSongToPlaylistDto,
  PlaylistSong
} from '../entities/playlist.entity';

export interface IPlaylistRepository {
  // CRUD operations for playlists
  getPlaylists(): Observable<Playlist[]>;
  getPlaylist(id: string): Observable<PlaylistWithSongs>;
  createPlaylist(playlist: CreatePlaylistDto): Observable<Playlist>;
  updatePlaylist(id: string, playlist: UpdatePlaylistDto): Observable<Playlist>;
  deletePlaylist(id: string): Observable<void>;

  // Playlist songs operations
  getPlaylistSongs(playlistId: string): Observable<PlaylistSong[]>;
  addSongToPlaylist(playlistId: string, song: AddSongToPlaylistDto): Observable<PlaylistSong>;
  removeSongFromPlaylist(playlistId: string, songId: string): Observable<void>;
  reorderPlaylistSongs(playlistId: string, songIds: string[]): Observable<PlaylistSong[]>;

  // Special operations
  getFavoritesPlaylist(): Observable<PlaylistWithSongs>;
  ensureDefaultPlaylist(): Observable<Playlist>;
}
