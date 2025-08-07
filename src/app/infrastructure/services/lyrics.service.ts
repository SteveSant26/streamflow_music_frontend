import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { API_CONFIG_LYRICS } from '../../config/end-points';
import { environment } from '../../../environments/environment';

export interface SongLyricsResponse {
  song_id: string;
  title: string;
  artist: string;
  lyrics: string | null;
  has_lyrics: boolean;
  source?: string;
}

export interface UpdateLyricsResponse {
  song_id: string;
  title: string;
  artist: string;
  updated: boolean;
  lyrics: string | null;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class LyricsService {
  private readonly http = inject(HttpClient);

  /**
   * Obtiene las letras de una canción específica
   */
  getSongLyrics(songId: string, fetchIfMissing: boolean = true): Observable<SongLyricsResponse> {
    const url = `${environment.apiUrl}${API_CONFIG_LYRICS.lyrics.getSongLyrics(songId)}`;
    const params = fetchIfMissing ? { fetch_if_missing: 'true' } : { fetch_if_missing: 'false' };
    
    return this.http.get<SongLyricsResponse>(url, { params }).pipe(
      catchError(error => {
        console.error('Error fetching lyrics:', error);
        // Retornar respuesta vacía en caso de error
        return of({
          song_id: songId,
          title: 'Unknown',
          artist: 'Unknown',
          lyrics: null,
          has_lyrics: false,
          source: undefined
        });
      })
    );
  }

  /**
   * Fuerza la actualización de letras para una canción
   */
  updateSongLyrics(songId: string, forceUpdate: boolean = false): Observable<UpdateLyricsResponse> {
    const url = `${environment.apiUrl}${API_CONFIG_LYRICS.lyrics.updateSongLyrics(songId)}`;
    const body = { force_update: forceUpdate };
    
    return this.http.post<UpdateLyricsResponse>(url, body).pipe(
      catchError(error => {
        console.error('Error updating lyrics:', error);
        throw error;
      })
    );
  }

  /**
   * Verifica si una canción tiene letras disponibles
   */
  hasLyrics(songId: string): Observable<boolean> {
    return this.getSongLyrics(songId, false).pipe(
      map(response => response.has_lyrics)
    );
  }

  /**
   * Obtiene solo el texto de las letras (sin metadata)
   */
  getLyricsText(songId: string): Observable<string | null> {
    return this.getSongLyrics(songId, true).pipe(
      map(response => response.lyrics)
    );
  }
}
