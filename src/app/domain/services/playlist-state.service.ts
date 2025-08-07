import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, BehaviorSubject, combineLatest, map } from 'rxjs';
import {
  Playlist,
  PlaylistWithSongs,
  PlaylistFilters,
  CreatePlaylistDto,
  UpdatePlaylistDto,
  AddSongToPlaylistDto,
  PaginatedPlaylistResponse,
  PlaylistDomainEvent
} from '../../domain/entities/playlist.entity';
import {
  GetPlaylistsUseCase,
  GetUserPlaylistsUseCase,
  GetPlaylistByIdUseCase,
  CreatePlaylistUseCase,
  UpdatePlaylistUseCase,
  DeletePlaylistUseCase,
  AddSongToPlaylistUseCase,
  RemoveSongFromPlaylistUseCase,
  SearchPlaylistsUseCase,
  GetPublicPlaylistsUseCase
} from '../../domain/usecases/playlist/playlist.usecases';

interface PlaylistState {
  userPlaylists: Playlist[];
  publicPlaylists: Playlist[];
  currentPlaylist: PlaylistWithSongs | null;
  selectedPlaylistId: string | null;
  isLoading: boolean;
  error: string | null;
  searchResults: Playlist[];
  filters: PlaylistFilters;
}

@Injectable({
  providedIn: 'root'
})
export class PlaylistStateService {
  private readonly getUserPlaylistsUseCase = inject(GetUserPlaylistsUseCase);
  private readonly getPlaylistByIdUseCase = inject(GetPlaylistByIdUseCase);
  private readonly createPlaylistUseCase = inject(CreatePlaylistUseCase);
  private readonly updatePlaylistUseCase = inject(UpdatePlaylistUseCase);
  private readonly deletePlaylistUseCase = inject(DeletePlaylistUseCase);
  private readonly addSongToPlaylistUseCase = inject(AddSongToPlaylistUseCase);
  private readonly removeSongFromPlaylistUseCase = inject(RemoveSongFromPlaylistUseCase);
  private readonly searchPlaylistsUseCase = inject(SearchPlaylistsUseCase);
  private readonly getPublicPlaylistsUseCase = inject(GetPublicPlaylistsUseCase);

  // State using signals
  private readonly state = signal<PlaylistState>({
    userPlaylists: [],
    publicPlaylists: [],
    currentPlaylist: null,
    selectedPlaylistId: null,
    isLoading: false,
    error: null,
    searchResults: [],
    filters: {}
  });

  // Domain events
  private readonly domainEventsSubject$ = new BehaviorSubject<PlaylistDomainEvent | null>(null);

  // Computed signals
  readonly userPlaylists = computed(() => this.state().userPlaylists);
  readonly publicPlaylists = computed(() => this.state().publicPlaylists);
  readonly currentPlaylist = computed(() => this.state().currentPlaylist);
  readonly selectedPlaylistId = computed(() => this.state().selectedPlaylistId);
  readonly isLoading = computed(() => this.state().isLoading);
  readonly error = computed(() => this.state().error);
  readonly searchResults = computed(() => this.state().searchResults);
  readonly filters = computed(() => this.state().filters);

  // Derived computed signals
  readonly hasUserPlaylists = computed(() => this.userPlaylists().length > 0);
  readonly hasPublicPlaylists = computed(() => this.publicPlaylists().length > 0);
  readonly hasSearchResults = computed(() => this.searchResults().length > 0);
  readonly isPlaylistSelected = computed(() => this.selectedPlaylistId() !== null);
  readonly currentPlaylistSongCount = computed(() => this.currentPlaylist()?.total_songs || 0);

  // Filtered playlists
  readonly filteredUserPlaylists = computed(() => {
    const playlists = this.userPlaylists();
    const filters = this.filters();
    
    if (!filters.name) return playlists;
    
    return playlists.filter(playlist => 
      playlist.name.toLowerCase().includes(filters.name!.toLowerCase())
    );
  });

  // Observable streams
  readonly domainEvents$ = this.domainEventsSubject$.asObservable();

  // Actions
  async loadUserPlaylists(filters?: PlaylistFilters): Promise<void> {
    this.setLoading(true);
    this.setError(null);

    try {
      const playlists = await this.getUserPlaylistsUseCase.execute(filters).toPromise();
      this.updateState({ userPlaylists: playlists || [] });
    } catch (error) {
      this.setError('Error al cargar las playlists del usuario');
      console.error('Error loading user playlists:', error);
    } finally {
      this.setLoading(false);
    }
  }

  async loadPublicPlaylists(page: number = 1, pageSize: number = 10): Promise<void> {
    this.setLoading(true);
    this.setError(null);

    try {
      const response = await this.getPublicPlaylistsUseCase.execute(page, pageSize).toPromise();
      this.updateState({ publicPlaylists: response?.results || [] });
    } catch (error) {
      this.setError('Error al cargar las playlists públicas');
      console.error('Error loading public playlists:', error);
    } finally {
      this.setLoading(false);
    }
  }

  async selectPlaylist(playlistId: string): Promise<void> {
    if (this.selectedPlaylistId() === playlistId && this.currentPlaylist()) {
      return; // Ya está seleccionada
    }

    this.setLoading(true);
    this.setError(null);

    try {
      const playlist = await this.getPlaylistByIdUseCase.execute(playlistId).toPromise();
      this.updateState({ 
        currentPlaylist: playlist || null,
        selectedPlaylistId: playlistId 
      });
    } catch (error) {
      this.setError('Error al cargar la playlist');
      console.error('Error selecting playlist:', error);
    } finally {
      this.setLoading(false);
    }
  }

  async createPlaylist(data: CreatePlaylistDto): Promise<Playlist | null> {
    this.setLoading(true);
    this.setError(null);

    try {
      const newPlaylist = await this.createPlaylistUseCase.execute(data).toPromise();
      
      if (newPlaylist) {
        // Agregar a la lista de playlists del usuario
        const currentPlaylists = this.userPlaylists();
        this.updateState({ userPlaylists: [...currentPlaylists, newPlaylist] });
        
        // Emitir evento de dominio
        this.emitDomainEvent({
          type: 'PLAYLIST_CREATED',
          payload: newPlaylist
        });

        return newPlaylist;
      }
      
      return null;
    } catch (error) {
      this.setError('Error al crear la playlist');
      console.error('Error creating playlist:', error);
      return null;
    } finally {
      this.setLoading(false);
    }
  }

  async updatePlaylist(id: string, data: UpdatePlaylistDto): Promise<Playlist | null> {
    this.setLoading(true);
    this.setError(null);

    try {
      const updatedPlaylist = await this.updatePlaylistUseCase.execute(id, data).toPromise();
      
      if (updatedPlaylist) {
        // Actualizar en la lista de playlists del usuario
        const currentPlaylists = this.userPlaylists();
        const updatedPlaylists = currentPlaylists.map(playlist => 
          playlist.id === id ? updatedPlaylist : playlist
        );
        this.updateState({ userPlaylists: updatedPlaylists });
        
        // Actualizar playlist actual si está seleccionada
        if (this.selectedPlaylistId() === id && this.currentPlaylist()) {
          this.updateState({ 
            currentPlaylist: { ...this.currentPlaylist()!, ...updatedPlaylist } 
          });
        }
        
        // Emitir evento de dominio
        this.emitDomainEvent({
          type: 'PLAYLIST_UPDATED',
          payload: updatedPlaylist
        });

        return updatedPlaylist;
      }
      
      return null;
    } catch (error) {
      this.setError('Error al actualizar la playlist');
      console.error('Error updating playlist:', error);
      return null;
    } finally {
      this.setLoading(false);
    }
  }

  async deletePlaylist(id: string): Promise<boolean> {
    this.setLoading(true);
    this.setError(null);

    try {
      await this.deletePlaylistUseCase.execute(id).toPromise();
      
      // Remover de la lista de playlists del usuario
      const currentPlaylists = this.userPlaylists();
      const filteredPlaylists = currentPlaylists.filter(playlist => playlist.id !== id);
      this.updateState({ userPlaylists: filteredPlaylists });
      
      // Limpiar playlist actual si es la que se eliminó
      if (this.selectedPlaylistId() === id) {
        this.updateState({ 
          currentPlaylist: null,
          selectedPlaylistId: null 
        });
      }
      
      // Emitir evento de dominio
      this.emitDomainEvent({
        type: 'PLAYLIST_DELETED',
        payload: { id }
      });

      return true;
    } catch (error) {
      this.setError('Error al eliminar la playlist');
      console.error('Error deleting playlist:', error);
      return false;
    } finally {
      this.setLoading(false);
    }
  }

  async addSongToPlaylist(playlistId: string, data: AddSongToPlaylistDto): Promise<boolean> {
    this.setLoading(true);
    this.setError(null);

    try {
      const addedSong = await this.addSongToPlaylistUseCase.execute(playlistId, data).toPromise();
      
      if (addedSong) {
        // Actualizar playlist actual si está seleccionada
        if (this.selectedPlaylistId() === playlistId && this.currentPlaylist()) {
          const currentPlaylist = this.currentPlaylist()!;
          this.updateState({ 
            currentPlaylist: {
              ...currentPlaylist,
              songs: [...currentPlaylist.songs, addedSong],
              total_songs: currentPlaylist.total_songs + 1
            }
          });
        }
        
        // Actualizar contador en la lista de playlists del usuario
        const currentPlaylists = this.userPlaylists();
        const updatedPlaylists = currentPlaylists.map(playlist => 
          playlist.id === playlistId 
            ? { ...playlist, total_songs: playlist.total_songs + 1 }
            : playlist
        );
        this.updateState({ userPlaylists: updatedPlaylists });
        
        // Emitir evento de dominio
        const playlist = this.userPlaylists().find(p => p.id === playlistId);
        if (playlist) {
          this.emitDomainEvent({
            type: 'SONG_ADDED_TO_PLAYLIST',
            payload: { playlist, song: addedSong }
          });
        }

        return true;
      }
      
      return false;
    } catch (error) {
      this.setError('Error al agregar la canción a la playlist');
      console.error('Error adding song to playlist:', error);
      return false;
    } finally {
      this.setLoading(false);
    }
  }

  async removeSongFromPlaylist(playlistId: string, songId: string): Promise<boolean> {
    this.setLoading(true);
    this.setError(null);

    try {
      await this.removeSongFromPlaylistUseCase.execute(playlistId, songId).toPromise();
      
      // Actualizar playlist actual si está seleccionada
      if (this.selectedPlaylistId() === playlistId && this.currentPlaylist()) {
        const currentPlaylist = this.currentPlaylist()!;
        const filteredSongs = currentPlaylist.songs.filter(song => song.id !== songId);
        this.updateState({ 
          currentPlaylist: {
            ...currentPlaylist,
            songs: filteredSongs,
            total_songs: currentPlaylist.total_songs - 1
          }
        });
      }
      
      // Actualizar contador en la lista de playlists del usuario
      const currentPlaylists = this.userPlaylists();
      const updatedPlaylists = currentPlaylists.map(playlist => 
        playlist.id === playlistId 
          ? { ...playlist, total_songs: Math.max(0, playlist.total_songs - 1) }
          : playlist
      );
      this.updateState({ userPlaylists: updatedPlaylists });
      
      // Emitir evento de dominio
      this.emitDomainEvent({
        type: 'SONG_REMOVED_FROM_PLAYLIST',
        payload: { playlistId, songId }
      });

      return true;
    } catch (error) {
      this.setError('Error al remover la canción de la playlist');
      console.error('Error removing song from playlist:', error);
      return false;
    } finally {
      this.setLoading(false);
    }
  }

  async searchPlaylists(searchTerm: string, filters?: Omit<PlaylistFilters, 'search'>): Promise<void> {
    if (!searchTerm.trim()) {
      this.updateState({ searchResults: [] });
      return;
    }

    this.setLoading(true);
    this.setError(null);

    try {
      const results = await this.searchPlaylistsUseCase.execute(searchTerm, filters).toPromise();
      this.updateState({ searchResults: results || [] });
    } catch (error) {
      this.setError('Error al buscar playlists');
      console.error('Error searching playlists:', error);
    } finally {
      this.setLoading(false);
    }
  }

  // Utility methods
  clearSearch(): void {
    this.updateState({ searchResults: [] });
  }

  clearError(): void {
    this.setError(null);
  }

  clearCurrentPlaylist(): void {
    this.updateState({ 
      currentPlaylist: null, 
      selectedPlaylistId: null 
    });
  }

  setFilters(filters: PlaylistFilters): void {
    this.updateState({ filters });
  }

  // Private methods
  private setLoading(isLoading: boolean): void {
    this.updateState({ isLoading });
  }

  private setError(error: string | null): void {
    this.updateState({ error });
  }

  private updateState(partialState: Partial<PlaylistState>): void {
    this.state.update(currentState => ({ ...currentState, ...partialState }));
  }

  private emitDomainEvent(event: PlaylistDomainEvent): void {
    this.domainEventsSubject$.next(event);
  }
}
