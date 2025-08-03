import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiGetUseCase, ApiPostUseCase } from '../../domain/usecases/api/api.usecase';
import { API_CONFIG_SONGS } from '../../config/end-points/api-config-songs';
import { 
  SongDto, 
  SongSearchDto, 
  ProcessYoutubeDto, 
  PaginationParams, 
  SongSearchParams 
} from '../../domain/dtos/song.dto';

@Injectable({
  providedIn: 'root'
})
export class SongService {
  private readonly apiGetUseCase = inject(ApiGetUseCase);
  private readonly apiPostUseCase = inject(ApiPostUseCase);

  /**
   * Obtener las canciones más populares
   */
  getMostPopular(params?: PaginationParams): Observable<SongSearchDto[]> {
    const queryParams: Record<string, string> = {};
    if (params?.page) queryParams['page'] = params.page.toString();
    if (params?.page_size) queryParams['page_size'] = params.page_size.toString();
    
    return this.apiGetUseCase.execute<SongSearchDto[]>(
      API_CONFIG_SONGS.songs.mostPopular,
      queryParams
    );
  }

  /**
   * Procesar video de YouTube
   */
  processYoutubeVideo(videoId: string): Observable<SongDto> {
    const data: ProcessYoutubeDto = { video_id: videoId };
    return this.apiPostUseCase.execute<SongDto>(
      API_CONFIG_SONGS.songs.processYoutube,
      data
    );
  }

  /**
   * Obtener canciones aleatorias
   */
  getRandomSongs(params?: PaginationParams): Observable<SongSearchDto[]> {
    const queryParams: Record<string, string> = {};
    if (params?.page) queryParams['page'] = params.page.toString();
    if (params?.page_size) queryParams['page_size'] = params.page_size.toString();
    
    return this.apiGetUseCase.execute<SongSearchDto[]>(
      API_CONFIG_SONGS.songs.random,
      queryParams
    );
  }

  /**
   * Buscar canciones
   */
  searchSongs(searchParams: SongSearchParams): Observable<SongSearchDto[]> {
    const queryParams: Record<string, string> = {
      q: searchParams.q
    };
    
    if (searchParams.include_youtube !== undefined) {
      queryParams['include_youtube'] = searchParams.include_youtube.toString();
    }
    if (searchParams.limit) {
      queryParams['limit'] = searchParams.limit.toString();
    }
    
    return this.apiGetUseCase.execute<SongSearchDto[]>(
      API_CONFIG_SONGS.songs.search,
      queryParams
    );
  }
}
