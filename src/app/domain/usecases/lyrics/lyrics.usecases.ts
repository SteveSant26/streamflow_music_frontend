import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { LyricsService } from '../../../infrastructure/services/lyrics.service';

@Injectable({ providedIn: 'root' })
export class GetSongLyricsUseCase {
  private readonly lyricsService = inject(LyricsService);

  execute(songId: string): Observable<string | null> {
    return this.lyricsService.getSongLyrics(songId).pipe(
      map((response) => response.lyrics)
    );
  }
}

@Injectable({ providedIn: 'root' })
export class UpdateSongLyricsUseCase {
  private readonly lyricsService = inject(LyricsService);

  execute(songId: string, forceUpdate: boolean = false): Observable<string | null> {
    return this.lyricsService.updateSongLyrics(songId, forceUpdate).pipe(
      map((response) => response.lyrics)
    );
  }
}
