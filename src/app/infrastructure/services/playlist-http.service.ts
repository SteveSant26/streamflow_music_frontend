import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Playlist,
  PlaylistWithSongs,
  CreatePlaylistDto,
  UpdatePlaylistDto,
  AddSongToPlaylistDto,
  PlaylistSong
} from '../../domain/entities/playlist.entity';
import { IPlaylistRepository } from '../../domain/repositories/i-playlist.repository';

@Injectable({
  providedIn: 'root'
})
export class PlaylistHttpService implements IPlaylistRepository {
  private readonly apiUrl = `${environment.api.baseUrl}/api/playlists`;

  constructor(private http: HttpClient) {}

  // CRUD operations for playlists
  getPlaylists(): Observable<Playlist[]> {
    return this.http.get<Playlist[]>(`${this.apiUrl}/`);
  }

  getPlaylist(id: string): Observable<PlaylistWithSongs> {
    return this.http.get<PlaylistWithSongs>(`${this.apiUrl}/${id}/`);
  }

  createPlaylist(playlist: CreatePlaylistDto): Observable<Playlist> {
    return this.http.post<Playlist>(`${this.apiUrl}/`, playlist);
  }

  updatePlaylist(id: string, playlist: UpdatePlaylistDto): Observable<Playlist> {
    return this.http.patch<Playlist>(`${this.apiUrl}/${id}/`, playlist);
  }

  deletePlaylist(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/`);
  }

  // Playlist songs operations
  getPlaylistSongs(playlistId: string): Observable<PlaylistSong[]> {
    return this.http.get<PlaylistSong[]>(`${this.apiUrl}/${playlistId}/songs/`);
  }

  addSongToPlaylist(playlistId: string, song: AddSongToPlaylistDto): Observable<PlaylistSong> {
    return this.http.post<PlaylistSong>(`${this.apiUrl}/${playlistId}/songs/`, song);
  }

  removeSongFromPlaylist(playlistId: string, songId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${playlistId}/songs/${songId}/`);
  }

  reorderPlaylistSongs(playlistId: string, songIds: string[]): Observable<PlaylistSong[]> {
    return this.http.post<PlaylistSong[]>(`${this.apiUrl}/${playlistId}/songs/reorder/`, {
      song_ids: songIds
    });
  }

  // Special operations
  getFavoritesPlaylist(): Observable<PlaylistWithSongs> {
    return this.http.get<PlaylistWithSongs>(`${this.apiUrl}/favorites/`);
  }

  ensureDefaultPlaylist(): Observable<Playlist> {
    return this.http.post<Playlist>(`${this.apiUrl}/ensure-default/`, {});
  }
}
