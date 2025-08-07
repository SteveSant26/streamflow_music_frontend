import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { DownloadService, DownloadResponse } from '../../../infrastructure/services/download.service';

@Injectable({ providedIn: 'root' })
export class DownloadSongUseCase {
  private readonly downloadService = inject(DownloadService);

  execute(songId: string): Observable<DownloadResponse> {
    return this.downloadService.downloadSong(songId);
  }
}

@Injectable({ providedIn: 'root' })
export class DownloadSongWithFormatUseCase {
  private readonly downloadService = inject(DownloadService);

  execute(songId: string, format: 'mp3' | 'flac' | 'wav' = 'mp3'): Observable<DownloadResponse> {
    return this.downloadService.downloadSongWithFormat(songId, format);
  }
}

@Injectable({ providedIn: 'root' })
export class TriggerDownloadUseCase {
  private readonly downloadService = inject(DownloadService);

  execute(downloadUrl: string, filename: string): void {
    this.downloadService.triggerDownload(downloadUrl, filename);
  }
}
