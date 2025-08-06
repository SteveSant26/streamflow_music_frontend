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
