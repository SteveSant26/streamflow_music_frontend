import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { GenreService } from '../../infrastructure/services/genre.service';
import { Genre, GenreListItem } from '../../domain/entities/genre.entity';
import { GenreSearchParams, GenreDto } from '../../domain/dtos/genre.dto';
import { GenreMapper } from '../mappers/genre.mapper';
import { PaginatedResponse } from '../../shared/interfaces/paginated-response.interface';

@Injectable({
  providedIn: 'root'
})
export class GetGenreByIdUseCase {
  constructor(private readonly genreService: GenreService) {}

  execute(id: string): Observable<Genre> {
    return this.genreService.getGenreById(id);
  }
}

@Injectable({
  providedIn: 'root'
})
export class GetAllGenresUseCase {
  constructor(private readonly genreService: GenreService) {}

  execute(params?: GenreSearchParams): Observable<GenreListItem[]> {
    return this.genreService.getAllGenres(params).pipe(
      map((response: PaginatedResponse<GenreDto>) => 
        GenreMapper.mapGenreListToGenres(response.results)
      )
    );
  }
}

@Injectable({
  providedIn: 'root'
})
export class GetPopularGenresUseCase {
  constructor(private readonly genreService: GenreService) {}

  execute(params?: { limit?: number }): Observable<GenreListItem[]> {
    const page = 1;
    const pageSize = params?.limit || 10;
    
    return this.genreService.getPopularGenres(page, pageSize).pipe(
      map((response: PaginatedResponse<GenreDto>) => 
        GenreMapper.mapGenreListToGenres(response.results)
      )
    );
  }
}
