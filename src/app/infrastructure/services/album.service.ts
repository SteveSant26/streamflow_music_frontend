import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AlbumDto, AlbumSearchParams, AlbumsByArtistParams, PopularAlbumsParams } from '../../domain/dtos/album.dto';
import { Album, AlbumListItem } from '../../domain/entities/album.entity';
import { AlbumMapper } from '../../domain/mappers/album.mapper';
import { PaginatedResponse } from '../../shared/interfaces/paginated-response.interface';

@Injectable({
  providedIn: 'root'
})
export class AlbumService {
  private readonly apiUrl = `${environment.apiUrl}/api/albums`;

  constructor(private http: HttpClient) {}

  getAlbumById(id: string): Observable<Album> {
    return this.http.get<AlbumDto>(`${this.apiUrl}/${id}/`)
      .pipe(
        map(dto => AlbumMapper.mapAlbumDtoToEntity(dto))
      );
  }

  searchAlbums(params: AlbumSearchParams): Observable<AlbumListItem[]> {
    let httpParams = new HttpParams().set('title', params.title);
    
    if (params.limit) {
      httpParams = httpParams.set('limit', params.limit.toString());
    }

    return this.http.get<PaginatedResponse<AlbumDto>>(`${this.apiUrl}/search/`, { params: httpParams })
      .pipe(
        map(response => AlbumMapper.mapAlbumListToAlbums(response.results))
      );
  }

  getAlbumsByArtist(params: AlbumsByArtistParams): Observable<AlbumListItem[]> {
    let httpParams = new HttpParams().set('artist_id', params.artist_id);
    
    if (params.limit) {
      httpParams = httpParams.set('limit', params.limit.toString());
    }

    return this.http.get<PaginatedResponse<AlbumDto>>(`${this.apiUrl}/by-artist/`, { params: httpParams })
      .pipe(
        map(response => AlbumMapper.mapAlbumListToAlbums(response.results))
      );
  }

  getPopularAlbums(params?: PopularAlbumsParams): Observable<AlbumListItem[]> {
    let httpParams = new HttpParams();
    
    if (params?.limit) {
      httpParams = httpParams.set('limit', params.limit.toString());
    }

    return this.http.get<PaginatedResponse<AlbumDto>>(`${this.apiUrl}/popular/`, { params: httpParams })
      .pipe(
        map(response => AlbumMapper.mapAlbumListToAlbums(response.results))
      );
  }
}
