import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_CONFIG_SONGS } from '../../config/end-points/api-config-songs';
import { 
  SongDto, 
  SongListDto, 
  SongSearchParams,
  PlayCountResponseDto,
  PaginatedResponse
} from '../../domain/dtos/song.dto';

@Injectable({
  providedIn: 'root'
})
export class SongService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  /**
   * Get a specific song by ID using the ViewSet
   * GET /api/songs/list/{id}/
   */
  getSongById(songId: string): Observable<SongDto> {
    return this.http.get<SongDto>(`${this.baseUrl}${API_CONFIG_SONGS.songs.getById(songId)}`);
  }

  /**
   * Increment play count for a song
   * POST /api/songs/api/{id}/increment-play-count/
   */
  incrementPlayCount(songId: string): Observable<PlayCountResponseDto> {
    return this.http.post<PlayCountResponseDto>(
      `${this.baseUrl}${API_CONFIG_SONGS.songs.incrementPlayCount(songId)}`,
      {}
    );
  }

  /**
   * Get most popular songs
   * GET /api/songs/most-popular/
   */
  getMostPopular(page = 1, pageSize = 10): Observable<PaginatedResponse<SongListDto>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString());

    return this.http.get<PaginatedResponse<SongListDto>>(`${this.baseUrl}${API_CONFIG_SONGS.songs.mostPopular}`, { params });
  }

  /**
   * Get random songs
   * GET /api/songs/random/
   */
  getRandomSongs(page = 1, pageSize = 10): Observable<PaginatedResponse<SongListDto>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString());

    return this.http.get<PaginatedResponse<SongListDto>>(`${this.baseUrl}${API_CONFIG_SONGS.songs.random}`, { params });
  }

  /**
   * Search songs with comprehensive filters
   * GET /api/songs/list/
   */
  searchSongs(searchParams: SongSearchParams): Observable<PaginatedResponse<SongListDto>> {
    const params = this.buildSearchParams(searchParams);
    return this.http.get<PaginatedResponse<SongListDto>>(`${this.baseUrl}${API_CONFIG_SONGS.songs.list}`, { params });
  }

  /**
   * Get lyrics for a song
   * GET /api/songs/{id}/lyrics/
   */
  getLyrics(songId: string): Observable<{ lyrics: string }> {
    return this.http.get<{ lyrics: string }>(`${this.baseUrl}${API_CONFIG_SONGS.songs.getLyrics(songId)}`);
  }

  private buildSearchParams(searchParams: SongSearchParams): HttpParams {
    let params = new HttpParams();
    
    // Búsqueda general
    params = this.addSearchParam(params, 'search', searchParams.search);
    params = this.addSearchParam(params, 'title', searchParams.title);
    
    // Filtros de artista/álbum/género
    params = this.addSearchParam(params, 'artist_name', searchParams.artist_name);
    params = this.addSearchParam(params, 'artist_id', searchParams.artist_id);
    params = this.addSearchParam(params, 'album_title', searchParams.album_title);
    params = this.addSearchParam(params, 'album_id', searchParams.album_id);
    params = this.addSearchParam(params, 'genre_name', searchParams.genre_name);
    
    // Filtros de contenido
    params = this.addSearchParam(params, 'source_type', searchParams.source_type);
    params = this.addSearchParam(params, 'audio_quality', searchParams.audio_quality);
    
    // Rangos de duración
    params = this.addNumberParam(params, 'min_duration', searchParams.min_duration);
    params = this.addNumberParam(params, 'max_duration', searchParams.max_duration);
    params = this.addSearchParam(params, 'duration_range', searchParams.duration_range);
    
    // Rangos de conteos
    params = this.addNumberParam(params, 'min_play_count', searchParams.min_play_count);
    params = this.addNumberParam(params, 'max_play_count', searchParams.max_play_count);
    params = this.addNumberParam(params, 'min_favorite_count', searchParams.min_favorite_count);
    params = this.addNumberParam(params, 'max_favorite_count', searchParams.max_favorite_count);
    params = this.addNumberParam(params, 'min_download_count', searchParams.min_download_count);
    params = this.addNumberParam(params, 'max_download_count', searchParams.max_download_count);
    
    // Filtros booleanos
    params = this.addBooleanParam(params, 'has_lyrics', searchParams.has_lyrics);
    params = this.addBooleanParam(params, 'has_file_url', searchParams.has_file_url);
    params = this.addBooleanParam(params, 'has_thumbnail', searchParams.has_thumbnail);
    params = this.addBooleanParam(params, 'popular', searchParams.popular);
    params = this.addBooleanParam(params, 'recent', searchParams.recent);
    params = this.addBooleanParam(params, 'trending', searchParams.trending);
    
    // Filtros de fecha
    params = this.addSearchParam(params, 'created_after', searchParams.created_after);
    params = this.addSearchParam(params, 'created_before', searchParams.created_before);
    params = this.addSearchParam(params, 'last_played_after', searchParams.last_played_after);
    params = this.addSearchParam(params, 'last_played_before', searchParams.last_played_before);
    params = this.addSearchParam(params, 'release_after', searchParams.release_after);
    params = this.addSearchParam(params, 'release_before', searchParams.release_before);
    
    // YouTube y configuración especial
    params = this.addBooleanParam(params, 'include_youtube', searchParams.include_youtube);
    params = this.addNumberParam(params, 'min_results', searchParams.min_results);
    
    // Ordenamiento y paginación
    params = this.addSearchParam(params, 'ordering', searchParams.ordering);
    params = this.addNumberParam(params, 'page', searchParams.page);
    params = this.addNumberParam(params, 'page_size', searchParams.page_size);

    return params;
  }

  private addSearchParam(params: HttpParams, key: string, value: string | undefined): HttpParams {
    return value ? params.set(key, value) : params;
  }

  private addNumberParam(params: HttpParams, key: string, value: number | undefined): HttpParams {
    return value !== undefined ? params.set(key, value.toString()) : params;
  }

  private addBooleanParam(params: HttpParams, key: string, value: boolean | undefined): HttpParams {
    return value !== undefined ? params.set(key, value.toString()) : params;
  }
}
