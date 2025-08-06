// DEPRECATED: Use MyPlaylistsHttpService and PublicPlaylistsHttpService instead

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, catchError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_CONFIG_PLAYLISTS } from '../../config/end-points/api-config-playlists';
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
import {
  PlaylistDto,
  PlaylistWithSongsDto,
  PlaylistSongDto,
  PaginatedPlaylistSongResponseDto
} from '../../domain/dtos/playlist.dto';
import { PlaylistMapper } from '../../domain/mappers/playlist.mapper';
import { IPlaylistRepository } from '../../domain/repositories/i-playlist.repository';

/**
 * @deprecated Use MyPlaylistsHttpService and PublicPlaylistsHttpService instead
 * This service is kept for backward compatibility
 */
@Injectable({
  providedIn: 'root'
})
export class PlaylistHttpService implements IPlaylistRepository {
  private readonly baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  // CRUD operations for playlists - Default to myPlaylists for backward compatibility
  getPlaylists(filters?: PlaylistFilters): Observable<PaginatedPlaylistResponse> {
    let params = new HttpParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get<PlaylistDto[]>( // Cambiar a array directo
      `${this.baseUrl}${API_CONFIG_PLAYLISTS.myPlaylists.list}`,
      { params }
    ).pipe(
      map(response => {
        console.log('Raw API response for user playlists:', response);
        // Crear una respuesta paginada mock ya que la API devuelve array directo
        const paginatedResponse: PaginatedPlaylistResponse = {
          count: response.length,
          next: null,
          previous: null,
          results: response.map(PlaylistMapper.dtoToEntity)
        };
        return paginatedResponse;
      }),
      catchError((error: any) => {
        console.error('Error en getUserPlaylists:', error);
        if (error.status === 500) {
          throw new Error('Error del servidor al obtener playlists. Verifica que el backend esté funcionando correctamente.');
        }
        throw error;
      })
    );
  }

  getPlaylist(id: string): Observable<PlaylistWithSongs> {
    return this.http.get<PlaylistWithSongsDto>(
      `${this.baseUrl}${API_CONFIG_PLAYLISTS.myPlaylists.getById(id)}`
    ).pipe(
      map(response => PlaylistMapper.withSongsDtoToEntity(response))
    );
  }

  createPlaylist(playlist: CreatePlaylistDto): Observable<Playlist> {
    const requestDto = PlaylistMapper.toCreatePlaylistRequestDto(playlist);
    
    return this.http.post<PlaylistDto>(
      `${this.baseUrl}${API_CONFIG_PLAYLISTS.myPlaylists.create}`,
      requestDto
    ).pipe(
      map(response => PlaylistMapper.dtoToEntity(response))
    );
  }

  updatePlaylist(id: string, playlist: UpdatePlaylistDto): Observable<Playlist> {
    const requestDto = PlaylistMapper.toUpdatePlaylistRequestDto(playlist);
    
    return this.http.put<PlaylistDto>(
      `${this.baseUrl}${API_CONFIG_PLAYLISTS.myPlaylists.update(id)}`,
      requestDto
    ).pipe(
      map(response => PlaylistMapper.dtoToEntity(response))
    );
  }

  deletePlaylist(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}${API_CONFIG_PLAYLISTS.myPlaylists.delete(id)}`
    );
  }

  // Playlist songs operations
  getPlaylistSongs(playlistId: string, page?: number, pageSize?: number): Observable<PaginatedPlaylistSongResponse> {
    let params = new HttpParams();
    
    if (page !== undefined) {
      params = params.set('page', page.toString());
    }
    if (pageSize !== undefined) {
      params = params.set('page_size', pageSize.toString());
    }

    return this.http.get<PaginatedPlaylistSongResponseDto>(
      `${this.baseUrl}${API_CONFIG_PLAYLISTS.myPlaylists.songs.list(playlistId)}`,
      { params }
    ).pipe(
      map(response => PlaylistMapper.fromPaginatedSongDto(response))
    );
  }

  addSongToPlaylist(playlistId: string, song: AddSongToPlaylistDto): Observable<PlaylistSong> {
    const requestDto = PlaylistMapper.toAddSongToPlaylistRequestDto(song);
    
    return this.http.post<PlaylistSongDto>(
      `${this.baseUrl}${API_CONFIG_PLAYLISTS.myPlaylists.songs.add(playlistId)}`,
      requestDto
    ).pipe(
      map(response => PlaylistMapper.songDtoToEntity(response))
    );
  }

  removeSongFromPlaylist(playlistId: string, songId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}${API_CONFIG_PLAYLISTS.myPlaylists.songs.remove(playlistId, songId)}`
    );
  }

  // User-specific operations
  getUserPlaylists(filters?: PlaylistFilters): Observable<PaginatedPlaylistResponse> {
    return this.getPlaylists(filters);
  }

  getUserPlaylist(id: string): Observable<PlaylistWithSongs> {
    return this.getPlaylist(id);
  }
}
