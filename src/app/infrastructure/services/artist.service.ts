import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { API_CONFIG_ARTISTS } from '../../config/end-points/api-config-artists';
import { ArtistDto, ArtistSearchParams } from '../../domain/dtos/artist.dto';
import { Artist } from '../../domain/entities/artist.entity';
import { ArtistMapper } from '../../domain/mappers/artist.mapper';
import { PaginatedResponse } from '../../shared/interfaces/paginated-response.interface';

@Injectable({
  providedIn: 'root'
})
export class ArtistService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getArtistById(id: string): Observable<Artist> {
    return this.http.get<ArtistDto>(`${this.baseUrl}${API_CONFIG_ARTISTS.artists.getById(id)}`)
      .pipe(
        map(dto => ArtistMapper.mapArtistDtoToEntity(dto))
      );
  }

  getAllArtists(params?: ArtistSearchParams): Observable<PaginatedResponse<ArtistDto>> {
    let httpParams = new HttpParams();
    
    if (params?.name) {
      httpParams = httpParams.set('name', params.name);
    }
    
    if (params?.search) {
      httpParams = httpParams.set('search', params.search);
    }
    
    if (params?.country) {
      httpParams = httpParams.set('country', params.country);
    }
    
    if (params?.is_verified !== undefined) {
      httpParams = httpParams.set('is_verified', params.is_verified.toString());
    }
    
    if (params?.popular !== undefined) {
      httpParams = httpParams.set('popular', params.popular.toString());
    }
    
    // Agregar paginación
    if (params?.page) {
      httpParams = httpParams.set('page', params.page.toString());
    }
    
    if (params?.page_size) {
      httpParams = httpParams.set('page_size', params.page_size.toString());
    }

    return this.http.get<PaginatedResponse<ArtistDto>>(`${this.baseUrl}${API_CONFIG_ARTISTS.artists.list}`, { params: httpParams });
  }
}
