import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
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
  private readonly baseUrl = `${environment.apiUrl}/api/songs`;

  constructor(private readonly http: HttpClient) {}

  /**
   * Get a specific song by ID using the ViewSet
   * GET /api/songs/list/{id}/
   */
  getSongById(songId: string): Observable<SongDto> {
    return this.http.get<SongDto>(`${this.baseUrl}/list/${songId}/`);
  }

  /**
   * Increment play count for a song
   * POST /api/songs/api/{id}/increment-play-count/
   */
  incrementPlayCount(songId: string): Observable<PlayCountResponseDto> {
    return this.http.post<PlayCountResponseDto>(
      `${this.baseUrl}/api/${songId}/increment-play-count/`,
      {}
    );
  }

  /**
   * Get most popular songs
   * GET /api/songs/most-popular/
   */
  getMostPopular(page: number = 1, pageSize: number = 10): Observable<PaginatedResponse<SongListDto>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString());

    return this.http.get<PaginatedResponse<SongListDto>>(`${this.baseUrl}/most-popular/`, { params });
  }

  /**
   * Get random songs
   * GET /api/songs/random/
   */
  getRandomSongs(page: number = 1, pageSize: number = 10): Observable<PaginatedResponse<SongListDto>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString());

    return this.http.get<PaginatedResponse<SongListDto>>(`${this.baseUrl}/random/`, { params });
  }

  /**
   * Search songs with comprehensive filters
   * GET /api/songs/list/
   */
  searchSongs(searchParams: SongSearchParams): Observable<PaginatedResponse<SongListDto>> {
    let params = new HttpParams();
    
    // Búsqueda general
    if (searchParams.search) {
      params = params.set('search', searchParams.search);
    }
    if (searchParams.title) {
      params = params.set('title', searchParams.title);
    }
    
    // Filtros de artista/álbum
    if (searchParams.artist_name) {
      params = params.set('artist_name', searchParams.artist_name);
    }
    if (searchParams.artist_id) {
      params = params.set('artist_id', searchParams.artist_id);
    }
    if (searchParams.album_title) {
      params = params.set('album_title', searchParams.album_title);
    }
    if (searchParams.album_id) {
      params = params.set('album_id', searchParams.album_id);
    }
    if (searchParams.genre_name) {
      params = params.set('genre_name', searchParams.genre_name);
    }
    
    // Filtros de contenido
    if (searchParams.source_type) {
      params = params.set('source_type', searchParams.source_type);
    }
    if (searchParams.audio_quality) {
      params = params.set('audio_quality', searchParams.audio_quality);
    }
    
    // Rangos de duración
    if (searchParams.min_duration !== undefined) {
      params = params.set('min_duration', searchParams.min_duration.toString());
    }
    if (searchParams.max_duration !== undefined) {
      params = params.set('max_duration', searchParams.max_duration.toString());
    }
    if (searchParams.duration_range) {
      params = params.set('duration_range', searchParams.duration_range);
    }
    
    // Rangos de conteos
    if (searchParams.min_play_count !== undefined) {
      params = params.set('min_play_count', searchParams.min_play_count.toString());
    }
    if (searchParams.max_play_count !== undefined) {
      params = params.set('max_play_count', searchParams.max_play_count.toString());
    }
    if (searchParams.min_favorite_count !== undefined) {
      params = params.set('min_favorite_count', searchParams.min_favorite_count.toString());
    }
    if (searchParams.max_favorite_count !== undefined) {
      params = params.set('max_favorite_count', searchParams.max_favorite_count.toString());
    }
    if (searchParams.min_download_count !== undefined) {
      params = params.set('min_download_count', searchParams.min_download_count.toString());
    }
    if (searchParams.max_download_count !== undefined) {
      params = params.set('max_download_count', searchParams.max_download_count.toString());
    }
    
    // Filtros booleanos
    if (searchParams.has_lyrics !== undefined) {
      params = params.set('has_lyrics', searchParams.has_lyrics.toString());
    }
    if (searchParams.has_file_url !== undefined) {
      params = params.set('has_file_url', searchParams.has_file_url.toString());
    }
    if (searchParams.has_thumbnail !== undefined) {
      params = params.set('has_thumbnail', searchParams.has_thumbnail.toString());
    }
    if (searchParams.popular !== undefined) {
      params = params.set('popular', searchParams.popular.toString());
    }
    if (searchParams.recent !== undefined) {
      params = params.set('recent', searchParams.recent.toString());
    }
    if (searchParams.trending !== undefined) {
      params = params.set('trending', searchParams.trending.toString());
    }
    
    // Filtros de fecha
    if (searchParams.created_after) {
      params = params.set('created_after', searchParams.created_after);
    }
    if (searchParams.created_before) {
      params = params.set('created_before', searchParams.created_before);
    }
    if (searchParams.last_played_after) {
      params = params.set('last_played_after', searchParams.last_played_after);
    }
    if (searchParams.last_played_before) {
      params = params.set('last_played_before', searchParams.last_played_before);
    }
    if (searchParams.release_after) {
      params = params.set('release_after', searchParams.release_after);
    }
    if (searchParams.release_before) {
      params = params.set('release_before', searchParams.release_before);
    }
    
    // YouTube y configuración especial
    if (searchParams.include_youtube !== undefined) {
      params = params.set('include_youtube', searchParams.include_youtube.toString());
    }
    if (searchParams.min_results !== undefined) {
      params = params.set('min_results', searchParams.min_results.toString());
    }
    
    // Ordenamiento
    if (searchParams.ordering) {
      params = params.set('ordering', searchParams.ordering);
    }
    
    // Paginación
    if (searchParams.page !== undefined) {
      params = params.set('page', searchParams.page.toString());
    }
    if (searchParams.page_size !== undefined) {
      params = params.set('page_size', searchParams.page_size.toString());
    }

    return this.http.get<PaginatedResponse<SongListDto>>(`${this.baseUrl}/list/`, { params });
  }
}
