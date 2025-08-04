import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { GenreDto, PopularGenresParams } from '../../domain/dtos/genre.dto';
import { Genre, GenreListItem } from '../../domain/entities/genre.entity';
import { GenreMapper } from '../../domain/mappers/genre.mapper';
import { PaginatedResponse } from '../../shared/interfaces/paginated-response.interface';

@Injectable({
  providedIn: 'root'
})
export class GenreService {
  private readonly apiUrl = `${environment.apiUrl}/api/genres`;

  constructor(private http: HttpClient) {}

  getGenreById(id: string): Observable<Genre> {
    return this.http.get<GenreDto>(`${this.apiUrl}/${id}/`)
      .pipe(
        map(dto => GenreMapper.mapGenreDtoToEntity(dto))
      );
  }

  getAllGenres(): Observable<GenreListItem[]> {
    return this.http.get<PaginatedResponse<GenreDto>>(`${this.apiUrl}/`)
      .pipe(
        map(response => GenreMapper.mapGenreListToGenres(response.results))
      );
  }

  getPopularGenres(params?: PopularGenresParams): Observable<GenreListItem[]> {
    let httpParams = new HttpParams();
    
    if (params?.limit) {
      httpParams = httpParams.set('limit', params.limit.toString());
    }

    return this.http.get<PaginatedResponse<GenreDto>>(`${this.apiUrl}/popular/`, { params: httpParams })
      .pipe(
        map(response => GenreMapper.mapGenreListToGenres(response.results))
      );
  }
}
