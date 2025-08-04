import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ArtistDto, ArtistSearchParams, ArtistsByCountryParams, PopularArtistsParams, VerifiedArtistsParams } from '../../domain/dtos/artist.dto';
import { Artist, ArtistListItem } from '../../domain/entities/artist.entity';
import { ArtistMapper } from '../../domain/mappers/artist.mapper';
import { PaginatedResponse } from '../../shared/interfaces/paginated-response.interface';

@Injectable({
  providedIn: 'root'
})
export class ArtistService {
  private readonly apiUrl = `${environment.apiUrl}/api/artists`;

  constructor(private http: HttpClient) {}

  getArtistById(id: string): Observable<Artist> {
    return this.http.get<ArtistDto>(`${this.apiUrl}/${id}/`)
      .pipe(
        map(dto => ArtistMapper.mapArtistDtoToEntity(dto))
      );
  }

  searchArtists(params: ArtistSearchParams): Observable<ArtistListItem[]> {
    let httpParams = new HttpParams().set('name', params.name);
    
    if (params.limit) {
      httpParams = httpParams.set('limit', params.limit.toString());
    }

    return this.http.get<PaginatedResponse<ArtistDto>>(`${this.apiUrl}/search/`, { params: httpParams })
      .pipe(
        map(response => ArtistMapper.mapArtistListToArtists(response.results))
      );
  }

  getArtistsByCountry(params: ArtistsByCountryParams): Observable<ArtistListItem[]> {
    let httpParams = new HttpParams().set('country', params.country);
    
    if (params.limit) {
      httpParams = httpParams.set('limit', params.limit.toString());
    }

    return this.http.get<PaginatedResponse<ArtistDto>>(`${this.apiUrl}/by-country/`, { params: httpParams })
      .pipe(
        map(response => ArtistMapper.mapArtistListToArtists(response.results))
      );
  }

  getPopularArtists(params?: PopularArtistsParams): Observable<ArtistListItem[]> {
    let httpParams = new HttpParams();
    
    if (params?.limit) {
      httpParams = httpParams.set('limit', params.limit.toString());
    }

    return this.http.get<PaginatedResponse<ArtistDto>>(`${this.apiUrl}/popular/`, { params: httpParams })
      .pipe(
        map(response => ArtistMapper.mapArtistListToArtists(response.results))
      );
  }

  getVerifiedArtists(params?: VerifiedArtistsParams): Observable<ArtistListItem[]> {
    let httpParams = new HttpParams();
    
    if (params?.limit) {
      httpParams = httpParams.set('limit', params.limit.toString());
    }

    return this.http.get<PaginatedResponse<ArtistDto>>(`${this.apiUrl}/verified/`, { params: httpParams })
      .pipe(
        map(response => ArtistMapper.mapArtistListToArtists(response.results))
      );
  }
}
