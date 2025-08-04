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
   * Get a specific song by ID
   * GET /api/songs/{id}/
   */
  getSongById(songId: string): Observable<SongDto> {
    return this.http.get<SongDto>(`${this.baseUrl}/${songId}/`);
  }

  /**
   * Increment play count for a song
   * POST /api/songs/{id}/increment-play-count/
   */
  incrementPlayCount(songId: string): Observable<PlayCountResponseDto> {
    return this.http.post<PlayCountResponseDto>(
      `${this.baseUrl}/${songId}/increment-play-count/`,
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
   * Search songs
   * GET /api/songs/search/
   */
  searchSongs(searchParams: SongSearchParams): Observable<PaginatedResponse<SongListDto>> {
    let params = new HttpParams();
    
    if (searchParams.q) {
      params = params.set('q', searchParams.q);
    }
    if (searchParams.include_youtube !== undefined) {
      params = params.set('include_youtube', searchParams.include_youtube.toString());
    }
    if (searchParams.limit) {
      params = params.set('limit', searchParams.limit.toString());
    }

    return this.http.get<PaginatedResponse<SongListDto>>(`${this.baseUrl}/search/`, { params });
  }
}
