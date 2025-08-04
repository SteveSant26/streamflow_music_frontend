import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, map } from 'rxjs';
import { Song } from '../../domain/entities/song.entity';

@Injectable({
  providedIn: 'root'
})
export class MusicLibraryService {
  private songsSubject = new BehaviorSubject<Song[]>([]);
  public songs$ = this.songsSubject.asObservable();

  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData(): void {
    // Sample songs - using available audio files (duration will be loaded dynamically)
    const sampleSongs: Song[] = [
      {
        id: '1',
        title: 'Demo Track 1',
        artist_id: '1',
        artist_name: 'Test Artist',
        album_id: '1',
        album_name: 'Demo Album',
        genre_names_display: 'Demo',
        duration_formatted: '0:00',
        duration_seconds: 0,
        file_url: '/assets/music/1.mp3',
        thumbnail_url: '/assets/gorillaz2.jpg',
        youtube_url: '',
        play_count: 0,
        youtube_view_count: 0,
        youtube_like_count: 0,
        is_explicit: false,
        audio_downloaded: true,
        created_at: new Date(),
        published_at: new Date(),
      },
      {
        id: '2',
        title: 'Demo Track 2',
        artist_id: '2',
        artist_name: 'Test Artist',
        album_id: '2',
        album_name: 'Demo Album',
        genre_names_display: 'Demo',
        duration_formatted: '0:00',
        duration_seconds: 0,
        file_url: '/assets/music/2.mp3',
        thumbnail_url: '/assets/gorillaz2.jpg',
        youtube_url: '',
        play_count: 0,
        youtube_view_count: 0,
        youtube_like_count: 0,
        is_explicit: false,
        audio_downloaded: true,
        created_at: new Date(),
        published_at: new Date(),
      },
      {
        id: 'TheNightWeMet',
        title: 'The Night We Met',
        artist_id: 'gorillaz',
        artist_name: 'Gorillaz',
        album_id: 'demo',
        album_name: 'Demo Album',
        genre_names_display: 'Alternative',
        duration_formatted: '0:00',
        duration_seconds: 0,
        file_url: '/assets/music/TheNightWeMet.mp3',
        thumbnail_url: '/assets/gorillaz2.jpg',
        youtube_url: '',
        play_count: 0,
        youtube_view_count: 0,
        youtube_like_count: 0,
        is_explicit: false,
        audio_downloaded: true,
        created_at: new Date(),
        published_at: new Date(),
      },
    ];

    this.songsSubject.next(sampleSongs);
  }

  getAllSongs(): Observable<Song[]> {
    return this.songs$;
  }

  getSongById(id: string): Observable<Song | undefined> {
    return this.songs$.pipe(
      map(songs => songs.find(song => song.id === id))
    );
  }

  getRandomSongs(count: number = 10): Observable<Song[]> {
    return this.songs$.pipe(
      map(songs => {
        const shuffled = [...songs].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
      })
    );
  }

  searchSongs(query: string): Observable<Song[]> {
    return this.songs$.pipe(
      map(songs => 
        songs.filter(song => 
          song.title.toLowerCase().includes(query.toLowerCase()) ||
          (song.artist_name && song.artist_name.toLowerCase().includes(query.toLowerCase())) ||
          (song.album_name && song.album_name.toLowerCase().includes(query.toLowerCase()))
        )
      )
    );
  }

  addSong(song: Song): void {
    const currentSongs = this.songsSubject.value;
    this.songsSubject.next([...currentSongs, song]);
  }

  updateSong(song: Song): void {
    const currentSongs = this.songsSubject.value;
    const index = currentSongs.findIndex(s => s.id === song.id);
    if (index !== -1) {
      currentSongs[index] = song;
      this.songsSubject.next([...currentSongs]);
    }
  }

  deleteSong(id: string): void {
    const currentSongs = this.songsSubject.value;
    const filteredSongs = currentSongs.filter(song => song.id !== id);
    this.songsSubject.next(filteredSongs);
  }

  // Helper method to load audio duration from actual files
  private async loadAudioDuration(audioUrl: string): Promise<number> {
    return new Promise((resolve) => {
      const audio = new Audio(audioUrl);
      audio.addEventListener('loadedmetadata', () => {
        resolve(audio.duration);
      });
      audio.addEventListener('error', () => {
        resolve(0); // Fallback if file doesn't exist
      });
    });
  }

  // Method to update durations for all songs
  async updateSongDurations(): Promise<void> {
    const songs = this.songsSubject.value;
    const updatedSongs = await Promise.all(
      songs.map(async (song) => {
        if (song.file_url) {
          const duration = await this.loadAudioDuration(song.file_url);
          return {
            ...song,
            duration_seconds: duration,
            duration_formatted: this.formatDuration(duration)
          };
        }
        return song;
      })
    );
    this.songsSubject.next(updatedSongs);
  }

  private formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}
