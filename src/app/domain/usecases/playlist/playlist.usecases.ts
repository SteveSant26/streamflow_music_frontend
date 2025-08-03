import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { UserPlaylistService } from '../../../infrastructure/services/user-playlist.service';
import { Playlist } from '../../entities/playlist.entity';
import { CreatePlaylistDto, UpdatePlaylistDto, AddSongToPlaylistDto } from '../../dtos/playlist.dto';
import { mapPlaylistDtoToEntity, mapPaginatedPlaylistResponse } from '../../mappers/playlist.mapper';

@Injectable({ providedIn: 'root' })
export class GetUserPlaylistsUseCase {
  private readonly userPlaylistService = inject(UserPlaylistService);

  execute(page?: number, pageSize?: number): Observable<Playlist[]> {
    return this.userPlaylistService
      .getUserPlaylists(page, pageSize)
      .pipe(map(response => mapPaginatedPlaylistResponse(response)));
  }
}

@Injectable({ providedIn: 'root' })
export class GetPlaylistByIdUseCase {
  private readonly userPlaylistService = inject(UserPlaylistService);

  execute(id: string): Observable<Playlist> {
    return this.userPlaylistService
      .getPlaylistById(id)
      .pipe(map(dto => mapPlaylistDtoToEntity(dto)));
  }
}

@Injectable({ providedIn: 'root' })
export class CreatePlaylistUseCase {
  private readonly userPlaylistService = inject(UserPlaylistService);

  execute(data: CreatePlaylistDto): Observable<Playlist> {
    return this.userPlaylistService
      .createPlaylist(data)
      .pipe(map(dto => mapPlaylistDtoToEntity(dto)));
  }
}

@Injectable({ providedIn: 'root' })
export class UpdatePlaylistUseCase {
  private readonly userPlaylistService = inject(UserPlaylistService);

  execute(id: string, data: UpdatePlaylistDto): Observable<Playlist> {
    return this.userPlaylistService
      .updatePlaylist(id, data)
      .pipe(map(dto => mapPlaylistDtoToEntity(dto)));
  }
}

@Injectable({ providedIn: 'root' })
export class DeletePlaylistUseCase {
  private readonly userPlaylistService = inject(UserPlaylistService);

  execute(id: string): Observable<void> {
    return this.userPlaylistService.deletePlaylist(id);
  }
}

@Injectable({ providedIn: 'root' })
export class AddSongToPlaylistUseCase {
  private readonly userPlaylistService = inject(UserPlaylistService);

  execute(playlistId: string, data: AddSongToPlaylistDto): Observable<Playlist> {
    return this.userPlaylistService
      .addSongToPlaylist(playlistId, data)
      .pipe(map(dto => mapPlaylistDtoToEntity(dto)));
  }
}

@Injectable({ providedIn: 'root' })
export class RemoveSongFromPlaylistUseCase {
  private readonly userPlaylistService = inject(UserPlaylistService);

  execute(playlistId: string, songId: string): Observable<Playlist> {
    return this.userPlaylistService
      .removeSongFromPlaylist(playlistId, songId)
      .pipe(map(dto => mapPlaylistDtoToEntity(dto)));
  }
}

@Injectable({ providedIn: 'root' })
export class GetPublicPlaylistsUseCase {
  private readonly userPlaylistService = inject(UserPlaylistService);

  execute(page?: number, pageSize?: number): Observable<Playlist[]> {
    return this.userPlaylistService
      .getPublicPlaylists(page, pageSize)
      .pipe(map(response => mapPaginatedPlaylistResponse(response)));
  }
}
