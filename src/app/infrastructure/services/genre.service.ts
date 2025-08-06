import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { API_CONFIG_GENRES } from '../../config/end-points/api-config-genres';
import { GenreDto, GenreSearchParams } from '../../domain/dtos/genre.dto';
import { Genre } from '../../domain/entities/genre.entity';
import { GenreMapper } from '../../domain/mappers/genre.mapper';
import { PaginatedResponse } from '../../shared/interfaces/paginated-response.interface';

@Injectable({
  providedIn: 'root'
})
export class GenreService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getGenreById(id: string): Observable<Genre> {
    return this.http.get<GenreDto>(`${this.baseUrl}${API_CONFIG_GENRES.genres.getById(id)}`)
      .pipe(
        map(dto => GenreMapper.mapGenreDtoToEntity(dto))
      );
  }

  getAllGenres(params?: GenreSearchParams): Observable<PaginatedResponse<GenreDto>> {
    let httpParams = new HttpParams();
    
    if (params?.name) {
      httpParams = httpParams.set('name', params.name);
    }
    
    if (params?.search) {
      httpParams = httpParams.set('search', params.search);
    }
    
    // Agregar paginación
    if (params?.page) {
      httpParams = httpParams.set('page', params.page.toString());
    }
    
    if (params?.page_size) {
      httpParams = httpParams.set('page_size', params.page_size.toString());
    }

    return this.http.get<PaginatedResponse<GenreDto>>(`${this.baseUrl}${API_CONFIG_GENRES.genres.list}`, { params: httpParams });
  }

  getPopularGenres(page: number = 1, pageSize: number = 10): Observable<PaginatedResponse<GenreDto>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString());

    return this.http.get<PaginatedResponse<GenreDto>>(`${this.baseUrl}${API_CONFIG_GENRES.genres.popular}`, { params });
  }
}
