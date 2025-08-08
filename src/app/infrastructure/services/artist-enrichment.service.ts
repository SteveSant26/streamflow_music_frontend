import { Injectable } from '@angular/core';
import { Observable, of, forkJoin } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Song } from '../../domain/entities/song.entity';
import { Artist } from '../../domain/entities/artist.entity';

@Injectable({
  providedIn: 'root'
})
export class ArtistEnrichmentService {

  constructor() { }

  /**
   * Enriquece una canción con información completa del artista
   */
  enrichSongWithArtistInfo(song: Song, artistService?: any): Observable<Song> {
    if (!song.artist && song.artist_id && artistService) {
      // Si tenemos el ID del artista pero no la información completa
      return artistService.getArtistById(song.artist_id).pipe(
        map((artist: Artist) => ({
          ...song,
          artist,
          artist_name: artist.name
        })),
        catchError(() => of(song)) // Si falla, devuelve la canción original
      );
    }

    return of(song);
  }

  /**
   * Enriquece una lista de canciones con información de artistas
   */
  enrichSongsWithArtistInfo(songs: Song[], artistService?: any): Observable<Song[]> {
    if (!artistService) {
      return of(songs);
    }

    const enrichmentRequests = songs.map(song => 
      this.enrichSongWithArtistInfo(song, artistService)
    );

    return forkJoin(enrichmentRequests);
  }

  /**
   * Obtiene el nombre del artista de una canción, manejando diferentes formatos
   */
  getArtistName(song: Song): string {
    return song.artist_name || song.artist?.name || 'Unknown Artist';
  }

  /**
   * Obtiene el ID del artista de una canción
   */
  getArtistId(song: Song): string | null {
    return song.artist_id || song.artist?.id || null;
  }

  /**
   * Verifica si el artista tiene verificación
   */
  isArtistVerified(song: Song): boolean {
    return song.artist?.is_verified || song.artist?.verified || false;
  }

  /**
   * Obtiene la imagen del artista si está disponible
   */
  getArtistImage(song: Song): string | null {
    return song.artist?.image_url || null;
  }

  /**
   * Obtiene la biografía del artista si está disponible
   */
  getArtistBiography(song: Song): string | null {
    return song.artist?.biography || null;
  }

  /**
   * Obtiene el número de seguidores del artista
   */
  getArtistFollowers(song: Song): number {
    return song.artist?.followers_count || 0;
  }
}
