import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GenreService } from '../../infrastructure/services/genre.service';
import { Genre, GenreListItem } from '../../domain/entities/genre.entity';
import { PopularGenresParams } from '../../domain/dtos/genre.dto';

@Injectable({
  providedIn: 'root'
})
export class GetGenreByIdUseCase {
  constructor(private genreService: GenreService) {}

  execute(id: string): Observable<Genre> {
    return this.genreService.getGenreById(id);
  }
}

@Injectable({
  providedIn: 'root'
})
export class GetAllGenresUseCase {
  constructor(private genreService: GenreService) {}

  execute(): Observable<GenreListItem[]> {
    return this.genreService.getAllGenres();
  }
}

@Injectable({
  providedIn: 'root'
})
export class GetPopularGenresUseCase {
  constructor(private genreService: GenreService) {}

  execute(params?: PopularGenresParams): Observable<GenreListItem[]> {
    return this.genreService.getPopularGenres(params);
  }
}
