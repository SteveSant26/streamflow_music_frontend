import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { LyricsService, SongLyricsResponse, UpdateLyricsResponse } from '../../../infrastructure/services/lyrics.service';

@Injectable({ providedIn: 'root' })
export class GetSongLyricsUseCase {
  private readonly lyricsService = inject(LyricsService);

  execute(songId: string, fetchIfMissing: boolean = true): Observable<SongLyricsResponse> {
    return this.lyricsService.getSongLyrics(songId, fetchIfMissing);
  }
}

@Injectable({ providedIn: 'root' })
export class UpdateSongLyricsUseCase {
  private readonly lyricsService = inject(LyricsService);

  execute(songId: string, forceUpdate: boolean = false): Observable<UpdateLyricsResponse> {
    return this.lyricsService.updateSongLyrics(songId, forceUpdate);
  }
}
