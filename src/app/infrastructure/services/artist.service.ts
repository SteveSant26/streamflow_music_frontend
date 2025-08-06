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
    
    if (params?.is_verified !== undefined) {
      httpParams = httpParams.set('is_verified', params.is_verified.toString());
    }
    
    if (params?.popular !== undefined) {
      httpParams = httpParams.set('popular', params.popular.toString());
    }
    
    if (params?.verified !== undefined) {
      httpParams = httpParams.set('verified', params.verified.toString());
    }
    
    if (params?.recent !== undefined) {
      httpParams = httpParams.set('recent', params.recent.toString());
    }
    
    if (params?.has_biography !== undefined) {
      httpParams = httpParams.set('has_biography', params.has_biography.toString());
    }
    
    if (params?.has_image !== undefined) {
      httpParams = httpParams.set('has_image', params.has_image.toString());
    }
    
    if (params?.min_followers_count) {
      httpParams = httpParams.set('min_followers_count', params.min_followers_count.toString());
    }
    
    if (params?.max_followers_count) {
      httpParams = httpParams.set('max_followers_count', params.max_followers_count.toString());
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

    return this.http.get<PaginatedResponse<ArtistDto>>(`${this.baseUrl}${API_CONFIG_ARTISTS.artists.list}`, { params: httpParams });
  }
}
