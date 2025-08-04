import { Injectable } from '@angular/core';
import { Song } from '../../domain/entities/song.entity';
import { Playlist } from '../../domain/entities/playlist.entity';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MusicLibraryService {
  private songsSubject = new BehaviorSubject<Song[]>([]);
  private playlistsSubject = new BehaviorSubject<Playlist[]>([]);

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
        duration_formatted: '0:00', // Will be loaded dynamically
        duration_seconds: 0,
        file_url: '/assets/music/1.mp3',
        thumbnail_url: '/assets/gorillaz2.jpg',
        youtube_url: '',
        // Removed 'tags' property - not part of Song entity
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
        album_id: '2',
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

    const samplePlaylist: Playlist = {
      id: 'default-playlist',
      name: 'Demo Playlist',
      description: 'Una playlist de demostración',
      coverImage: 'https://picsum.photos/300/300?random=1',
      isPublic: true,
      createdDate: new Date().toISOString(),
      songCount: sampleSongs.length,
      duration: sampleSongs.reduce((total, song) => total + (song.duration_seconds || 0), 0),
      owner: {
        id: 'demo-user',
        username: 'Demo User'
      },
      songs: sampleSongs,
    };

    this.songsSubject.next(sampleSongs);
    this.playlistsSubject.next([samplePlaylist]);
  }

  getSongs(): Observable<Song[]> {
    return this.songsSubject.asObservable();
  }

  getPlaylists(): Observable<Playlist[]> {
    return this.playlistsSubject.asObservable();
  }

  getSongById(id: string): Song | undefined {
    return this.songsSubject.value.find((song) => song.id === id);
  }

  getDefaultPlaylist(): Playlist | undefined {
    return this.playlistsSubject.value.find(
      (playlist) => playlist.id === 'default-playlist',
    );
  }

  addSong(song: Song): void {
    const currentSongs = this.songsSubject.value;
    this.songsSubject.next([...currentSongs, song]);

    // Add to default playlist
    const playlists = this.playlistsSubject.value;
    const defaultPlaylist = playlists.find((p) => p.id === 'default-playlist');
    if (defaultPlaylist) {
      defaultPlaylist.songs.push(song);
      this.playlistsSubject.next([...playlists]);
    }
  }

  removeSong(songId: string): void {
    const currentSongs = this.songsSubject.value.filter(
      (song) => song.id !== songId,
    );
    this.songsSubject.next(currentSongs);

    // Remove from all playlists
    const playlists = this.playlistsSubject.value.map((playlist) => ({
      ...playlist,
      songs: playlist.songs.filter((song) => song.id !== songId),
    }));
    this.playlistsSubject.next(playlists);
  }
}
