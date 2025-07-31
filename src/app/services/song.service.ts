import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "./api.service";
import { Song, SearchFilters, PaginatedResponse } from "../models";

@Injectable({
  providedIn: "root",
})
export class SongService {
  private endpoint = "/songs";

  constructor(private apiService: ApiService) {}

  /**
   * Obtener todas las canciones con filtros opcionales
   */
  getSongs(filters?: SearchFilters): Observable<PaginatedResponse<Song>> {
    return this.apiService.getPaginated<Song>(this.endpoint, filters);
  }

  /**
   * Obtener una canción por ID
   */
  getSongById(id: string): Observable<Song> {
    return this.apiService.get<Song>(`${this.endpoint}/${id}`);
  }

  /**
   * Buscar canciones
   */
  searchSongs(
    query: string,
    limit?: number,
    offset?: number,
  ): Observable<PaginatedResponse<Song>> {
    return this.apiService.getPaginated<Song>(`${this.endpoint}/search`, {
      query,
      limit: limit || 20,
      offset: offset || 0,
    });
  }

  /**
   * Obtener canciones populares
   */
  getPopularSongs(limit?: number): Observable<Song[]> {
    return this.apiService.get<Song[]>(`${this.endpoint}/popular`, {
      limit: limit || 50,
    });
  }

  /**
   * Obtener canciones recientes
   */
  getRecentSongs(limit?: number): Observable<Song[]> {
    return this.apiService.get<Song[]>(`${this.endpoint}/recent`, {
      limit: limit || 20,
    });
  }

  /**
   * Obtener canciones por artista
   */
  getSongsByArtist(artistId: string): Observable<Song[]> {
    return this.apiService.get<Song[]>(`${this.endpoint}/artist/${artistId}`);
  }

  /**
   * Obtener canciones por álbum
   */
  getSongsByAlbum(albumId: string): Observable<Song[]> {
    return this.apiService.get<Song[]>(`${this.endpoint}/album/${albumId}`);
  }

  /**
   * Obtener canciones por género
   */
  getSongsByGenre(
    genre: string,
    limit?: number,
    offset?: number,
  ): Observable<PaginatedResponse<Song>> {
    return this.apiService.getPaginated<Song>(
      `${this.endpoint}/genre/${genre}`,
      {
        limit: limit || 20,
        offset: offset || 0,
      },
    );
  }

  /**
   * Registrar reproducción de una canción
   */
  playSong(songId: string): Observable<void> {
    return this.apiService.post<void>(`${this.endpoint}/${songId}/play`, {});
  }

  /**
   * Dar like a una canción
   */
  likeSong(songId: string): Observable<void> {
    return this.apiService.post<void>(`${this.endpoint}/${songId}/like`, {});
  }

  /**
   * Quitar like a una canción
   */
  unlikeSong(songId: string): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${songId}/like`);
  }

  /**
   * Obtener canciones que le gustan al usuario
   */
  getLikedSongs(): Observable<Song[]> {
    return this.apiService.get<Song[]>(`${this.endpoint}/liked`);
  }

  /**
   * Obtener recomendaciones basadas en una canción
   */
  getSongRecommendations(songId: string, limit?: number): Observable<Song[]> {
    return this.apiService.get<Song[]>(
      `${this.endpoint}/${songId}/recommendations`,
      {
        limit: limit || 10,
      },
    );
  }

  /**
   * Obtener recomendaciones personalizadas para el usuario
   */
  getPersonalizedRecommendations(limit?: number): Observable<Song[]> {
    return this.apiService.get<Song[]>(`${this.endpoint}/recommendations`, {
      limit: limit || 20,
    });
  }

  /**
   * Obtener letra de una canción
   */
  getSongLyrics(songId: string): Observable<{ lyrics: string }> {
    return this.apiService.get<{ lyrics: string }>(
      `${this.endpoint}/${songId}/lyrics`,
    );
  }

  /**
   * Subir una nueva canción (para artistas/administradores)
   */
  uploadSong(file: File, songData?: any): Observable<Song> {
    return this.apiService.upload<Song>(
      `${this.endpoint}/upload`,
      file,
      songData,
    );
  }

  /**
   * Actualizar información de una canción
   */
  updateSong(songId: string, songData: Partial<Song>): Observable<Song> {
    return this.apiService.put<Song>(`${this.endpoint}/${songId}`, songData);
  }

  /**
   * Eliminar una canción
   */
  deleteSong(songId: string): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${songId}`);
  }

  /**
   * Obtener historial de reproducción del usuario
   */
  getPlayHistory(
    limit?: number,
    offset?: number,
  ): Observable<PaginatedResponse<Song>> {
    return this.apiService.getPaginated<Song>(`${this.endpoint}/history`, {
      limit: limit || 50,
      offset: offset || 0,
    });
  }

  /**
   * Limpiar historial de reproducción
   */
  clearPlayHistory(): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/history`);
  }
}
