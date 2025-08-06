import { Observable } from 'rxjs';
import {
  Playlist,
  PlaylistWithSongs,
  CreatePlaylistDto,
  UpdatePlaylistDto,
  AddSongToPlaylistDto,
  PlaylistSong,
  PaginatedPlaylistResponse,
  PaginatedPlaylistSongResponse,
  PlaylistFilters
} from '../entities/playlist.entity';

export interface IPlaylistRepository {
  // CRUD operations for playlists
  getPlaylists(filters?: PlaylistFilters): Observable<PaginatedPlaylistResponse>;
  getPlaylist(id: string): Observable<PlaylistWithSongs>;
  createPlaylist(playlist: CreatePlaylistDto): Observable<Playlist>;
  updatePlaylist(id: string, playlist: UpdatePlaylistDto): Observable<Playlist>;
  deletePlaylist(id: string): Observable<void>;

  // Playlist songs operations
  getPlaylistSongs(playlistId: string, page?: number, pageSize?: number): Observable<PaginatedPlaylistSongResponse>;
  addSongToPlaylist(playlistId: string, song: AddSongToPlaylistDto): Observable<PlaylistSong>;
  removeSongFromPlaylist(playlistId: string, songId: string): Observable<void>;

  // User-specific operations
  getUserPlaylists(filters?: PlaylistFilters): Observable<PaginatedPlaylistResponse>;
  getUserPlaylist(id: string): Observable<PlaylistWithSongs>;
}
