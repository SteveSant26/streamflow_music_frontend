import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
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
  PaginatedPlaylistResponseDto,
  PaginatedPlaylistSongResponseDto
} from '../../domain/dtos/playlist.dto';
import { PlaylistMapper } from '../../domain/mappers/playlist.mapper';
import { IPlaylistRepository } from '../../domain/repositories/i-playlist.repository';

@Injectable({
  providedIn: 'root'
})
export class PlaylistHttpService implements IPlaylistRepository {
  private readonly baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  // CRUD operations for playlists
  getPlaylists(filters?: PlaylistFilters): Observable<PaginatedPlaylistResponse> {
    let params = new HttpParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get<PaginatedPlaylistResponseDto>(
      `${this.baseUrl}${API_CONFIG_PLAYLISTS.playlists.list}`,
      { params }
    ).pipe(
      map(response => PlaylistMapper.paginatedDtoToEntity(response))
    );
  }

  getPlaylist(id: string): Observable<PlaylistWithSongs> {
    return this.http.get<PlaylistWithSongsDto>(
      `${this.baseUrl}${API_CONFIG_PLAYLISTS.playlists.getById(id)}`
    ).pipe(
      map(response => PlaylistMapper.withSongsDtoToEntity(response))
    );
  }

  createPlaylist(playlist: CreatePlaylistDto): Observable<Playlist> {
    const requestDto = PlaylistMapper.createDtoFromEntity(playlist);
    
    return this.http.post<PlaylistDto>(
      `${this.baseUrl}${API_CONFIG_PLAYLISTS.playlists.create}`,
      requestDto
    ).pipe(
      map(response => PlaylistMapper.dtoToEntity(response))
    );
  }

  updatePlaylist(id: string, playlist: UpdatePlaylistDto): Observable<Playlist> {
    const requestDto = PlaylistMapper.updateDtoFromEntity(playlist);
    
    return this.http.put<PlaylistDto>(
      `${this.baseUrl}${API_CONFIG_PLAYLISTS.playlists.update(id)}`,
      requestDto
    ).pipe(
      map(response => PlaylistMapper.dtoToEntity(response))
    );
  }

  deletePlaylist(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}${API_CONFIG_PLAYLISTS.playlists.delete(id)}`
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
      `${this.baseUrl}${API_CONFIG_PLAYLISTS.playlists.songs.list(playlistId)}`,
      { params }
    ).pipe(
      map(response => PlaylistMapper.paginatedSongDtoToEntity(response))
    );
  }

  addSongToPlaylist(playlistId: string, song: AddSongToPlaylistDto): Observable<PlaylistSong> {
    const requestDto = PlaylistMapper.addSongDtoFromEntity(song);
    
    return this.http.post<PlaylistSongDto>(
      `${this.baseUrl}${API_CONFIG_PLAYLISTS.playlists.songs.add(playlistId)}`,
      requestDto
    ).pipe(
      map(response => PlaylistMapper.songDtoToEntity(response))
    );
  }

  removeSongFromPlaylist(playlistId: string, songId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}${API_CONFIG_PLAYLISTS.playlists.songs.remove(playlistId, songId)}`
    );
  }

  // User-specific operations
  getUserPlaylists(filters?: PlaylistFilters): Observable<PaginatedPlaylistResponse> {
    // Para obtener solo las playlists del usuario, añadimos el filtro por defecto
    const userFilters = { ...filters };
    // Si hay autenticación, el backend debería filtrar automáticamente por usuario
    
    return this.getPlaylists(userFilters);
  }

  getUserPlaylist(id: string): Observable<PlaylistWithSongs> {
    // Similar a getPlaylist, pero el backend debería verificar que pertenece al usuario autenticado
    return this.getPlaylist(id);
  }
}
