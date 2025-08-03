import { Injectable, inject } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { SongService } from '../../../infrastructure/services/song.service';
import { PlaylistService } from '../../../infrastructure/services/playlist.service';
import { Song } from '../../entities/song.entity';
import { SongDto, SongSearchDto, SongSearchParams, PaginationParams } from '../../dtos/song.dto';

// Mappers de DTO a Entity
function mapSongDtoToEntity(dto: SongDto): Song {
  return {
    id: dto.id,
    title: dto.title,
    artist: dto.artist_name,
    album: dto.album_title,
    genre: dto.genre_name,
    duration: dto.duration_formatted,
    durationSeconds: dto.duration_seconds,
    fileUrl: dto.file_url,
    thumbnailUrl: dto.thumbnail_url,
    youtubeUrl: dto.youtube_url,
    tags: dto.tags,
    playCount: dto.play_count,
    youtubeViewCount: dto.youtube_view_count,
    youtubeLikeCount: dto.youtube_like_count,
    isExplicit: dto.is_explicit,
    audioDownloaded: dto.audio_downloaded,
    createdAt: new Date(dto.created_at),
    publishedAt: new Date(dto.published_at)
  };
}

function mapSongSearchDtoToEntity(dto: SongSearchDto): Song {
  return {
    id: dto.id,
    title: dto.title,
    artist: dto.artist_name,
    album: dto.album_title,
    genre: '', // No disponible en search DTO
    duration: dto.duration_formatted,
    durationSeconds: 0, // No disponible en search DTO
    fileUrl: dto.file_url,
    thumbnailUrl: dto.thumbnail_url,
    youtubeUrl: '',
    tags: [],
    playCount: dto.play_count,
    youtubeViewCount: 0,
    youtubeLikeCount: 0,
    isExplicit: false,
    audioDownloaded: dto.audio_downloaded,
    createdAt: new Date(),
    publishedAt: new Date()
  };
}

@Injectable({ providedIn: 'root' })
export class GetSongByIdUseCase {
  private readonly songService = inject(SongService);

  execute(songId: string): Observable<Song> {
    return this.songService.getSongById(songId).pipe(
      map(mapSongDtoToEntity)
    );
  }
}

@Injectable({ providedIn: 'root' })
export class IncrementPlayCountUseCase {
  private readonly songService = inject(SongService);

  execute(songId: string): Observable<number> {
    return this.songService.incrementPlayCount(songId).pipe(
      map(response => response.play_count)
    );
  }
}

@Injectable({ providedIn: 'root' })
export class GetMostPopularSongsUseCase {
  private readonly songService = inject(SongService);

  execute(params?: PaginationParams): Observable<Song[]> {
    return this.songService.getMostPopular(params).pipe(
      map(songs => songs.map(mapSongSearchDtoToEntity))
    );
  }
}

@Injectable({ providedIn: 'root' })
export class ProcessYoutubeVideoUseCase {
  private readonly songService = inject(SongService);

  execute(videoId: string): Observable<Song> {
    return this.songService.processYoutubeVideo(videoId).pipe(
      map(mapSongDtoToEntity)
    );
  }
}

@Injectable({ providedIn: 'root' })
export class GetRandomSongsUseCase {
  private readonly songService = inject(SongService);

  execute(params?: PaginationParams): Observable<Song[]> {
    return this.songService.getRandomSongs(params).pipe(
      map(songs => songs.map(mapSongSearchDtoToEntity))
    );
  }
}

@Injectable({ providedIn: 'root' })
export class SearchSongsUseCase {
  private readonly songService = inject(SongService);

  execute(searchParams: SongSearchParams): Observable<Song[]> {
    return this.songService.searchSongs(searchParams).pipe(
      map(songs => songs.map(mapSongSearchDtoToEntity))
    );
  }
}

@Injectable({ providedIn: 'root' })
export class PlaySongUseCase {
  private readonly playlistService = inject(PlaylistService);
  private readonly getSongUseCase = inject(GetSongByIdUseCase);

  execute(songId: string, createNewPlaylist: boolean = true): Observable<Song> {
    return this.getSongUseCase.execute(songId).pipe(
      tap(song => {
        if (createNewPlaylist) {
          this.playlistService.createPlaylist([song], 'Now Playing', 0);
        } else {
          this.playlistService.addToPlaylist(song);
        }
      })
    );
  }
}

@Injectable({ providedIn: 'root' })
export class PlayRandomPlaylistUseCase {
  private readonly playlistService = inject(PlaylistService);
  private readonly getRandomSongsUseCase = inject(GetRandomSongsUseCase);

  execute(limit: number = 20): Observable<Song[]> {
    return this.getRandomSongsUseCase.execute({ page_size: limit }).pipe(
      tap(songs => {
        if (songs.length > 0) {
          this.playlistService.createPlaylist(songs, 'Random Mix', 0);
        }
      })
    );
  }
}

@Injectable({ providedIn: 'root' })
export class PlaySearchResultsUseCase {
  private readonly playlistService = inject(PlaylistService);
  private readonly searchSongsUseCase = inject(SearchSongsUseCase);

  execute(searchParams: SongSearchParams, startIndex: number = 0): Observable<Song[]> {
    return this.searchSongsUseCase.execute(searchParams).pipe(
      tap(songs => {
        if (songs.length > 0) {
          this.playlistService.createPlaylist(songs, `Search: ${searchParams.q}`, startIndex);
        }
      })
    );
  }
}

@Injectable({ providedIn: 'root' })
export class PlayPopularPlaylistUseCase {
  private readonly playlistService = inject(PlaylistService);
  private readonly getMostPopularUseCase = inject(GetMostPopularSongsUseCase);

  execute(limit: number = 50): Observable<Song[]> {
    return this.getMostPopularUseCase.execute({ page_size: limit }).pipe(
      tap(songs => {
        if (songs.length > 0) {
          this.playlistService.createPlaylist(songs, 'Popular Songs', 0);
        }
      })
    );
  }
}
