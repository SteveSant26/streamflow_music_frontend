import { Injectable, inject } from '@angular/core';
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
} from '../../domain/entities/playlist.entity';
import { IPlaylistRepository } from '../../domain/repositories/i-playlist.repository';
import { PlaylistHttpService } from '../services/playlist-http.service';

@Injectable({
  providedIn: 'root'
})
export class PlaylistRepositoryImpl implements IPlaylistRepository {
  private readonly playlistHttpService = inject(PlaylistHttpService);

  // CRUD operations for playlists
  getPlaylists(filters?: PlaylistFilters): Observable<PaginatedPlaylistResponse> {
    return this.playlistHttpService.getPlaylists(filters);
  }

  getPlaylist(id: string): Observable<PlaylistWithSongs> {
    return this.playlistHttpService.getPlaylist(id);
  }

  createPlaylist(playlist: CreatePlaylistDto): Observable<Playlist> {
    return this.playlistHttpService.createPlaylist(playlist);
  }

  updatePlaylist(id: string, playlist: UpdatePlaylistDto): Observable<Playlist> {
    return this.playlistHttpService.updatePlaylist(id, playlist);
  }

  deletePlaylist(id: string): Observable<void> {
    return this.playlistHttpService.deletePlaylist(id);
  }

  // Playlist songs operations
  getPlaylistSongs(playlistId: string, page?: number, pageSize?: number): Observable<PaginatedPlaylistSongResponse> {
    return this.playlistHttpService.getPlaylistSongs(playlistId, page, pageSize);
  }

  addSongToPlaylist(playlistId: string, song: AddSongToPlaylistDto): Observable<PlaylistSong> {
    return this.playlistHttpService.addSongToPlaylist(playlistId, song);
  }

  removeSongFromPlaylist(playlistId: string, songId: string): Observable<void> {
    return this.playlistHttpService.removeSongFromPlaylist(playlistId, songId);
  }

  // User-specific operations
  getUserPlaylists(filters?: PlaylistFilters): Observable<PaginatedPlaylistResponse> {
    return this.playlistHttpService.getUserPlaylists(filters);
  }

  getUserPlaylist(id: string): Observable<PlaylistWithSongs> {
    return this.playlistHttpService.getUserPlaylist(id);
  }
}
