import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_CONFIG_PLAYLISTS } from '../../config/end-points/api-config-playlists';
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
  private readonly baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  // CRUD operations for playlists
  getPlaylists(): Observable<Playlist[]> {
    return this.http.get<Playlist[]>(`${this.baseUrl}${API_CONFIG_PLAYLISTS.playlists.list}`);
  }

  getPlaylist(id: string): Observable<PlaylistWithSongs> {
    return this.http.get<PlaylistWithSongs>(`${this.baseUrl}${API_CONFIG_PLAYLISTS.playlists.getById(id)}`);
  }

  createPlaylist(playlist: CreatePlaylistDto): Observable<Playlist> {
    return this.http.post<Playlist>(`${this.baseUrl}${API_CONFIG_PLAYLISTS.playlists.create}`, playlist);
  }

  updatePlaylist(id: string, playlist: UpdatePlaylistDto): Observable<Playlist> {
    return this.http.patch<Playlist>(`${this.baseUrl}${API_CONFIG_PLAYLISTS.playlists.update(id)}`, playlist);
  }

  deletePlaylist(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}${API_CONFIG_PLAYLISTS.playlists.delete(id)}`);
  }

  // Playlist songs operations
  getPlaylistSongs(playlistId: string): Observable<PlaylistSong[]> {
    return this.http.get<PlaylistSong[]>(`${this.baseUrl}${API_CONFIG_PLAYLISTS.playlists.songs.list(playlistId)}`);
  }

  addSongToPlaylist(playlistId: string, song: AddSongToPlaylistDto): Observable<PlaylistSong> {
    return this.http.post<PlaylistSong>(`${this.baseUrl}${API_CONFIG_PLAYLISTS.playlists.songs.add(playlistId)}`, song);
  }

  removeSongFromPlaylist(playlistId: string, songId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}${API_CONFIG_PLAYLISTS.playlists.songs.remove(playlistId, songId)}`);
  }

  reorderPlaylistSongs(playlistId: string, songIds: string[]): Observable<PlaylistSong[]> {
    // Esta funcionalidad no existe en la API según el OpenAPI
    throw new Error('Reorder functionality not available in API');
  }

  // Special operations
  getFavoritesPlaylist(): Observable<PlaylistWithSongs> {
    // Esta funcionalidad no existe en la API según el OpenAPI
    throw new Error('Favorites playlist functionality not available in API');
  }

  ensureDefaultPlaylist(): Observable<Playlist> {
    // Esta funcionalidad no existe en la API según el OpenAPI
    throw new Error('Ensure default playlist functionality not available in API');
  }
}
