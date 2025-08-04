import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AlbumService } from '../../infrastructure/services/album.service';
import { Album, AlbumListItem } from '../../domain/entities/album.entity';
import { AlbumSearchParams, AlbumsByArtistParams, PopularAlbumsParams } from '../../domain/dtos/album.dto';

@Injectable({
  providedIn: 'root'
})
export class GetAlbumByIdUseCase {
  constructor(private albumService: AlbumService) {}

  execute(id: string): Observable<Album> {
    return this.albumService.getAlbumById(id);
  }
}

@Injectable({
  providedIn: 'root'
})
export class SearchAlbumsUseCase {
  constructor(private albumService: AlbumService) {}

  execute(params: AlbumSearchParams): Observable<AlbumListItem[]> {
    return this.albumService.searchAlbums(params);
  }
}

@Injectable({
  providedIn: 'root'
})
export class GetAlbumsByArtistUseCase {
  constructor(private albumService: AlbumService) {}

  execute(params: AlbumsByArtistParams): Observable<AlbumListItem[]> {
    return this.albumService.getAlbumsByArtist(params);
  }
}

@Injectable({
  providedIn: 'root'
})
export class GetPopularAlbumsUseCase {
  constructor(private albumService: AlbumService) {}

  execute(params?: PopularAlbumsParams): Observable<AlbumListItem[]> {
    return this.albumService.getPopularAlbums(params);
  }
}
