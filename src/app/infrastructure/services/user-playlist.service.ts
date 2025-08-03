import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiGetUseCase, ApiPostUseCase, ApiPutUseCase, ApiDeleteUseCase } from '../../domain/usecases/api/api.usecase';
import { 
  PlaylistDto, 
  CreatePlaylistDto, 
  UpdatePlaylistDto, 
  AddSongToPlaylistDto,
  PaginatedPlaylistResponse 
} from '../../domain/dtos/playlist.dto';

@Injectable({
  providedIn: 'root'
})
export class UserPlaylistService {
  private readonly apiGetUseCase = inject(ApiGetUseCase);
  private readonly apiPostUseCase = inject(ApiPostUseCase);
  private readonly apiPutUseCase = inject(ApiPutUseCase);
  private readonly apiDeleteUseCase = inject(ApiDeleteUseCase);

  private readonly baseUrl = '/api/playlists';

  /**
   * Obtener todas las playlists del usuario
   */
  getUserPlaylists(page?: number, pageSize?: number): Observable<PaginatedPlaylistResponse> {
    const queryParams: Record<string, string> = {};
    if (page) queryParams['page'] = page.toString();
    if (pageSize) queryParams['page_size'] = pageSize.toString();

    return this.apiGetUseCase.execute<PaginatedPlaylistResponse>(
      `${this.baseUrl}/`,
      queryParams
    );
  }

  /**
   * Obtener playlist por ID
   */
  getPlaylistById(id: string): Observable<PlaylistDto> {
    return this.apiGetUseCase.execute<PlaylistDto>(`${this.baseUrl}/${id}/`);
  }

  /**
   * Crear nueva playlist
   */
  createPlaylist(data: CreatePlaylistDto): Observable<PlaylistDto> {
    return this.apiPostUseCase.execute<PlaylistDto>(`${this.baseUrl}/`, data);
  }

  /**
   * Actualizar playlist
   */
  updatePlaylist(id: string, data: UpdatePlaylistDto): Observable<PlaylistDto> {
    return this.apiPutUseCase.execute<PlaylistDto>(`${this.baseUrl}/${id}/`, data);
  }

  /**
   * Eliminar playlist
   */
  deletePlaylist(id: string): Observable<void> {
    return this.apiDeleteUseCase.execute<void>(`${this.baseUrl}/${id}/`);
  }

  /**
   * Agregar canción a playlist
   */
  addSongToPlaylist(playlistId: string, data: AddSongToPlaylistDto): Observable<PlaylistDto> {
    return this.apiPostUseCase.execute<PlaylistDto>(
      `${this.baseUrl}/${playlistId}/add_song/`,
      data
    );
  }

  /**
   * Remover canción de playlist
   */
  removeSongFromPlaylist(playlistId: string, songId: string): Observable<PlaylistDto> {
    return this.apiDeleteUseCase.execute<PlaylistDto>(
      `${this.baseUrl}/${playlistId}/remove_song/${songId}/`
    );
  }

  /**
   * Obtener playlists públicas
   */
  getPublicPlaylists(page?: number, pageSize?: number): Observable<PaginatedPlaylistResponse> {
    const queryParams: Record<string, string> = { is_public: 'true' };
    if (page) queryParams['page'] = page.toString();
    if (pageSize) queryParams['page_size'] = pageSize.toString();

    return this.apiGetUseCase.execute<PaginatedPlaylistResponse>(
      `${this.baseUrl}/public/`,
      queryParams
    );
  }
}
