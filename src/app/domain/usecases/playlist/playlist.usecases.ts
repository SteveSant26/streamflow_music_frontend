import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PlaylistHttpService } from '../../../infrastructure/services/playlist-http.service';
import { 
  Playlist, 
  PlaylistWithSongs, 
  PlaylistSong,
  CreatePlaylistDto,
  UpdatePlaylistDto,
  AddSongToPlaylistDto
} from '../../entities/playlist.entity';

@Injectable({ providedIn: 'root' })
export class GetUserPlaylistsUseCase {
  private readonly playlistService = inject(PlaylistHttpService);

  execute(): Observable<Playlist[]> {
    return this.playlistService.getPlaylists();
  }
}

@Injectable({ providedIn: 'root' })
export class GetPlaylistByIdUseCase {
  private readonly playlistService = inject(PlaylistHttpService);

  execute(id: string): Observable<PlaylistWithSongs> {
    return this.playlistService.getPlaylist(id);
  }
}

@Injectable({ providedIn: 'root' })
export class CreatePlaylistUseCase {
  private readonly playlistService = inject(PlaylistHttpService);

  execute(data: CreatePlaylistDto): Observable<Playlist> {
    return this.playlistService.createPlaylist(data);
  }
}

@Injectable({ providedIn: 'root' })
export class UpdatePlaylistUseCase {
  private readonly playlistService = inject(PlaylistHttpService);

  execute(id: string, data: UpdatePlaylistDto): Observable<Playlist> {
    return this.playlistService.updatePlaylist(id, data);
  }
}

@Injectable({ providedIn: 'root' })
export class DeletePlaylistUseCase {
  private readonly playlistService = inject(PlaylistHttpService);

  execute(id: string): Observable<void> {
    return this.playlistService.deletePlaylist(id);
  }
}

@Injectable({ providedIn: 'root' })
export class AddSongToPlaylistUseCase {
  private readonly playlistService = inject(PlaylistHttpService);

  execute(playlistId: string, data: AddSongToPlaylistDto): Observable<PlaylistSong> {
    return this.playlistService.addSongToPlaylist(playlistId, data);
  }
}

@Injectable({ providedIn: 'root' })
export class RemoveSongFromPlaylistUseCase {
  private readonly playlistService = inject(PlaylistHttpService);

  execute(playlistId: string, songId: string): Observable<void> {
    return this.playlistService.removeSongFromPlaylist(playlistId, songId);
  }
}

@Injectable({ providedIn: 'root' })
export class GetFavoritesPlaylistUseCase {
  private readonly playlistService = inject(PlaylistHttpService);

  execute(): Observable<PlaylistWithSongs> {
    return this.playlistService.getFavoritesPlaylist();
  }
}

@Injectable({ providedIn: 'root' })
export class EnsureDefaultPlaylistUseCase {
  private readonly playlistService = inject(PlaylistHttpService);

  execute(): Observable<Playlist> {
    return this.playlistService.ensureDefaultPlaylist();
  }
}

@Injectable({ providedIn: 'root' })
export class GetPlaylistSongsUseCase {
  private readonly playlistService = inject(PlaylistHttpService);

  execute(playlistId: string): Observable<PlaylistSong[]> {
    return this.playlistService.getPlaylistSongs(playlistId);
  }
}

@Injectable({ providedIn: 'root' })
export class ReorderPlaylistSongsUseCase {
  private readonly playlistService = inject(PlaylistHttpService);

  execute(playlistId: string, songIds: string[]): Observable<PlaylistSong[]> {
    return this.playlistService.reorderPlaylistSongs(playlistId, songIds);
  }
}
