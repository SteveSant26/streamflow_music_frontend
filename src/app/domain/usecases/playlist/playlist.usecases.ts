import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { PlaylistHttpService } from '../../../infrastructure/services/playlist-http.service';
import { 
  Playlist, 
  PlaylistWithSongs, 
  PlaylistSong,
  CreatePlaylistDto,
  UpdatePlaylistDto,
  AddSongToPlaylistDto,
  LegacyPlaylist
} from '../../entities/playlist.entity';
import { Song } from '../../entities/song.entity';

// Función para convertir PlaylistWithSongs a LegacyPlaylist
function mapToLegacyPlaylist(playlist: PlaylistWithSongs): LegacyPlaylist {
  return {
    id: playlist.id,
    name: playlist.name,
    description: playlist.description,
    coverImage: `https://picsum.photos/300/300?random=${playlist.id}`,
    isPublic: playlist.is_public,
    createdDate: playlist.created_at,
    songCount: playlist.total_songs,
    duration: playlist.songs.reduce((total, song) => total + song.duration_seconds, 0),
    owner: {
      id: playlist.user_id,
      username: 'Usuario'
    },
    songs: playlist.songs.map(song => mapPlaylistSongToSong(song))
  };
}

// Función para convertir PlaylistSong a Song
function mapPlaylistSongToSong(playlistSong: PlaylistSong): Song {
  return {
    id: playlistSong.id,
    title: playlistSong.title,
    artist_id: `artist_${playlistSong.id}`,
    artist_name: playlistSong.artist_name || 'Artista Desconocido',
    album_id: `album_${playlistSong.id}`,
    album_name: playlistSong.album_name || 'Álbum Desconocido',
    duration_formatted: formatDuration(playlistSong.duration_seconds),
    duration_seconds: playlistSong.duration_seconds,
    file_url: `https://example.com/song_${playlistSong.id}.mp3`,
    thumbnail_url: playlistSong.thumbnail_url || `https://picsum.photos/64/64?random=${playlistSong.id}`,
    youtube_url: `https://youtube.com/watch?v=${playlistSong.id}`,
    genre_names_display: 'Música',
    play_count: 0,
    youtube_view_count: 0,
    youtube_like_count: 0,
    is_explicit: false,
    audio_downloaded: true,
    created_at: new Date(playlistSong.added_at),
    published_at: new Date(playlistSong.added_at)
  };
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

@Injectable({ providedIn: 'root' })
export class GetUserPlaylistsUseCase {
  private readonly playlistService = inject(PlaylistHttpService);

  execute(): Observable<LegacyPlaylist[]> {
    return this.playlistService.getPlaylists().pipe(
      map(playlists => playlists.map(playlist => ({
        id: playlist.id,
        name: playlist.name,
        description: playlist.description,
        coverImage: `https://picsum.photos/300/300?random=${playlist.id}`,
        isPublic: playlist.is_public,
        createdDate: playlist.created_at,
        songCount: playlist.total_songs,
        duration: 0, // No tenemos esta información en la lista
        owner: {
          id: playlist.user_id,
          username: 'Usuario'
        },
        songs: [] // No incluimos canciones en la lista
      })))
    );
  }
}

@Injectable({ providedIn: 'root' })
export class GetPlaylistByIdUseCase {
  private readonly playlistService = inject(PlaylistHttpService);

  execute(id: string): Observable<LegacyPlaylist> {
    return this.playlistService.getPlaylist(id).pipe(
      map(playlist => mapToLegacyPlaylist(playlist))
    );
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
