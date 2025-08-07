import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { MyPlaylistsHttpService } from '../../../infrastructure/services/my-playlists-http.service';
import {
  Playlist,
  PlaylistWithSongs,
  CreatePlaylistDto,
  UpdatePlaylistDto,
  AddSongToPlaylistDto,
  PlaylistSong,
  PaginatedPlaylistResponse,
  PaginatedPlaylistSongResponse
} from '../../entities/playlist.entity';
import { MyPlaylistsQueryParamsDto } from '../../dtos/playlist.dto';

// Casos de uso para gestionar MIS playlists

@Injectable({
  providedIn: 'root'
})
export class GetMyPlaylistsUseCase {
  private readonly service = inject(MyPlaylistsHttpService);

  execute(params?: MyPlaylistsQueryParamsDto): Observable<PaginatedPlaylistResponse> {
    return this.service.getMyPlaylists(params);
  }
}

@Injectable({
  providedIn: 'root'
})
export class GetMyPlaylistByIdUseCase {
  private readonly service = inject(MyPlaylistsHttpService);

  execute(id: string): Observable<PlaylistWithSongs> {
    return this.service.getMyPlaylistById(id);
  }
}

@Injectable({
  providedIn: 'root'
})
export class CreateMyPlaylistUseCase {
  private readonly service = inject(MyPlaylistsHttpService);

  execute(createDto: CreatePlaylistDto): Observable<Playlist> {
    return this.service.createPlaylist(createDto);
  }
}

@Injectable({
  providedIn: 'root'
})
export class UpdateMyPlaylistUseCase {
  private readonly service = inject(MyPlaylistsHttpService);

  execute(id: string, updateDto: UpdatePlaylistDto): Observable<Playlist> {
    return this.service.updatePlaylist(id, updateDto);
  }
}

@Injectable({
  providedIn: 'root'
})
export class DeleteMyPlaylistUseCase {
  private readonly service = inject(MyPlaylistsHttpService);

  execute(id: string): Observable<void> {
    return this.service.deletePlaylist(id);
  }
}

@Injectable({
  providedIn: 'root'
})
export class GetMyPlaylistSongsUseCase {
  private readonly service = inject(MyPlaylistsHttpService);

  execute(playlistId: string, params?: { page?: number; page_size?: number; search?: string }): Observable<PaginatedPlaylistSongResponse> {
    return this.service.getPlaylistSongs(playlistId, params);
  }
}

@Injectable({
  providedIn: 'root'
})
export class AddSongToMyPlaylistUseCase {
  private readonly service = inject(MyPlaylistsHttpService);

  execute(playlistId: string, addSongDto: AddSongToPlaylistDto): Observable<PlaylistSong> {
    return this.service.addSongToPlaylist(playlistId, addSongDto);
  }
}

@Injectable({
  providedIn: 'root'
})
export class RemoveSongFromMyPlaylistUseCase {
  private readonly service = inject(MyPlaylistsHttpService);

  execute(playlistId: string, songId: string): Observable<void> {
    return this.service.removeSongFromPlaylist(playlistId, songId);
  }
}
