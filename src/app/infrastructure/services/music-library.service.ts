import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Song } from '../../domain/entities/song.entity';
import { GetRandomSongsUseCase, SearchSongsUseCase } from '../../domain/usecases/song/song.usecases';

@Injectable({
  providedIn: 'root'
})
export class MusicLibraryService {
  private readonly songsSubject = new BehaviorSubject<Song[]>([]);
  public songs$ = this.songsSubject.asObservable();

  private readonly getRandomSongsUseCase = inject(GetRandomSongsUseCase);
  private readonly searchSongsUseCase = inject(SearchSongsUseCase);

  constructor() {
    this.loadInitialSongs();
  }

  private loadInitialSongs(): void {
    // Cargar canciones aleatorias del backend al inicializar
    this.getRandomSongsUseCase.execute(1, 20).subscribe({
      next: (songs) => {
        this.songsSubject.next(songs);
      },
      error: (error) => {
        console.error('Error loading initial songs:', error);
        // En caso de error, mantener el array vacío
        this.songsSubject.next([]);
      }
    });
  }

  getRandomSongs(count: number = 10): Observable<Song[]> {
    return this.getRandomSongsUseCase.execute(1, count);
  }

  searchSongs(query: string): Observable<Song[]> {
    if (!query.trim()) {
      return this.songs$;
    }
    
    return this.searchSongsUseCase.execute({
      q: query.trim(),
      limit: 50
    });
  }

  getAllSongs(): Observable<Song[]> {
    return this.songs$;
  }

  getSongById(id: string): Observable<Song | undefined> {
    return this.getAllSongs().pipe(
      map(songs => songs.find(song => song.id === id))
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

  refreshSongs(): void {
    this.loadInitialSongs();
  }
}
