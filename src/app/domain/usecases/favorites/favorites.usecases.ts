import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FavoritesService, FavoriteSong, PaginatedFavorites } from '../../../infrastructure/services/favorites.service';

@Injectable({
  providedIn: 'root'
})
export class FavoritesUseCase {
  constructor(private readonly favoritesService: FavoritesService) {}

  /**
   * Get user's favorite songs
   */
  getFavorites(page = 1, pageSize = 20): Observable<PaginatedFavorites> {
    return this.favoritesService.getFavorites(page, pageSize);
  }

  /**
   * Add song to favorites
   */
  addToFavorites(songId: string): Observable<FavoriteSong> {
    console.log('🎵 FavoritesUseCase: Adding song to favorites:', songId);
    return this.favoritesService.addToFavorites(songId);
  }

  /**
   * Remove song from favorites
   */
  removeFromFavorites(favoriteId: string): Observable<void> {
    console.log('🎵 FavoritesUseCase: Removing song from favorites:', favoriteId);
    return this.favoritesService.removeFromFavorites(favoriteId);
  }

  /**
   * Check if song is in favorites
   */
  isFavorite(songId: string): Observable<boolean> {
    return this.favoritesService.isFavorite(songId);
  }
}
