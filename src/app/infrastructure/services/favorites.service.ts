import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface FavoriteSong {
  id: string;
  song_id: string;
  user_id: string;
  added_at: string;
}

export interface PaginatedFavorites {
  count: number;
  next: string | null;
  previous: string | null;
  results: FavoriteSong[];
}

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  /**
   * Get user's favorite songs
   * GET /api/user/profile/favorites/
   */
  getFavorites(page = 1, pageSize = 20): Observable<PaginatedFavorites> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString());

    return this.http.get<PaginatedFavorites>(
      `${this.baseUrl}/api/user/profile/favorites/`,
      { params }
    );
  }

  /**
   * Add song to favorites
   * POST /api/user/profile/favorites/
   */
  addToFavorites(songId: string): Observable<FavoriteSong> {
    return this.http.post<FavoriteSong>(
      `${this.baseUrl}/api/user/profile/favorites/`,
      { song_id: songId }
    );
  }

  /**
   * Remove song from favorites
   * DELETE /api/user/profile/favorites/{id}/
   */
  removeFromFavorites(favoriteId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/api/user/profile/favorites/${favoriteId}/`
    );
  }

  /**
   * Check if song is in favorites
   * GET /api/user/profile/favorites/?song_id={songId}
   */
  isFavorite(songId: string): Observable<boolean> {
    const params = new HttpParams().set('song_id', songId);
    
    return this.http.get<PaginatedFavorites>(
      `${this.baseUrl}/api/user/profile/favorites/`,
      { params }
    ).pipe(
      map(response => response.results.length > 0)
    );
  }
}