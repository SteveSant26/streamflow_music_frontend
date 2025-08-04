import { Injectable, inject } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { SongService } from '../../../infrastructure/services/song.service';
import { Song } from '../../entities/song.entity';
import { SongSearchParams } from '../../dtos/song.dto';
import { 
  mapSongDtoToEntity,
  mapSongListToSongs
} from '../../mappers/song.mapper.new';

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
    return this.songService
      .incrementPlayCount(songId)
      .pipe(map((response) => response.play_count));
  }
}

@Injectable({ providedIn: 'root' })
export class GetMostPopularSongsUseCase {
  private readonly songService = inject(SongService);

  execute(page: number = 1, pageSize: number = 10): Observable<Song[]> {
    return this.songService
      .getMostPopular(page, pageSize)
      .pipe(map((response) => mapSongListToSongs(response.results)));
  }
}

@Injectable({ providedIn: 'root' })
export class GetRandomSongsUseCase {
  private readonly songService = inject(SongService);

  execute(page: number = 1, pageSize: number = 10): Observable<Song[]> {
    return this.songService
      .getRandomSongs(page, pageSize)
      .pipe(map((response) => mapSongListToSongs(response.results)));
  }
}

@Injectable({ providedIn: 'root' })
export class SearchSongsUseCase {
  private readonly songService = inject(SongService);

  execute(searchParams: SongSearchParams): Observable<Song[]> {
    return this.songService
      .searchSongs(searchParams)
      .pipe(map((response) => mapSongListToSongs(response.results)));
  }
}

@Injectable({ providedIn: 'root' })
export class PlaySongUseCase {
  private readonly getSongUseCase = inject(GetSongByIdUseCase);

  execute(songId: string, createNewPlaylist: boolean = true): Observable<Song> {
    return this.getSongUseCase.execute(songId).pipe(
      tap((song) => {
        // Mock implementation - in a real app this would interact with a playlist service
        console.log(`Playing song: ${song.title} by ${song.artist_name}`);
        if (createNewPlaylist) {
          console.log('Creating new playlist with this song');
        } else {
          console.log('Adding song to current playlist');
        }
      })
    );
  }
}
