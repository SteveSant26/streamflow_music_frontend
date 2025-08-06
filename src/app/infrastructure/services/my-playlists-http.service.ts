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
  PaginatedPlaylistSongResponse
} from '../../domain/entities/playlist.entity';
import {
  PlaylistDto,
  PlaylistWithSongsDto,
  PlaylistSongDto,
  PaginatedPlaylistResponseDto,
  PaginatedPlaylistSongResponseDto,
  MyPlaylistsQueryParamsDto
} from '../../domain/dtos/playlist.dto';
import { PlaylistMapper } from '../../domain/mappers/playlist.mapper';

@Injectable({
  providedIn: 'root'
})
export class MyPlaylistsHttpService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  // Obtener MIS playlists
  getMyPlaylists(params?: MyPlaylistsQueryParamsDto): Observable<PaginatedPlaylistResponse> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this.http.get<PaginatedPlaylistResponseDto>(
      `${this.baseUrl}${API_CONFIG_PLAYLISTS.myPlaylists.list}`,
      { params: httpParams }
    ).pipe(
      map(response => PlaylistMapper.fromPaginatedPlaylistResponseDto(response))
    );
  }

  // Obtener una de MIS playlists por ID
  getMyPlaylistById(id: string): Observable<PlaylistWithSongs> {
    return this.http.get<PlaylistWithSongsDto>(
      `${this.baseUrl}${API_CONFIG_PLAYLISTS.myPlaylists.getById(id)}`
    ).pipe(
      map(dto => PlaylistMapper.fromPlaylistWithSongsDto(dto))
    );
  }

  // Crear nueva playlist (siempre es mía)
  createPlaylist(createDto: CreatePlaylistDto): Observable<Playlist> {
    const requestDto = PlaylistMapper.toCreatePlaylistRequestDto(createDto);
    
    return this.http.post<PlaylistDto>(
      `${this.baseUrl}${API_CONFIG_PLAYLISTS.myPlaylists.create}`,
      requestDto
    ).pipe(
      map(dto => PlaylistMapper.fromPlaylistDto(dto))
    );
  }

  // Actualizar MI playlist
  updatePlaylist(id: string, updateDto: UpdatePlaylistDto): Observable<Playlist> {
    const requestDto = PlaylistMapper.toUpdatePlaylistRequestDto(updateDto);
    
    return this.http.put<PlaylistDto>(
      `${this.baseUrl}${API_CONFIG_PLAYLISTS.myPlaylists.update(id)}`,
      requestDto
    ).pipe(
      map(dto => PlaylistMapper.fromPlaylistDto(dto))
    );
  }

  // Eliminar MI playlist
  deletePlaylist(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}${API_CONFIG_PLAYLISTS.myPlaylists.delete(id)}`
    );
  }

  // Obtener canciones de MI playlist
  getPlaylistSongs(playlistId: string, params?: { page?: number; page_size?: number; search?: string }): Observable<PaginatedPlaylistSongResponse> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this.http.get<PaginatedPlaylistSongResponseDto>(
      `${this.baseUrl}${API_CONFIG_PLAYLISTS.myPlaylists.songs.list(playlistId)}`,
      { params: httpParams }
    ).pipe(
      map(response => PlaylistMapper.fromPaginatedPlaylistSongResponseDto(response))
    );
  }

  // Agregar canción a MI playlist
  addSongToPlaylist(playlistId: string, addSongDto: AddSongToPlaylistDto): Observable<PlaylistSong> {
    const requestDto = PlaylistMapper.toAddSongToPlaylistRequestDto(addSongDto);
    
    return this.http.post<PlaylistSongDto>(
      `${this.baseUrl}${API_CONFIG_PLAYLISTS.myPlaylists.songs.add(playlistId)}`,
      requestDto
    ).pipe(
      map(dto => PlaylistMapper.fromPlaylistSongDto(dto))
    );
  }

  // Remover canción de MI playlist
  removeSongFromPlaylist(playlistId: string, songId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}${API_CONFIG_PLAYLISTS.myPlaylists.songs.remove(playlistId, songId)}`
    );
  }
}
