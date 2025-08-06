import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AlbumService } from '../../infrastructure/services/album.service';
import { Album, AlbumListItem } from '../../domain/entities/album.entity';
import { AlbumSearchParams, AlbumDto } from '../../domain/dtos/album.dto';
import { AlbumMapper } from '../mappers/album.mapper';
import { PaginatedResponse } from '../../shared/interfaces/paginated-response.interface';

@Injectable({
  providedIn: 'root'
})
export class GetAlbumByIdUseCase {
  constructor(private readonly albumService: AlbumService) {}

  execute(id: string): Observable<Album> {
    return this.albumService.getAlbumById(id);
  }
}

@Injectable({
  providedIn: 'root'
})
export class GetAllAlbumsUseCase {
  constructor(private readonly albumService: AlbumService) {}

  execute(params?: AlbumSearchParams): Observable<AlbumListItem[]> {
    return this.albumService.getAllAlbums(params).pipe(
      map((response: PaginatedResponse<AlbumDto>) => 
        AlbumMapper.mapAlbumListToAlbums(response.results)
      )
    );
  }
}

@Injectable({
  providedIn: 'root'
})
export class GetPopularAlbumsUseCase {
  constructor(private readonly albumService: AlbumService) {}

  execute(params?: { limit?: number }): Observable<AlbumListItem[]> {
    const searchParams: AlbumSearchParams = {
      popular: true,
      page_size: params?.limit || 10,
      ordering: '-play_count'
    };
    
    return this.albumService.getAllAlbums(searchParams).pipe(
      map((response: PaginatedResponse<AlbumDto>) => 
        AlbumMapper.mapAlbumListToAlbums(response.results)
      )
    );
  }
}

@Injectable({
  providedIn: 'root'
})
export class GetAlbumsByArtistUseCase {
  constructor(private readonly albumService: AlbumService) {}

  execute(params: { artist_id: string; limit?: number }): Observable<AlbumListItem[]> {
    const searchParams: AlbumSearchParams = {
      artist_id: params.artist_id,
      page_size: params.limit || 20
    };
    
    return this.albumService.getAllAlbums(searchParams).pipe(
      map((response: PaginatedResponse<AlbumDto>) => 
        AlbumMapper.mapAlbumListToAlbums(response.results)
      )
    );
  }
}
