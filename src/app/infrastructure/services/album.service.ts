import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { API_CONFIG_ALBUMS } from '../../config/end-points/api-config-albums';
import { AlbumDto, AlbumSearchParams } from '../../domain/dtos/album.dto';
import { Album } from '../../domain/entities/album.entity';
import { AlbumMapper } from '../../domain/mappers/album.mapper';
import { PaginatedResponse } from '../../shared/interfaces/paginated-response.interface';

@Injectable({
  providedIn: 'root'
})
export class AlbumService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getAlbumById(id: string): Observable<Album> {
    return this.http.get<AlbumDto>(`${this.baseUrl}${API_CONFIG_ALBUMS.albums.getById(id)}`)
      .pipe(
        map(dto => AlbumMapper.mapAlbumDtoToEntity(dto))
      );
  }

  getAllAlbums(params?: AlbumSearchParams): Observable<PaginatedResponse<AlbumDto>> {
    let httpParams = new HttpParams();
    
    if (params?.title) {
      httpParams = httpParams.set('title', params.title);
    }
    
    if (params?.search) {
      httpParams = httpParams.set('search', params.search);
    }
    
    if (params?.artist_name) {
      httpParams = httpParams.set('artist_name', params.artist_name);
    }
    
    if (params?.artist_id) {
      httpParams = httpParams.set('artist_id', params.artist_id);
    }
    
    if (params?.source_type) {
      httpParams = httpParams.set('source_type', params.source_type);
    }
    
    if (params?.min_release_date) {
      httpParams = httpParams.set('min_release_date', params.min_release_date);
    }
    
    if (params?.max_release_date) {
      httpParams = httpParams.set('max_release_date', params.max_release_date);
    }
    
    if (params?.release_year) {
      httpParams = httpParams.set('release_year', params.release_year.toString());
    }
    
    if (params?.min_total_tracks) {
      httpParams = httpParams.set('min_total_tracks', params.min_total_tracks.toString());
    }
    
    if (params?.max_total_tracks) {
      httpParams = httpParams.set('max_total_tracks', params.max_total_tracks.toString());
    }
    
    if (params?.min_play_count) {
      httpParams = httpParams.set('min_play_count', params.min_play_count.toString());
    }
    
    if (params?.max_play_count) {
      httpParams = httpParams.set('max_play_count', params.max_play_count.toString());
    }
    
    if (params?.has_cover_image !== undefined) {
      httpParams = httpParams.set('has_cover_image', params.has_cover_image.toString());
    }
    
    if (params?.has_description !== undefined) {
      httpParams = httpParams.set('has_description', params.has_description.toString());
    }
    
    if (params?.popular !== undefined) {
      httpParams = httpParams.set('popular', params.popular.toString());
    }
    
    if (params?.recent !== undefined) {
      httpParams = httpParams.set('recent', params.recent.toString());
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

    return this.http.get<PaginatedResponse<AlbumDto>>(`${this.baseUrl}${API_CONFIG_ALBUMS.albums.list}`, { params: httpParams });
  }
}
