import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Playlist,
  PlaylistWithSongs,
  PlaylistSong,
  CreatePlaylistDto,
  UpdatePlaylistDto,
  AddSongToPlaylistDto,
  PlaylistFilters,
  LegacyPlaylist,
  PaginatedPlaylistResponse,
  PaginatedPlaylistSongResponse,
  PlaylistDomainEvent
} from '../../domain/entities/playlist.entity';
import { PlaylistStateService } from '../../domain/services/playlist-state.service';
import { 
  GetLegacyPlaylistByIdUseCase,
  GetPlaylistSongsUseCase,
  DuplicatePlaylistUseCase
} from '../../domain/usecases/playlist/playlist.usecases';

/**
 * Facade service that provides a simplified interface for playlist operations.
 * This service acts as a single entry point for all playlist-related functionality.
 */
@Injectable({
  providedIn: 'root'
})
export class PlaylistFacadeService {
  private readonly playlistStateService = inject(PlaylistStateService);
  private readonly getLegacyPlaylistUseCase = inject(GetLegacyPlaylistByIdUseCase);
  private readonly getPlaylistSongsUseCase = inject(GetPlaylistSongsUseCase);
  private readonly duplicatePlaylistUseCase = inject(DuplicatePlaylistUseCase);

  // Expose state as readonly observables
  readonly userPlaylists = this.playlistStateService.userPlaylists;
  readonly publicPlaylists = this.playlistStateService.publicPlaylists;
  readonly currentPlaylist = this.playlistStateService.currentPlaylist;
  readonly selectedPlaylistId = this.playlistStateService.selectedPlaylistId;
  readonly isLoading = this.playlistStateService.isLoading;
  readonly error = this.playlistStateService.error;
  readonly searchResults = this.playlistStateService.searchResults;
  readonly hasUserPlaylists = this.playlistStateService.hasUserPlaylists;
  readonly hasPublicPlaylists = this.playlistStateService.hasPublicPlaylists;
  readonly hasSearchResults = this.playlistStateService.hasSearchResults;
  readonly isPlaylistSelected = this.playlistStateService.isPlaylistSelected;
  readonly currentPlaylistSongCount = this.playlistStateService.currentPlaylistSongCount;
  readonly filteredUserPlaylists = this.playlistStateService.filteredUserPlaylists;
  readonly domainEvents$ = this.playlistStateService.domainEvents$;

  // Playlist CRUD Operations
  
  /**
   * Load user's playlists with optional filters
   */
  async loadUserPlaylists(filters?: PlaylistFilters): Promise<void> {
    return this.playlistStateService.loadUserPlaylists(filters);
  }

  /**
   * Load public playlists with pagination
   */
  async loadPublicPlaylists(page: number = 1, pageSize: number = 10): Promise<void> {
    return this.playlistStateService.loadPublicPlaylists(page, pageSize);
  }

  /**
   * Select and load a specific playlist
   */
  async selectPlaylist(playlistId: string): Promise<void> {
    return this.playlistStateService.selectPlaylist(playlistId);
  }

  /**
   * Create a new playlist
   */
  async createPlaylist(data: CreatePlaylistDto): Promise<Playlist | null> {
    return this.playlistStateService.createPlaylist(data);
  }

  /**
   * Update an existing playlist
   */
  async updatePlaylist(id: string, data: UpdatePlaylistDto): Promise<Playlist | null> {
    return this.playlistStateService.updatePlaylist(id, data);
  }

  /**
   * Delete a playlist
   */
  async deletePlaylist(id: string): Promise<boolean> {
    return this.playlistStateService.deletePlaylist(id);
  }

  /**
   * Duplicate a playlist
   */
  async duplicatePlaylist(playlistId: string, newName?: string): Promise<Playlist | null> {
    try {
      const duplicatedPlaylist = await this.duplicatePlaylistUseCase.execute(playlistId, newName).toPromise();
      
      if (duplicatedPlaylist) {
        // Reload user playlists to include the new one
        await this.loadUserPlaylists();
        return duplicatedPlaylist;
      }
      
      return null;
    } catch (error) {
      console.error('Error duplicating playlist:', error);
      return null;
    }
  }

  // Song Operations

  /**
   * Get songs from a specific playlist with pagination
   */
  getPlaylistSongs(playlistId: string, page?: number, pageSize?: number): Observable<PaginatedPlaylistSongResponse> {
    return this.getPlaylistSongsUseCase.execute(playlistId, page, pageSize);
  }

  /**
   * Add a song to a playlist
   */
  async addSongToPlaylist(playlistId: string, data: AddSongToPlaylistDto): Promise<boolean> {
    return this.playlistStateService.addSongToPlaylist(playlistId, data);
  }

  /**
   * Remove a song from a playlist
   */
  async removeSongFromPlaylist(playlistId: string, songId: string): Promise<boolean> {
    return this.playlistStateService.removeSongFromPlaylist(playlistId, songId);
  }

  // Search and Filter Operations

  /**
   * Search playlists by term and filters
   */
  async searchPlaylists(searchTerm: string, filters?: Omit<PlaylistFilters, 'search'>): Promise<void> {
    return this.playlistStateService.searchPlaylists(searchTerm, filters);
  }

  /**
   * Set filters for playlist lists
   */
  setFilters(filters: PlaylistFilters): void {
    this.playlistStateService.setFilters(filters);
  }

  /**
   * Clear search results
   */
  clearSearch(): void {
    this.playlistStateService.clearSearch();
  }

  // Legacy Support

  /**
   * Get playlist in legacy format for backward compatibility
   */
  getLegacyPlaylist(id: string): Observable<LegacyPlaylist> {
    return this.getLegacyPlaylistUseCase.execute(id);
  }

  // Utility Operations

  /**
   * Clear current playlist selection
   */
  clearCurrentPlaylist(): void {
    this.playlistStateService.clearCurrentPlaylist();
  }

  /**
   * Clear any error state
   */
  clearError(): void {
    this.playlistStateService.clearError();
  }

  /**
   * Check if a playlist belongs to the current user
   */
  isUserPlaylist(playlistId: string): boolean {
    return this.userPlaylists().some(playlist => playlist.id === playlistId);
  }

  /**
   * Get a specific playlist from the user's playlists
   */
  getUserPlaylistById(playlistId: string): Playlist | undefined {
    return this.userPlaylists().find(playlist => playlist.id === playlistId);
  }

  /**
   * Get playlist statistics
   */
  getPlaylistStats() {
    const userPlaylists = this.userPlaylists();
    const totalSongs = userPlaylists.reduce((sum, playlist) => sum + playlist.total_songs, 0);
    const publicPlaylistsCount = userPlaylists.filter(playlist => playlist.is_public).length;
    
    return {
      totalPlaylists: userPlaylists.length,
      totalSongs,
      publicPlaylistsCount,
      privatePlaylistsCount: userPlaylists.length - publicPlaylistsCount
    };
  }

  /**
   * Bulk operations
   */
  async deleteMultiplePlaylists(playlistIds: string[]): Promise<boolean[]> {
    const results = await Promise.allSettled(
      playlistIds.map(id => this.deletePlaylist(id))
    );
    
    return results.map(result => 
      result.status === 'fulfilled' ? result.value : false
    );
  }

  /**
   * Toggle playlist visibility (public/private)
   */
  async togglePlaylistVisibility(playlistId: string): Promise<Playlist | null> {
    const playlist = this.getUserPlaylistById(playlistId);
    if (!playlist) {
      return null;
    }

    return this.updatePlaylist(playlistId, {
      is_public: !playlist.is_public
    });
  }

  /**
   * Refresh current playlist data
   */
  async refreshCurrentPlaylist(): Promise<void> {
    const currentId = this.selectedPlaylistId();
    if (currentId) {
      await this.selectPlaylist(currentId);
    }
  }

  /**
   * Subscribe to domain events with filtering
   */
  onPlaylistCreated(): Observable<Playlist> {
    return new Observable(observer => {
      const subscription = this.domainEvents$.subscribe(event => {
        if (event?.type === 'PLAYLIST_CREATED') {
          observer.next(event.payload);
        }
      });
      
      return () => subscription.unsubscribe();
    });
  }

  onPlaylistUpdated(): Observable<Playlist> {
    return new Observable(observer => {
      const subscription = this.domainEvents$.subscribe(event => {
        if (event?.type === 'PLAYLIST_UPDATED') {
          observer.next(event.payload);
        }
      });
      
      return () => subscription.unsubscribe();
    });
  }

  onPlaylistDeleted(): Observable<{ id: string }> {
    return new Observable(observer => {
      const subscription = this.domainEvents$.subscribe(event => {
        if (event?.type === 'PLAYLIST_DELETED') {
          observer.next(event.payload);
        }
      });
      
      return () => subscription.unsubscribe();
    });
  }
}
