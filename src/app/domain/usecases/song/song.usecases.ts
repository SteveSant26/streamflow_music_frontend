import { Injectable, inject } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { SongService } from '../../../infrastructure/services/song.service';
import { PlaylistService } from '../../../infrastructure/services/playlist.service';
import { GlobalPlayerStateService } from '../../../infrastructure/services/global-player-state.service';
import { Song } from '../../entities/song.entity';
import { SongSearchParams } from '../../dtos/song.dto';
import { PlaylistContext } from '../../entities/playlist-context.entity';
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
  private readonly globalPlayerService = inject(GlobalPlayerStateService);
  private readonly getMostPopularSongsUseCase = inject(GetMostPopularSongsUseCase);
  private readonly getRandomSongsUseCase = inject(GetRandomSongsUseCase);

  execute(songId: string, context: PlaylistContext): Observable<Song> {
    return this.getSongUseCase.execute(songId).pipe(
      tap((song) => {
        console.log(`Preparando reproducción: ${song.title} by ${song.artist_name}`);
        console.log(`Contexto de playlist:`, context);
        
        // Verificar si hay URL de audio disponible
        const hasAudioUrl = !!(song.file_url || song.audioUrl || song.youtube_url);
        if (!hasAudioUrl) {
          console.warn('No hay URL de audio disponible para esta canción');
        }
        
        // Crear playlist basada en el contexto
        this.createContextualPlaylist(song, context);
        
        // Iniciar reproducción
        setTimeout(() => {
          const currentState = this.playlistService.getCurrentState();
          if (!currentState.isPlaying || currentState.currentSong?.id !== song.id) {
            this.playlistService.togglePlayback();
          }
        }, 100);
      })
    );
  }

  // Método de compatibilidad para llamadas existentes
  executeSimple(songId: string, createNewPlaylist: boolean = true): Observable<Song> {
    return this.getSongUseCase.execute(songId).pipe(
      tap((song) => {
        if (createNewPlaylist) {
          // En lugar de crear una playlist con solo una canción,
          // crear un contexto inteligente basado en canciones populares
          this.createSmartPlaylist(song);
        } else {
          this.playlistService.addToPlaylist(song);
        }
        
        setTimeout(() => {
          this.playlistService.togglePlayback();
        }, 100);
      })
    );
  }

  private createSmartPlaylist(selectedSong: Song): void {
    // Crear una playlist inteligente usando canciones populares como contexto
    this.getMostPopularSongsUseCase.execute(1, 20).subscribe({
      next: (popularSongs) => {
        const songIndex = popularSongs.findIndex(s => s.id === selectedSong.id);
        
        if (songIndex !== -1) {
          // La canción está en las populares, usar esa lista
          this.playlistService.createPlaylist(popularSongs, 'Canciones Populares', songIndex);
          this.playlistService.setPlaylistType('circular');
          this.playlistService.setPlaylistContext('popular');
        } else {
          // La canción no está en populares, obtener canciones aleatorias para contexto
          this.getRandomSongsUseCase.execute(1, 20).subscribe({
            next: (randomSongs) => {
              // Agregar la canción seleccionada al inicio de las aleatorias
              const contextSongs = [selectedSong, ...randomSongs.filter(s => s.id !== selectedSong.id)];
              this.playlistService.createPlaylist(contextSongs, 'Mix de Canciones', 0);
              this.playlistService.setPlaylistType('expandable');
              this.playlistService.setPlaylistContext('random');
            },
            error: () => {
              // Fallback: crear playlist con solo la canción
              this.playlistService.createPlaylist([selectedSong], `Playing: ${selectedSong.title}`);
              this.playlistService.setPlaylistType('single');
            }
          });
        }
      },
      error: () => {
        // Fallback: usar canciones aleatorias
        this.getRandomSongsUseCase.execute(1, 20).subscribe({
          next: (randomSongs) => {
            const contextSongs = [selectedSong, ...randomSongs.filter(s => s.id !== selectedSong.id)];
            this.playlistService.createPlaylist(contextSongs, 'Mix de Canciones', 0);
            this.playlistService.setPlaylistType('expandable');
          },
          error: () => {
            // Último fallback
            this.playlistService.createPlaylist([selectedSong], `Playing: ${selectedSong.title}`);
            this.playlistService.setPlaylistType('single');
          }
        });
      }
    });
  }

  // Nuevo método para reproducir desde un contexto específico de canciones
  executeFromContext(songId: string, contextSongs: Song[], contextName: string, contextType: 'popular' | 'random' | 'search' | 'album' | 'artist' = 'random'): Observable<Song> {
    // Buscar la canción en el contexto primero para evitar petición innecesaria
    const songIndex = contextSongs.findIndex(s => s.id === songId);
    
    if (songIndex !== -1) {
      // La canción está en el contexto, usarla directamente
      const song = contextSongs[songIndex];
      
      console.log(`🎵 Reproduciendo desde contexto: ${song.title} by ${song.artist_name}`);
      console.log(`🎧 Contexto: ${contextName} (${contextSongs.length} canciones, tipo: ${contextType})`);
      console.log(`🔊 Iniciando reproducción...`, song);
      
      // Crear playlist con el contexto completo
      this.playlistService.createPlaylist(contextSongs, contextName, songIndex);
      console.log(`✅ Playlist creada con ${contextSongs.length} canciones, índice actual: ${songIndex}`);
      
      // Configurar el tipo de playlist según el contexto
      switch (contextType) {
        case 'popular':
          this.playlistService.setPlaylistType('circular');
          this.playlistService.setPlaylistContext('popular');
          break;
        case 'random':
          this.playlistService.setPlaylistType('expandable');
          this.playlistService.setPlaylistContext('random');
          break;
        case 'search':
          this.playlistService.setPlaylistType('expandable');
          this.playlistService.setPlaylistContext('search');
          break;
        case 'album':
          this.playlistService.setPlaylistType('circular');
          this.playlistService.setPlaylistContext('album');
          break;
        case 'artist':
          this.playlistService.setPlaylistType('circular');
          this.playlistService.setPlaylistContext('artist');
          break;
      }
      
      console.log(`🎚️ Tipo de playlist configurado: ${contextType}`);
      
      // Iniciar reproducción inmediatamente - SOLO a través del PlaylistService
      console.log(`🎶 Llamando togglePlayback()...`);
      setTimeout(() => {
        this.playlistService.togglePlayback();
        console.log(`🎵 togglePlayback() ejecutado`);
      }, 100);
      
      // ELIMINADO: Llamada duplicada a PlayerUseCase que causaba doble reproducción
      // NO llamar directamente a playerUseCase.playSong() aquí para evitar duplicación
      
      // Retornar la canción como observable
      return new Observable(subscriber => {
        subscriber.next(song);
        subscriber.complete();
      });
    } else {
      // Fallback: obtener la canción del servidor y usar smart playlist
      console.log(`⚠️ Canción ${songId} no encontrada en contexto, usando fallback`);
      return this.getSongUseCase.execute(songId).pipe(
        tap((song) => {
          this.createSmartPlaylist(song);
          setTimeout(() => {
            this.playlistService.togglePlayback();
          }, 100);
        })
      );
    }
  }

  private createContextualPlaylist(selectedSong: Song, context: PlaylistContext): void {
    const startIndex = context.songs.findIndex(s => s.id === selectedSong.id);
    
    switch (context.type) {
      case 'user_playlist':
        this.playlistService.createPlaylist(context.songs, context.name || 'Mi Playlist', startIndex);
        this.playlistService.setPlaylistType('circular'); // Vuelve al inicio al final
        this.playlistService.setPlaylistContext('user_playlist');
        break;

      case 'album':
        this.playlistService.createPlaylist(context.songs, `Álbum: ${context.name}`, startIndex);
        this.playlistService.setPlaylistType('circular');
        this.playlistService.setPlaylistContext('album');
        break;

      case 'artist':
        this.playlistService.createPlaylist(context.songs, `Artista: ${context.name}`, startIndex);
        this.playlistService.setPlaylistType('circular');
        this.playlistService.setPlaylistContext('artist');
        break;

      case 'search':
        this.playlistService.createPlaylist(context.songs, `Búsqueda: ${context.query}`, startIndex);
        this.playlistService.setPlaylistType('expandable'); // Carga más al final
        this.playlistService.setPlaylistContext('search', { 
          searchQuery: context.query,
          canLoadMore: context.hasMore !== false,
          currentPage: context.page || 1
        });
        break;

      case 'random':
        this.playlistService.createPlaylist(context.songs, 'Canciones Aleatorias', startIndex);
        this.playlistService.setPlaylistType('expandable'); // Carga más random al final
        this.playlistService.setPlaylistContext('random', {
          canLoadMore: true,
          currentPage: context.page || 1
        });
        break;

      case 'popular':
        this.playlistService.createPlaylist(context.songs, 'Canciones Populares', startIndex);
        this.playlistService.setPlaylistType('expandable'); // Carga más populares
        this.playlistService.setPlaylistContext('popular', {
          canLoadMore: true,
          currentPage: context.page || 1
        });
        break;

      default:
        // Fallback: crear playlist simple
        this.playlistService.createPlaylist([selectedSong], `Playing: ${selectedSong.title}`);
        this.playlistService.setPlaylistType('single');
        this.playlistService.setPlaylistContext('single');
    }
  }
}
