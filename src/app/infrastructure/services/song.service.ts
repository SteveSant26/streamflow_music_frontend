import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiGetUseCase, ApiPostUseCase } from '../../domain/usecases/api/api.usecase';
import { API_CONFIG_SONGS } from '../../config/end-points/api-config-songs';
import { 
  SongDto, 
  SongSearchDto, 
  ProcessYoutubeDto, 
  PlayCountResponseDto,
  SongSearchParams,
  PaginationParams 
} from '../../domain/dtos/song.dto';

@Injectable({ providedIn: 'root' })
export class SongService {
  private readonly apiGetUseCase = inject(ApiGetUseCase);
  private readonly apiPostUseCase = inject(ApiPostUseCase);

  /**
   * Obtener detalles de una canción por ID
   */
  getSongById(songId: string): Observable<SongDto> {
    return this.apiGetUseCase.execute<SongDto>(
      API_CONFIG_SONGS.songs.getById(songId)
    );
  }

  /**
   * Incrementar contador de reproducciones
   */
  incrementPlayCount(songId: string): Observable<PlayCountResponseDto> {
    return this.apiPostUseCase.execute<PlayCountResponseDto>(
      API_CONFIG_SONGS.songs.incrementPlayCount(songId),
      {}
    );
  }

  /**
   * Obtener canciones más populares
   */
  getMostPopular(params?: PaginationParams): Observable<SongSearchDto[]> {
    return this.apiGetUseCase.execute<SongSearchDto[]>(
      API_CONFIG_SONGS.songs.mostPopular,
      params
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
    return this.apiGetUseCase.execute<SongSearchDto[]>(
      API_CONFIG_SONGS.songs.random,
      params
    );
  }

  /**
   * Buscar canciones
   */
  searchSongs(searchParams: SongSearchParams): Observable<SongSearchDto[]> {
    return this.apiGetUseCase.execute<SongSearchDto[]>(
      API_CONFIG_SONGS.songs.search,
      searchParams
    );
  }
}
