import { Injectable, inject } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { SongService } from '../../../infrastructure/services/song.service';
import { PlaylistService } from '../../../infrastructure/services/playlist.service';
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
  private readonly playlistService = inject(PlaylistService);

  execute(songId: string, createNewPlaylist: boolean = true): Observable<Song> {
    return this.getSongUseCase.execute(songId).pipe(
      tap((song) => {
        console.log(`Preparando reproducción: ${song.title} by ${song.artist_name}`);
        
        if (!song.file_url && !song.audioUrl && !song.youtube_url) {
          console.warn('No hay URL de audio disponible para esta canción');
          throw new Error('No hay URL de audio disponible para esta canción');
        }
        
        if (createNewPlaylist) {
          console.log('Creando nueva playlist con esta canción');
          // Crear nueva playlist y comenzar reproducción
          this.playlistService.createPlaylist([song], `Playing: ${song.title}`);
        } else {
          console.log('Agregando canción a la playlist actual');
          // Agregar a playlist actual y seleccionarla
          this.playlistService.addToPlaylist(song);
          
          // Encontrar el índice de la canción recién agregada y seleccionarla
          const currentPlaylist = this.playlistService.getCurrentPlaylist();
          if (currentPlaylist) {
            const songIndex = currentPlaylist.items.findIndex((item: any) => item.id === song.id);
            if (songIndex !== -1) {
              this.playlistService.selectSong(songIndex);
            }
          }
        }
        
        // Iniciar reproducción si no está ya reproduciendo
        const currentState = this.playlistService.getCurrentState();
        if (!currentState.isPlaying) {
          this.playlistService.togglePlayback();
        }
      })
    );
  }
}
