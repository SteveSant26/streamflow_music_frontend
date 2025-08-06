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
    
    if (params?.has_color !== undefined) {
      httpParams = httpParams.set('has_color', params.has_color.toString());
    }
    
    if (params?.has_description !== undefined) {
      httpParams = httpParams.set('has_description', params.has_description.toString());
    }
    
    if (params?.has_image !== undefined) {
      httpParams = httpParams.set('has_image', params.has_image.toString());
    }
    
    if (params?.min_popularity_score) {
      httpParams = httpParams.set('min_popularity_score', params.min_popularity_score.toString());
    }
    
    if (params?.max_popularity_score) {
      httpParams = httpParams.set('max_popularity_score', params.max_popularity_score.toString());
    }
    
    if (params?.created_after) {
      httpParams = httpParams.set('created_after', params.created_after);
    }
    
    if (params?.created_before) {
      httpParams = httpParams.set('created_before', params.created_before);
    }
    
    if (params?.ordering) {
      httpParams = httpParams.set('ordering', params.ordering);
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

  getPopularGenres(page = 1, pageSize = 10): Observable<PaginatedResponse<GenreDto>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString());

    return this.http.get<PaginatedResponse<GenreDto>>(`${this.baseUrl}${API_CONFIG_GENRES.genres.popular}`, { params });
  }
}
