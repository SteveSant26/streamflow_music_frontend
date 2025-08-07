import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DownloadResponse {
  download_url: string;
  expires_at: string;
  file_size?: number;
}

@Injectable({
  providedIn: 'root'
})
export class DownloadService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  /**
   * Download a song file
   * GET /api/songs/{id}/download/
   */
  downloadSong(songId: string): Observable<DownloadResponse> {
    return this.http.get<DownloadResponse>(
      `${this.baseUrl}/api/songs/${songId}/download/`
    );
  }

  /**
   * Download song with format specification
   * GET /api/songs/{id}/download/?format={format}
   */
  downloadSongWithFormat(songId: string, format: 'mp3' | 'flac' | 'wav' = 'mp3'): Observable<DownloadResponse> {
    return this.http.get<DownloadResponse>(
      `${this.baseUrl}/api/songs/${songId}/download/`,
      { params: { format } }
    );
  }

  /**
   * Trigger actual file download in browser
   */
  triggerDownload(downloadUrl: string, filename: string): void {
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}