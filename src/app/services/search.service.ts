import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Song, Artist, Album, Playlist, SearchFilters } from '../models';

export interface SearchResults {
  songs: Song[];
  artists: Artist[];
  albums: Album[];
  playlists: Playlist[];
  total: number;
}

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private endpoint = '/search';

  constructor(private apiService: ApiService) {}

  /**
   * Búsqueda general en toda la plataforma
   */
  searchAll(query: string, limit?: number): Observable<SearchResults> {
    return this.apiService.get<SearchResults>(this.endpoint, {
      query,
      limit: limit || 20,
    });
  }

  /**
   * Búsqueda específica por tipo
   */
  searchByType(
    query: string,
    type: 'song' | 'artist' | 'album' | 'playlist',
    limit?: number,
    offset?: number,
  ): Observable<any> {
    return this.apiService.get(`${this.endpoint}/${type}`, {
      query,
      limit: limit || 20,
      offset: offset || 0,
    });
  }

  /**
   * Búsqueda avanzada con filtros
   */
  advancedSearch(filters: SearchFilters): Observable<SearchResults> {
    return this.apiService.get<SearchResults>(
      `${this.endpoint}/advanced`,
      filters,
    );
  }

  /**
   * Obtener sugerencias de búsqueda
   */
  getSearchSuggestions(query: string, limit?: number): Observable<string[]> {
    return this.apiService.get<string[]>(`${this.endpoint}/suggestions`, {
      query,
      limit: limit || 10,
    });
  }

  /**
   * Obtener búsquedas populares
   */
  getPopularSearches(limit?: number): Observable<string[]> {
    return this.apiService.get<string[]>(`${this.endpoint}/popular`, {
      limit: limit || 10,
    });
  }

  /**
   * Obtener historial de búsquedas del usuario
   */
  getSearchHistory(limit?: number): Observable<string[]> {
    return this.apiService.get<string[]>(`${this.endpoint}/history`, {
      limit: limit || 20,
    });
  }

  /**
   * Limpiar historial de búsquedas
   */
  clearSearchHistory(): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/history`);
  }

  /**
   * Guardar búsqueda en el historial
   */
  saveSearchToHistory(query: string): Observable<void> {
    return this.apiService.post<void>(`${this.endpoint}/history`, { query });
  }

  /**
   * Búsqueda por género
   */
  searchByGenre(
    genre: string,
    type?: 'song' | 'artist' | 'album',
    limit?: number,
  ): Observable<any> {
    const endpoint = type
      ? `${this.endpoint}/genre/${genre}/${type}`
      : `${this.endpoint}/genre/${genre}`;
    return this.apiService.get(endpoint, { limit: limit || 20 });
  }

  /**
   * Búsqueda rápida (para autocompletado)
   */
  quickSearch(
    query: string,
    limit?: number,
  ): Observable<{
    songs: Song[];
    artists: Artist[];
    albums: Album[];
  }> {
    return this.apiService.get(`${this.endpoint}/quick`, {
      query,
      limit: limit || 5,
    });
  }
}
