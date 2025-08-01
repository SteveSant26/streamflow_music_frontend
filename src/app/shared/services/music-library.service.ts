import { Injectable } from '@angular/core';
import { Song } from '../../domain/entities/song.entity';
import { Playlist } from '../../domain/entities/playlist.entity';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
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
        artist: 'Test Artist',
        duration: 0, // Will be loaded dynamically from audio file
        albumCover: '/assets/gorillaz2.jpg'
      },
      {
        id: '2',
        title: 'Demo Track 2',
        artist: 'Test Artist',
        duration: 0, // Will be loaded dynamically from audio file
        albumCover: '/assets/gorillaz2.jpg'
      },
      {
        id: '3',
        title: 'Demo Track 3',
        artist: 'Test Artist',
        duration: 0, // Will be loaded dynamically from audio file
        albumCover: '/assets/gorillazzzzz.jpg'
      },
      {
        id: 'TheNightWeMet',
        title: 'The Night We Met',
        artist: 'Gorillaz',
        duration: 0, // Will be loaded dynamically from audio file
        albumCover: '/assets/gorillaz2.jpg'
      }
    ];

    const samplePlaylist: Playlist = {
      id: 'default-playlist',
      name: 'Demo Playlist',
      songs: sampleSongs
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
    return this.songsSubject.value.find(song => song.id === id);
  }

  getDefaultPlaylist(): Playlist | undefined {
    return this.playlistsSubject.value.find(playlist => playlist.id === 'default-playlist');
  }

  addSong(song: Song): void {
    const currentSongs = this.songsSubject.value;
    this.songsSubject.next([...currentSongs, song]);
    
    // Add to default playlist
    const playlists = this.playlistsSubject.value;
    const defaultPlaylist = playlists.find(p => p.id === 'default-playlist');
    if (defaultPlaylist) {
      defaultPlaylist.songs.push(song);
      this.playlistsSubject.next([...playlists]);
    }
  }

  removeSong(songId: string): void {
    const currentSongs = this.songsSubject.value.filter(song => song.id !== songId);
    this.songsSubject.next(currentSongs);
    
    // Remove from all playlists
    const playlists = this.playlistsSubject.value.map(playlist => ({
      ...playlist,
      songs: playlist.songs.filter(song => song.id !== songId)
    }));
    this.playlistsSubject.next(playlists);
  }
}
