import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ArtistService } from '../../infrastructure/services/artist.service';
import { Artist, ArtistListItem } from '../../domain/entities/artist.entity';
import { ArtistSearchParams, ArtistsByCountryParams, PopularArtistsParams, VerifiedArtistsParams } from '../../domain/dtos/artist.dto';

@Injectable({
  providedIn: 'root'
})
export class GetArtistByIdUseCase {
  constructor(private artistService: ArtistService) {}

  execute(id: string): Observable<Artist> {
    return this.artistService.getArtistById(id);
  }
}

@Injectable({
  providedIn: 'root'
})
export class SearchArtistsUseCase {
  constructor(private artistService: ArtistService) {}

  execute(params: ArtistSearchParams): Observable<ArtistListItem[]> {
    return this.artistService.searchArtists(params);
  }
}

@Injectable({
  providedIn: 'root'
})
export class GetArtistsByCountryUseCase {
  constructor(private artistService: ArtistService) {}

  execute(params: ArtistsByCountryParams): Observable<ArtistListItem[]> {
    return this.artistService.getArtistsByCountry(params);
  }
}

@Injectable({
  providedIn: 'root'
})
export class GetPopularArtistsUseCase {
  constructor(private artistService: ArtistService) {}

  execute(params?: PopularArtistsParams): Observable<ArtistListItem[]> {
    return this.artistService.getPopularArtists(params);
  }
}

@Injectable({
  providedIn: 'root'
})
export class GetVerifiedArtistsUseCase {
  constructor(private artistService: ArtistService) {}

  execute(params?: VerifiedArtistsParams): Observable<ArtistListItem[]> {
    return this.artistService.getVerifiedArtists(params);
  }
}
