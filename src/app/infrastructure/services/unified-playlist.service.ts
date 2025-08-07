import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, catchError, of, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_CONFIG_PLAYLISTS } from '../../config/end-points/api-config-playlists';
import {
  Playlist,
  PlaylistWithSongs,
  CreatePlaylistDto,
  UpdatePlaylistDto,
  AddSongToPlaylistDto,
  PlaylistSong,
  PaginatedPlaylistResponse,
  PaginatedPlaylistSongResponse,
  PlaylistFilters
} from '../../domain/entities/playlist.entity';
import {
  PlaylistDto,
  PlaylistWithSongsDto,
  PlaylistSongDto,
  PaginatedPlaylistSongResponseDto
} from '../../domain/dtos/playlist.dto';
import { PlaylistMapper } from '../../domain/mappers/playlist.mapper';

@Injectable({
  providedIn: 'root'
})
export class UnifiedPlaylistService {
  private readonly baseUrl = environment.apiUrl;
  private playlistsCache$ = new BehaviorSubject<Playlist[]>([]);
  private publicPlaylistsCache$ = new BehaviorSubject<Playlist[]>([]);

  constructor(private readonly http: HttpClient) {}

  // ====================== USER PLAYLISTS ======================
  
  /**
   * Get user's personal playlists
   */
  getUserPlaylists(page = 1, pageSize = 20): Observable<PaginatedPlaylistResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString());

    return this.http.get<PlaylistDto[]>(
      `${this.baseUrl}${API_CONFIG_PLAYLISTS.myPlaylists.list}`,
      { params }
    ).pipe(
      map(response => {
        console.log('📋 Raw API response for user playlists:', response);
        const playlists = response.map(PlaylistMapper.dtoToEntity);
        this.playlistsCache$.next(playlists);
        
        return {
          count: playlists.length,
          next: null,
          previous: null,
          results: playlists
        };
      }),
      catchError((error: any) => {
        console.error('❌ Error loading user playlists:', error);
        return of({
          count: 0,
          next: null,
          previous: null,
          results: []
        });
      })
    );
  }

  /**
   * Get public playlists with pagination and scroll infinito
   */
  getPublicPlaylists(
    page = 1, 
    pageSize = 4, 
    filters?: PlaylistFilters
  ): Observable<PaginatedPlaylistResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString())
      .set('is_public', 'true');

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get<any>(
      `${this.baseUrl}${API_CONFIG_PLAYLISTS.publicPlaylists.list}`,
      { params }
    ).pipe(
      map(response => {
        console.log('🌍 Raw API response for public playlists:', response);
        
        // Si la respuesta es paginada
        if (response.results) {
          const playlists = response.results.map(PlaylistMapper.dtoToEntity);
          
          // Para el slider, solo mantenemos las primeras 4
          if (pageSize === 4) {
            this.publicPlaylistsCache$.next(playlists);
          }
          
          return {
            count: response.count,
            next: response.next,
            previous: response.previous,
            results: playlists
          };
        }
        
        // Si la respuesta es un array directo
        const playlists = response.map(PlaylistMapper.dtoToEntity);
        return {
          count: playlists.length,
          next: null,
          previous: null,
          results: playlists
        };
      }),
      catchError((error: any) => {
        console.error('❌ Error loading public playlists:', error);
        return of({
          count: 0,
          next: null,
          previous: null,
          results: []
        });
      })
    );
  }

  /**
   * Get playlist details with songs
   */
  getPlaylistById(id: string): Observable<PlaylistWithSongs> {
    return this.http.get<PlaylistWithSongsDto>(
      `${this.baseUrl}${API_CONFIG_PLAYLISTS.myPlaylists.getById(id)}`
    ).pipe(
      map(response => {
        console.log('🎵 Raw API response for playlist detail:', response);
        return PlaylistMapper.withSongsDtoToEntity(response);
      }),
      catchError((error: any) => {
        console.error('❌ Error loading playlist detail:', error);
        throw error;
      })
    );
  }

  /**
   * Get playlist songs with pagination for infinite scroll
   */
  getPlaylistSongs(
    playlistId: string, 
    page = 1, 
    pageSize = 20
  ): Observable<PaginatedPlaylistSongResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString());

    return this.http.get<PaginatedPlaylistSongResponseDto>(
      `${this.baseUrl}${API_CONFIG_PLAYLISTS.myPlaylists.songs.list(playlistId)}`,
      { params }
    ).pipe(
      map(response => {
        console.log('🎶 Raw API response for playlist songs:', response);
        return PlaylistMapper.fromPaginatedSongDto(response);
      }),
      catchError((error: any) => {
        console.error('❌ Error loading playlist songs:', error);
        return of({
          count: 0,
          next: null,
          previous: null,
          results: []
        });
      })
    );
  }

  // ====================== CRUD OPERATIONS ======================
  
  /**
   * Create new playlist
   */
  createPlaylist(data: CreatePlaylistDto): Observable<Playlist> {
    return this.http.post<PlaylistDto>(
      `${this.baseUrl}${API_CONFIG_PLAYLISTS.myPlaylists.create}`,
      data
    ).pipe(
      map(response => {
        console.log('✅ Playlist created:', response);
        const newPlaylist = PlaylistMapper.dtoToEntity(response);
        
        // Update cache
        const currentPlaylists = this.playlistsCache$.value;
        this.playlistsCache$.next([newPlaylist, ...currentPlaylists]);
        
        return newPlaylist;
      }),
      catchError((error: any) => {
        console.error('❌ Error creating playlist:', error);
        throw error;
      })
    );
  }

  /**
   * Update playlist
   */
  updatePlaylist(id: string, data: UpdatePlaylistDto): Observable<Playlist> {
    return this.http.put<PlaylistDto>(
      `${this.baseUrl}${API_CONFIG_PLAYLISTS.myPlaylists.update(id)}`,
      data
    ).pipe(
      map(response => {
        console.log('✅ Playlist updated:', response);
        const updatedPlaylist = PlaylistMapper.dtoToEntity(response);
        
        // Update cache
        const currentPlaylists = this.playlistsCache$.value;
        const updatedPlaylists = currentPlaylists.map(p => 
          p.id === id ? updatedPlaylist : p
        );
        this.playlistsCache$.next(updatedPlaylists);
        
        return updatedPlaylist;
      }),
      catchError((error: any) => {
        console.error('❌ Error updating playlist:', error);
        throw error;
      })
    );
  }

  /**
   * Delete playlist
   */
  deletePlaylist(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}${API_CONFIG_PLAYLISTS.myPlaylists.delete(id)}`
    ).pipe(
      map(() => {
        console.log('✅ Playlist deleted:', id);
        
        // Update cache
        const currentPlaylists = this.playlistsCache$.value;
        const updatedPlaylists = currentPlaylists.filter(p => p.id !== id);
        this.playlistsCache$.next(updatedPlaylists);
      }),
      catchError((error: any) => {
        console.error('❌ Error deleting playlist:', error);
        throw error;
      })
    );
  }

  /**
   * Add song to playlist
   */
  addSongToPlaylist(playlistId: string, songData: AddSongToPlaylistDto): Observable<PlaylistSong> {
    return this.http.post<PlaylistSongDto>(
      `${this.baseUrl}${API_CONFIG_PLAYLISTS.myPlaylists.songs.add(playlistId)}`,
      songData
    ).pipe(
      map(response => {
        console.log('✅ Song added to playlist:', response);
        return PlaylistMapper.songDtoToEntity(response);
      }),
      catchError((error: any) => {
        console.error('❌ Error adding song to playlist:', error);
        throw error;
      })
    );
  }

  /**
   * Remove song from playlist
   */
  removeSongFromPlaylist(playlistId: string, songId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}${API_CONFIG_PLAYLISTS.myPlaylists.songs.remove(playlistId, songId)}`
    ).pipe(
      map(() => {
        console.log('✅ Song removed from playlist:', { playlistId, songId });
      }),
      catchError((error: any) => {
        console.error('❌ Error removing song from playlist:', error);
        throw error;
      })
    );
  }

  // ====================== CACHE MANAGEMENT ======================
  
  /**
   * Get cached user playlists
   */
  getCachedUserPlaylists(): Observable<Playlist[]> {
    return this.playlistsCache$.asObservable();
  }

  /**
   * Get cached public playlists (for slider)
   */
  getCachedPublicPlaylists(): Observable<Playlist[]> {
    return this.publicPlaylistsCache$.asObservable();
  }

  /**
   * Clear all caches
   */
  clearCache(): void {
    this.playlistsCache$.next([]);
    this.publicPlaylistsCache$.next([]);
  }
}
