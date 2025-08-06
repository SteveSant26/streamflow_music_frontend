import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageFallbackService {
  
  /**
   * Maneja el error de carga de imagen y establece una imagen por defecto
   */
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img && img.src !== 'assets/images/default-album.svg') {
      img.src = 'assets/images/default-album.svg';
    }
  }

  /**
   * Obtiene la URL de imagen con fallback
   */
  getImageWithFallback(imageUrl: string | null | undefined): string {
    return imageUrl || 'assets/images/default-album.svg';
  }

  /**
   * Verifica si una URL de imagen es válida
   */
  isValidImageUrl(url: string | null | undefined): boolean {
    return !!(url && url.trim() && url !== 'assets/images/default-album.svg');
  }
}
