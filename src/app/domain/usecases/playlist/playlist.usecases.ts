import { Injectable, inject } from '@angular/core';
import { Observable, map, catchError, throwError, switchMap } from 'rxjs';
import { IPlaylistRepository } from '../../repositories/i-playlist.repository';
import { 
  Playlist, 
  PlaylistWithSongs, 
  PlaylistSong,
  CreatePlaylistDto,
  UpdatePlaylistDto,
  AddSongToPlaylistDto,
  LegacyPlaylist,
  PaginatedPlaylistResponse,
  PaginatedPlaylistSongResponse,
  PlaylistFilters
} from '../../entities/playlist.entity';
import { PlaylistMapper } from '../../mappers/playlist.mapper';
import { PlaylistRepositoryImpl } from '../../../infrastructure/repositories/playlist.repository.impl';

// Casos de uso para operaciones CRUD de playlists
@Injectable({ providedIn: 'root' })
export class GetPlaylistsUseCase {
  private readonly repository = inject(PlaylistRepositoryImpl);

  execute(filters?: PlaylistFilters): Observable<PaginatedPlaylistResponse> {
    return this.repository.getPlaylists(filters).pipe(
      catchError(error => {
        console.error('Error getting playlists:', error);
        return throwError(() => new Error('No se pudieron cargar las playlists'));
      })
    );
  }
}

@Injectable({ providedIn: 'root' })
export class GetUserPlaylistsUseCase {
  private readonly repository = inject(PlaylistRepositoryImpl);

  execute(filters?: PlaylistFilters): Observable<Playlist[]> {
    return this.repository.getUserPlaylists(filters).pipe(
      map(response => {
        console.log('GetUserPlaylistsUseCase - Respuesta del repositorio:', response);
        return response.results || [];
      }),
      catchError(error => {
        console.error('Error getting user playlists:', error);
        console.log('Detalles del error:', {
          message: error.message,
          status: error.status,
          error: error
        });
        
        // Si es un error del servidor (500), devolver array vacío para que no bloquee la UI
        if (error.status === 500 || error.message?.includes('Error del servidor')) {
          console.warn('Error 500 detectado, devolviendo array vacío temporalmente');
          return []; // Devolver array vacío en lugar de error
        }
        
        return throwError(() => new Error('No se pudieron cargar las playlists del usuario'));
      })
    );
  }
}

@Injectable({ providedIn: 'root' })
export class GetPlaylistByIdUseCase {
  private readonly repository = inject(PlaylistRepositoryImpl);

  execute(id: string): Observable<PlaylistWithSongs> {
    if (!id || id.trim().length === 0) {
      return throwError(() => new Error('ID de playlist requerido'));
    }

    return this.repository.getPlaylist(id).pipe(
      catchError(error => {
        console.error('Error getting playlist:', error);
        return throwError(() => new Error('No se pudo cargar la playlist'));
      })
    );
  }
}

@Injectable({ providedIn: 'root' })
export class GetLegacyPlaylistByIdUseCase {
  private readonly repository = inject(PlaylistRepositoryImpl);

  execute(id: string): Observable<LegacyPlaylist> {
    return this.repository.getPlaylist(id).pipe(
      map(playlist => PlaylistMapper.toLegacyPlaylist(playlist)),
      catchError(error => {
        console.error('Error getting legacy playlist:', error);
        return throwError(() => new Error('No se pudo cargar la playlist'));
      })
    );
  }
}

@Injectable({ providedIn: 'root' })
export class CreatePlaylistUseCase {
  private readonly repository = inject(PlaylistRepositoryImpl);

  execute(data: CreatePlaylistDto): Observable<Playlist> {
    const validationErrors = PlaylistMapper.validateCreatePlaylist(data);
    if (validationErrors.length > 0) {
      return throwError(() => new Error(validationErrors.join(', ')));
    }

    return this.repository.createPlaylist(data).pipe(
      catchError(error => {
        console.error('Error creating playlist:', error);
        return throwError(() => new Error('No se pudo crear la playlist'));
      })
    );
  }
}

@Injectable({ providedIn: 'root' })
export class UpdatePlaylistUseCase {
  private readonly repository = inject(PlaylistRepositoryImpl);

  execute(id: string, data: UpdatePlaylistDto): Observable<Playlist> {
    if (!id || id.trim().length === 0) {
      return throwError(() => new Error('ID de playlist requerido'));
    }

    const validationErrors = PlaylistMapper.validateUpdatePlaylist(data);
    if (validationErrors.length > 0) {
      return throwError(() => new Error(validationErrors.join(', ')));
    }

    return this.repository.updatePlaylist(id, data).pipe(
      catchError(error => {
        console.error('Error updating playlist:', error);
        return throwError(() => new Error('No se pudo actualizar la playlist'));
      })
    );
  }
}

@Injectable({ providedIn: 'root' })
export class DeletePlaylistUseCase {
  private readonly repository = inject(PlaylistRepositoryImpl);

  execute(id: string): Observable<void> {
    if (!id || id.trim().length === 0) {
      return throwError(() => new Error('ID de playlist requerido'));
    }

    return this.repository.deletePlaylist(id).pipe(
      catchError(error => {
        console.error('Error deleting playlist:', error);
        return throwError(() => new Error('No se pudo eliminar la playlist'));
      })
    );
  }
}

// Casos de uso para operaciones con canciones de playlists
@Injectable({ providedIn: 'root' })
export class GetPlaylistSongsUseCase {
  private readonly repository = inject(PlaylistRepositoryImpl);

  execute(playlistId: string, page?: number, pageSize?: number): Observable<PaginatedPlaylistSongResponse> {
    if (!playlistId || playlistId.trim().length === 0) {
      return throwError(() => new Error('ID de playlist requerido'));
    }

    return this.repository.getPlaylistSongs(playlistId, page, pageSize).pipe(
      catchError(error => {
        console.error('Error getting playlist songs:', error);
        return throwError(() => new Error('No se pudieron cargar las canciones de la playlist'));
      })
    );
  }
}

@Injectable({ providedIn: 'root' })
export class AddSongToPlaylistUseCase {
  private readonly repository = inject(PlaylistRepositoryImpl);

  execute(playlistId: string, data: AddSongToPlaylistDto): Observable<PlaylistSong> {
    if (!playlistId || playlistId.trim().length === 0) {
      return throwError(() => new Error('ID de playlist requerido'));
    }

    const validationErrors = PlaylistMapper.validateAddSongToPlaylist(data);
    if (validationErrors.length > 0) {
      return throwError(() => new Error(validationErrors.join(', ')));
    }

    return this.repository.addSongToPlaylist(playlistId, data).pipe(
      catchError(error => {
        console.error('Error adding song to playlist:', error);
        return throwError(() => new Error('No se pudo agregar la canción a la playlist'));
      })
    );
  }
}

@Injectable({ providedIn: 'root' })
export class RemoveSongFromPlaylistUseCase {
  private readonly repository = inject(PlaylistRepositoryImpl);

  execute(playlistId: string, songId: string): Observable<void> {
    if (!playlistId || playlistId.trim().length === 0) {
      return throwError(() => new Error('ID de playlist requerido'));
    }
    
    if (!songId || songId.trim().length === 0) {
      return throwError(() => new Error('ID de canción requerido'));
    }

    return this.repository.removeSongFromPlaylist(playlistId, songId).pipe(
      catchError(error => {
        console.error('Error removing song from playlist:', error);
        return throwError(() => new Error('No se pudo remover la canción de la playlist'));
      })
    );
  }
}

// Casos de uso compuestos para operaciones más complejas
@Injectable({ providedIn: 'root' })
export class SearchPlaylistsUseCase {
  private readonly repository = inject(PlaylistRepositoryImpl);

  execute(searchTerm: string, filters?: Omit<PlaylistFilters, 'search'>): Observable<Playlist[]> {
    if (!searchTerm || searchTerm.trim().length === 0) {
      return throwError(() => new Error('Término de búsqueda requerido'));
    }

    const searchFilters: PlaylistFilters = {
      ...filters,
      search: searchTerm.trim()
    };

    return this.repository.getPlaylists(searchFilters).pipe(
      map(response => response.results),
      catchError(error => {
        console.error('Error searching playlists:', error);
        return throwError(() => new Error('No se pudieron buscar las playlists'));
      })
    );
  }
}

@Injectable({ providedIn: 'root' })
export class GetPublicPlaylistsUseCase {
  private readonly repository = inject(PlaylistRepositoryImpl);

  execute(page: number = 1, pageSize: number = 10): Observable<PaginatedPlaylistResponse> {
    const filters: PlaylistFilters = {
      is_public: true,
      page,
      page_size: pageSize
    };

    return this.repository.getPlaylists(filters).pipe(
      catchError(error => {
        console.error('Error getting public playlists:', error);
        return throwError(() => new Error('No se pudieron cargar las playlists públicas'));
      })
    );
  }
}

@Injectable({ providedIn: 'root' })
export class DuplicatePlaylistUseCase {
  private readonly getPlaylist = inject(GetPlaylistByIdUseCase);
  private readonly createPlaylist = inject(CreatePlaylistUseCase);

  execute(playlistId: string, newName?: string): Observable<Playlist> {
    return this.getPlaylist.execute(playlistId).pipe(
      switchMap((originalPlaylist: PlaylistWithSongs) => {
        const duplicateData: CreatePlaylistDto = {
          name: newName || `${originalPlaylist.name} (Copia)`,
          description: originalPlaylist.description,
          is_public: false
        };
        return this.createPlaylist.execute(duplicateData);
      }),
      catchError(error => {
        console.error('Error duplicating playlist:', error);
        return throwError(() => new Error('No se pudo duplicar la playlist'));
      })
    );
  }
}
