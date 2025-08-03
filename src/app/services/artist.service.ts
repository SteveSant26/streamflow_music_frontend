import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
  Artist,
  Album,
  Song,
  SearchFilters,
  PaginatedResponse,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class ArtistService {
  private endpoint = '/artists';

  constructor(private apiService: ApiService) {}

  /**
   * Obtener todos los artistas con filtros opcionales
   */
  getArtists(filters?: SearchFilters): Observable<PaginatedResponse<Artist>> {
    return this.apiService.getPaginated<Artist>(this.endpoint, filters);
  }

  /**
   * Obtener un artista por ID
   */
  getArtistById(id: string): Observable<Artist> {
    return this.apiService.get<Artist>(`${this.endpoint}/${id}`);
  }

  /**
   * Buscar artistas
   */
  searchArtists(
    query: string,
    limit?: number,
    offset?: number,
  ): Observable<PaginatedResponse<Artist>> {
    return this.apiService.getPaginated<Artist>(`${this.endpoint}/search`, {
      query,
      limit: limit || 20,
      offset: offset || 0,
    });
  }

  /**
   * Obtener artistas populares
   */
  getPopularArtists(limit?: number): Observable<Artist[]> {
    return this.apiService.get<Artist[]>(`${this.endpoint}/popular`, {
      limit: limit || 50,
    });
  }

  /**
   * Obtener artistas por género
   */
  getArtistsByGenre(
    genre: string,
    limit?: number,
    offset?: number,
  ): Observable<PaginatedResponse<Artist>> {
    return this.apiService.getPaginated<Artist>(
      `${this.endpoint}/genre/${genre}`,
      {
        limit: limit || 20,
        offset: offset || 0,
      },
    );
  }

  /**
   * Obtener álbumes de un artista
   */
  getArtistAlbums(artistId: string): Observable<Album[]> {
    return this.apiService.get<Album[]>(`${this.endpoint}/${artistId}/albums`);
  }

  /**
   * Obtener canciones de un artista
   */
  getArtistSongs(
    artistId: string,
    limit?: number,
    offset?: number,
  ): Observable<PaginatedResponse<Song>> {
    return this.apiService.getPaginated<Song>(
      `${this.endpoint}/${artistId}/songs`,
      {
        limit: limit || 20,
        offset: offset || 0,
      },
    );
  }

  /**
   * Obtener canciones top de un artista
   */
  getArtistTopSongs(artistId: string, limit?: number): Observable<Song[]> {
    return this.apiService.get<Song[]>(
      `${this.endpoint}/${artistId}/top-songs`,
      {
        limit: limit || 10,
      },
    );
  }

  /**
   * Seguir a un artista
   */
  followArtist(artistId: string): Observable<void> {
    return this.apiService.post<void>(
      `${this.endpoint}/${artistId}/follow`,
      {},
    );
  }

  /**
   * Dejar de seguir a un artista
   */
  unfollowArtist(artistId: string): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${artistId}/follow`);
  }

  /**
   * Obtener artistas seguidos por el usuario
   */
  getFollowedArtists(): Observable<Artist[]> {
    return this.apiService.get<Artist[]>(`${this.endpoint}/followed`);
  }

  /**
   * Obtener artistas similares
   */
  getSimilarArtists(artistId: string, limit?: number): Observable<Artist[]> {
    return this.apiService.get<Artist[]>(
      `${this.endpoint}/${artistId}/similar`,
      {
        limit: limit || 10,
      },
    );
  }

  /**
   * Verificar si el usuario sigue al artista
   */
  isFollowingArtist(artistId: string): Observable<{ isFollowing: boolean }> {
    return this.apiService.get<{ isFollowing: boolean }>(
      `${this.endpoint}/${artistId}/is-following`,
    );
  }

  /**
   * Obtener estadísticas del artista
   */
  getArtistStats(artistId: string): Observable<{
    totalSongs: number;
    totalAlbums: number;
    totalPlays: number;
    totalFollowers: number;
    monthlyListeners: number;
  }> {
    return this.apiService.get(`${this.endpoint}/${artistId}/stats`);
  }

  /**
   * Crear perfil de artista (para usuarios que quieren ser artistas)
   */
  createArtistProfile(artistData: {
    name: string;
    description?: string;
    genres?: string[];
  }): Observable<Artist> {
    return this.apiService.post<Artist>(
      `${this.endpoint}/create-profile`,
      artistData,
    );
  }

  /**
   * Actualizar perfil de artista
   */
  updateArtistProfile(
    artistId: string,
    artistData: Partial<Artist>,
  ): Observable<Artist> {
    return this.apiService.put<Artist>(
      `${this.endpoint}/${artistId}`,
      artistData,
    );
  }

  /**
   * Subir imagen de perfil del artista
   */
  uploadArtistImage(artistId: string, file: File): Observable<Artist> {
    return this.apiService.upload<Artist>(
      `${this.endpoint}/${artistId}/image`,
      [{ key: 'profile_picture', value: file }],
    );
  }

  /**
   * Obtener artistas recomendados para el usuario
   */
  getRecommendedArtists(limit?: number): Observable<Artist[]> {
    return this.apiService.get<Artist[]>(`${this.endpoint}/recommendations`, {
      limit: limit || 20,
    });
  }

  /**
   * Obtener nuevos artistas/lanzamientos
   */
  getNewArtists(limit?: number): Observable<Artist[]> {
    return this.apiService.get<Artist[]>(`${this.endpoint}/new`, {
      limit: limit || 20,
    });
  }
}
