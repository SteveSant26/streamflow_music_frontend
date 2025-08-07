import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PublicPlaylistsHttpService } from '../../../infrastructure/services/public-playlists-http.service';
import {
  PlaylistWithSongs,
  PaginatedPlaylistResponse,
  PaginatedPlaylistSongResponse
} from '../../entities/playlist.entity';
import { PublicPlaylistsQueryParamsDto } from '../../dtos/playlist.dto';

// Casos de uso para explorar PLAYLISTS PÚBLICAS (solo lectura)

@Injectable({
  providedIn: 'root'
})
export class GetPublicPlaylistsUseCase {
  private readonly service = inject(PublicPlaylistsHttpService);

  execute(params?: Omit<PublicPlaylistsQueryParamsDto, 'is_public'>): Observable<PaginatedPlaylistResponse> {
    return this.service.getPublicPlaylists(params);
  }
}

@Injectable({
  providedIn: 'root'
})
export class GetPublicPlaylistByIdUseCase {
  private readonly service = inject(PublicPlaylistsHttpService);

  execute(id: string): Observable<PlaylistWithSongs> {
    return this.service.getPublicPlaylistById(id);
  }
}

@Injectable({
  providedIn: 'root'
})
export class GetPublicPlaylistSongsUseCase {
  private readonly service = inject(PublicPlaylistsHttpService);

  execute(playlistId: string, params?: { page?: number; page_size?: number; search?: string }): Observable<PaginatedPlaylistSongResponse> {
    return this.service.getPublicPlaylistSongs(playlistId, params);
  }
}

@Injectable({
  providedIn: 'root'
})
export class SearchPublicPlaylistsUseCase {
  private readonly service = inject(PublicPlaylistsHttpService);

  execute(searchTerm: string, params?: { page?: number; page_size?: number }): Observable<PaginatedPlaylistResponse> {
    return this.service.searchPublicPlaylists(searchTerm, params);
  }
}

@Injectable({
  providedIn: 'root'
})
export class GetPopularPublicPlaylistsUseCase {
  private readonly service = inject(PublicPlaylistsHttpService);

  execute(params?: { page?: number; page_size?: number }): Observable<PaginatedPlaylistResponse> {
    return this.service.getPopularPublicPlaylists(params);
  }
}
