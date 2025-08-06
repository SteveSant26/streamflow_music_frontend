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
    
    if (params?.artist_name) {
      httpParams = httpParams.set('artist_name', params.artist_name);
    }
    
    if (params?.artist_id) {
      httpParams = httpParams.set('artist_id', params.artist_id);
    }
    
    if (params?.search) {
      httpParams = httpParams.set('search', params.search);
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
