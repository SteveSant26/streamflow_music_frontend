import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { 
  Playlist, 
  CreatePlaylistDto, 
  UpdatePlaylistDto, 
  AddSongToPlaylistDto,
  PlaylistFilters,
  PaginatedResponse,
  Song
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  private endpoint = '/playlists';

  constructor(private apiService: ApiService) {}

  /**
   * Obtener todas las playlists con filtros opcionales
   */
  getPlaylists(filters?: PlaylistFilters): Observable<PaginatedResponse<Playlist>> {
    return this.apiService.getPaginated<Playlist>(this.endpoint, filters);
  }

  /**
   * Obtener una playlist por ID
   */
  getPlaylistById(id: string): Observable<Playlist> {
    return this.apiService.get<Playlist>(`${this.endpoint}/${id}`);
  }

  /**
   * Obtener playlists del usuario actual
   */
  getUserPlaylists(userId?: string): Observable<Playlist[]> {
    const endpoint = userId ? `${this.endpoint}/user/${userId}` : `${this.endpoint}/my-playlists`;
    return this.apiService.get<Playlist[]>(endpoint);
  }

  /**
   * Crear una nueva playlist
   */
  createPlaylist(playlistData: CreatePlaylistDto): Observable<Playlist> {
    return this.apiService.post<Playlist>(this.endpoint, playlistData);
  }

  /**
   * Actualizar una playlist
   */
  updatePlaylist(id: string, playlistData: UpdatePlaylistDto): Observable<Playlist> {
    return this.apiService.put<Playlist>(`${this.endpoint}/${id}`, playlistData);
  }

  /**
   * Eliminar una playlist
   */
  deletePlaylist(id: string): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  /**
   * Agregar una canción a la playlist
   */
  addSongToPlaylist(playlistId: string, songData: AddSongToPlaylistDto): Observable<void> {
    return this.apiService.post<void>(`${this.endpoint}/${playlistId}/songs`, songData);
  }

  /**
   * Remover una canción de la playlist
   */
  removeSongFromPlaylist(playlistId: string, songId: string): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${playlistId}/songs/${songId}`);
  }

  /**
   * Obtener canciones de una playlist
   */
  getPlaylistSongs(playlistId: string): Observable<Song[]> {
    return this.apiService.get<Song[]>(`${this.endpoint}/${playlistId}/songs`);
  }

  /**
   * Reordenar canciones en una playlist
   */
  reorderPlaylistSongs(playlistId: string, songOrders: { songId: string; order: number }[]): Observable<void> {
    return this.apiService.patch<void>(`${this.endpoint}/${playlistId}/reorder`, { songOrders });
  }

  /**
   * Subir imagen de portada para la playlist
   */
  uploadPlaylistCover(playlistId: string, file: File): Observable<Playlist> {
    return this.apiService.upload<Playlist>(`${this.endpoint}/${playlistId}/cover`, file);
  }

  /**
   * Seguir/dejar de seguir una playlist pública
   */
  followPlaylist(playlistId: string): Observable<void> {
    return this.apiService.post<void>(`${this.endpoint}/${playlistId}/follow`, {});
  }

  unfollowPlaylist(playlistId: string): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${playlistId}/follow`);
  }

  /**
   * Obtener playlists seguidas por el usuario
   */
  getFollowedPlaylists(): Observable<Playlist[]> {
    return this.apiService.get<Playlist[]>(`${this.endpoint}/followed`);
  }

  /**
   * Duplicar una playlist
   */
  duplicatePlaylist(playlistId: string, newName?: string): Observable<Playlist> {
    return this.apiService.post<Playlist>(`${this.endpoint}/${playlistId}/duplicate`, { name: newName });
  }

  /**
   * Buscar playlists públicas
   */
  searchPlaylists(query: string, limit?: number, offset?: number): Observable<PaginatedResponse<Playlist>> {
    return this.apiService.getPaginated<Playlist>(`${this.endpoint}/search`, { 
      query, 
      limit: limit || 20, 
      offset: offset || 0 
    });
  }
}
