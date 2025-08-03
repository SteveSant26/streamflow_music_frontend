import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Card } from '../../components/card/card';
import { Greeting } from '../../components/greeting/greeting';
import { MusicsTable } from '../../components/musics-table/musics-table';
import { PlayListItemCard } from '../../components/play-list-item-card/play-list-item-card';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { 
  GetMostPopularSongsUseCase, 
  GetRandomSongsUseCase,
  PlayRandomPlaylistUseCase,
  PlayPopularPlaylistUseCase 
} from '../../domain/usecases/song/song.usecases';
import { Song } from '../../domain/entities/song.entity';

import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Card } from '../../components/card/card';
import { Greeting } from '../../components/greeting/greeting';
import { MusicsTable } from '../../components/musics-table/musics-table';
import { PlayListItemCard } from '../../components/play-list-item-card/play-list-item-card';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { 
  GetMostPopularSongsUseCase, 
  GetRandomSongsUseCase,
  PlayRandomPlaylistUseCase,
  PlayPopularPlaylistUseCase 
} from '../../domain/usecases/song/song.usecases';
import { Song } from '../../domain/entities/song.entity';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    Card,
    Greeting,
    MusicsTable,
    PlayListItemCard,
    MatIcon,
    TranslateModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent implements OnInit {
  // Servicios inyectados
  private readonly getMostPopularUseCase = inject(GetMostPopularSongsUseCase);
  private readonly getRandomSongsUseCase = inject(GetRandomSongsUseCase);
  private readonly playRandomPlaylistUseCase = inject(PlayRandomPlaylistUseCase);
  private readonly playPopularPlaylistUseCase = inject(PlayPopularPlaylistUseCase);

  // Signals para el estado del componente
  readonly popularSongs = signal<Song[]>([]);
  readonly randomSongs = signal<Song[]>([]);
  readonly loading = signal(true);

  // Datos mock para las playlists (mantenemos algunos como ejemplo)
  featuredPlaylists = [
    {
      id: 1,
      title: 'Hits del Rock',
      cover: '/assets/playlists/playlist1.jpg',
      artists: ['Queen', 'Led Zeppelin', 'The Beatles'],
      action: () => this.playPopularPlaylist()
    },
    {
      id: 2,
      title: 'Mix Aleatorio',
      cover: '/assets/playlists/playlist2.webp',
      artists: ['Varios Artistas'],
      action: () => this.playRandomPlaylist()
    },
    {
      id: 3,
      title: 'Descubrimientos',
      cover: '/assets/playlists/playlist3.jpg',
      artists: ['Nuevos Artistas'],
      action: () => this.loadRandomSongs()
    },
    {
      id: 4,
      title: 'Tendencias',
      cover: '/assets/playlists/playlist4.jpg',
      artists: ['Top Charts'],
      action: () => this.loadPopularSongs()
    },
  ];

  ngOnInit(): void {
    this.loadHomeData();
  }

  private loadHomeData(): void {
    this.loading.set(true);

    // Cargar canciones populares
    this.getMostPopularUseCase.execute({ page_size: 10 }).subscribe({
      next: (songs) => {
        this.popularSongs.set(songs);
      },
      error: (error) => {
        console.error('Error al cargar canciones populares:', error);
        this.popularSongs.set([]);
      }
    });

    // Cargar canciones aleatorias
    this.getRandomSongsUseCase.execute({ page_size: 8 }).subscribe({
      next: (songs) => {
        this.randomSongs.set(songs);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar canciones aleatorias:', error);
        this.randomSongs.set([]);
        this.loading.set(false);
      }
    });
  }

  // Métodos para acciones de playlist
  playPopularPlaylist(): void {
    this.playPopularPlaylistUseCase.execute(20).subscribe({
      next: (songs) => {
        console.log(`Reproduciendo playlist popular con ${songs.length} canciones`);
      },
      error: (error) => {
        console.error('Error al reproducir playlist popular:', error);
      }
    });
  }

  playRandomPlaylist(): void {
    this.playRandomPlaylistUseCase.execute(20).subscribe({
      next: (songs) => {
        console.log(`Reproduciendo playlist aleatoria con ${songs.length} canciones`);
      },
      error: (error) => {
        console.error('Error al reproducir playlist aleatoria:', error);
      }
    });
  }

  loadPopularSongs(): void {
    this.getMostPopularUseCase.execute({ page_size: 15 }).subscribe({
      next: (songs) => {
        this.popularSongs.set(songs);
        console.log(`Cargadas ${songs.length} canciones populares`);
      },
      error: (error) => {
        console.error('Error al cargar más canciones populares:', error);
      }
    });
  }

  loadRandomSongs(): void {
    this.getRandomSongsUseCase.execute({ page_size: 15 }).subscribe({
      next: (songs) => {
        this.randomSongs.set(songs);
        console.log(`Cargadas ${songs.length} canciones aleatorias`);
      },
      error: (error) => {
        console.error('Error al cargar más canciones aleatorias:', error);
      }
    });
  }

  // Método para refrescar toda la data
  refreshHomeData(): void {
    this.loadHomeData();
  }
}
