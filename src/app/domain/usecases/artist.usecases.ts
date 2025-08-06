import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ArtistService } from '../../infrastructure/services/artist.service';
import { Artist, ArtistListItem } from '../../domain/entities/artist.entity';
import { ArtistSearchParams, ArtistDto } from '../../domain/dtos/artist.dto';
import { ArtistMapper } from '../mappers/artist.mapper';
import { PaginatedResponse } from '../../shared/interfaces/paginated-response.interface';

@Injectable({
  providedIn: 'root'
})
export class GetArtistByIdUseCase {
  constructor(private readonly artistService: ArtistService) {}

  execute(id: string): Observable<Artist> {
    return this.artistService.getArtistById(id);
  }
}

@Injectable({
  providedIn: 'root'
})
export class GetAllArtistsUseCase {
  constructor(private readonly artistService: ArtistService) {}

  execute(params?: ArtistSearchParams): Observable<ArtistListItem[]> {
    return this.artistService.getAllArtists(params).pipe(
      map((response: PaginatedResponse<ArtistDto>) => 
        ArtistMapper.mapArtistDtoListToListItem(response.results)
      )
    );
  }
}

@Injectable({
  providedIn: 'root'
})
export class GetPopularArtistsUseCase {
  constructor(private readonly artistService: ArtistService) {}

  execute(params?: { limit?: number }): Observable<ArtistListItem[]> {
    const searchParams: ArtistSearchParams = {
      popular: true,
      page_size: params?.limit || 10,
      ordering: '-followers_count'
    };
    
    return this.artistService.getAllArtists(searchParams).pipe(
      map((response: PaginatedResponse<ArtistDto>) => 
        ArtistMapper.mapArtistDtoListToListItem(response.results)
      )
    );
  }
}
