import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_CONFIG_PLAYLISTS } from '../../config/end-points/api-config-playlists';
import {
  Playlist,
  PlaylistWithSongs,
  PlaylistSong,
  PaginatedPlaylistResponse,
  PaginatedPlaylistSongResponse
} from '../../domain/entities/playlist.entity';
import {
  PlaylistDto,
  PlaylistWithSongsDto,
  PlaylistSongDto,
  PaginatedPlaylistResponseDto,
  PaginatedPlaylistSongResponseDto,
  PublicPlaylistsQueryParamsDto
} from '../../domain/dtos/playlist.dto';
import { PlaylistMapper } from '../../domain/mappers/playlist.mapper';

@Injectable({
  providedIn: 'root'
})
export class PublicPlaylistsHttpService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  // Obtener playlists públicas
  getPublicPlaylists(params?: Omit<PublicPlaylistsQueryParamsDto, 'is_public'>): Observable<PaginatedPlaylistResponse> {
    let httpParams = new HttpParams().set('is_public', 'true'); // Siempre públicas
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this.http.get<PaginatedPlaylistResponseDto>(
      `${this.baseUrl}${API_CONFIG_PLAYLISTS.publicPlaylists.list}`,
      { params: httpParams }
    ).pipe(
      map(response => PlaylistMapper.fromPaginatedDto(response))
    );
  }

  // Obtener playlist pública por ID (solo lectura)
  getPublicPlaylistById(id: string): Observable<PlaylistWithSongs> {
    return this.http.get<PlaylistWithSongsDto>(
      `${this.baseUrl}${API_CONFIG_PLAYLISTS.publicPlaylists.getById(id)}`
    ).pipe(
      map(dto => PlaylistMapper.fromPlaylistWithSongsDto(dto))
    );
  }

  // Obtener canciones de playlist pública (solo lectura)
  getPublicPlaylistSongs(playlistId: string, params?: { page?: number; page_size?: number; search?: string }): Observable<PaginatedPlaylistSongResponse> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this.http.get<PaginatedPlaylistSongResponseDto>(
      `${this.baseUrl}${API_CONFIG_PLAYLISTS.publicPlaylists.songs.list(playlistId)}`,
      { params: httpParams }
    ).pipe(
      map(response => PlaylistMapper.fromPaginatedSongDto(response))
    );
  }

  // Buscar playlists públicas por término
  searchPublicPlaylists(searchTerm: string, params?: { page?: number; page_size?: number }): Observable<PaginatedPlaylistResponse> {
    let httpParams = new HttpParams()
      .set('is_public', 'true')
      .set('search', searchTerm);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this.http.get<PaginatedPlaylistResponseDto>(
      `${this.baseUrl}${API_CONFIG_PLAYLISTS.publicPlaylists.list}`,
      { params: httpParams }
    ).pipe(
      map(response => PlaylistMapper.fromPaginatedDto(response))
    );
  }

  // Obtener playlists populares (públicas con más canciones/reproducciones)
  getPopularPublicPlaylists(params?: { page?: number; page_size?: number }): Observable<PaginatedPlaylistResponse> {
    let httpParams = new HttpParams()
      .set('is_public', 'true')
      .set('ordering', '-total_songs,-created_at'); // Ordenar por más canciones primero
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this.http.get<PaginatedPlaylistResponseDto>(
      `${this.baseUrl}${API_CONFIG_PLAYLISTS.publicPlaylists.list}`,
      { params: httpParams }
    ).pipe(
      map(response => PlaylistMapper.fromPaginatedDto(response))
    );
  }
}
