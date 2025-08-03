import {
  Component,
  OnInit,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslateModule } from '@ngx-translate/core';

interface Song {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: string;
  genre: string;
  releaseDate: string;
  albumCover: string;
  description: string;
  lyrics?: string;
  playCount: number;
  rating: number;
}

interface SimilarSong {
  id: number;
  title: string;
  artist: string;
  duration: string;
  albumCover: string;
}

@Component({
  selector: 'app-song-description',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDividerModule,
    MatProgressBarModule,
    TranslateModule,
  ],
  templateUrl: './song-description.html',
  styleUrls: ['./song-description.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SongDescriptionComponent implements OnInit {
  song: Song | null = null;
  similarSongs: SimilarSong[] = [];
  isPlaying = false;
  isLiked = false;
  loading = true;
  showLyrics = false;

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const songId = params['id'];
      if (songId) {
        this.loadSong(songId);
        this.loadSimilarSongs(songId);
      }
    });
  }

  private loadSong(id: string): void {
    // Simulación de datos - en producción vendría de un servicio
    setTimeout(() => {
      this.song = {
        id: parseInt(id),
        title: 'Bohemian Rhapsody',
        artist: 'Queen',
        album: 'A Night at the Opera',
        duration: '5:55',
        genre: 'Rock',
        releaseDate: '1975',
        albumCover: 'assets/gorillaz2.jpg',
        description:
          'Una obra maestra del rock progresivo que combina elementos de ópera, balada y hard rock en una composición única e innovadora.',
        lyrics: `Is this the real life?\nIs this just fantasy?\nCaught in a landslide\nNo escape from reality\nOpen your eyes\nLook up to the skies and see\nI'm just a poor boy\nI need no sympathy\nBecause I'm easy come, easy go\nLittle high, little low\nAny way the wind blows\nDoesn't really matter to me, to me...`,
        playCount: 1250000,
        rating: 4.9,
      };
      this.loading = false;
    }, 500);
  }

  private loadSimilarSongs(id: string): void {
    // Simulación de canciones similares
    setTimeout(() => {
      this.similarSongs = [
        {
          id: 2,
          title: 'We Will Rock You',
          artist: 'Queen',
          duration: '2:02',
          albumCover: 'assets/gorillazzzzz.jpg',
        },
        {
          id: 3,
          title: "Don't Stop Me Now",
          artist: 'Queen',
          duration: '3:29',
          albumCover: 'assets/gorillaz2.jpg',
        },
        {
          id: 4,
          title: 'Another One Bites the Dust',
          artist: 'Queen',
          duration: '3:36',
          albumCover: 'assets/gorillazzzzz.jpg',
        },
      ];
    }, 700);
  }

  togglePlay(): void {
    this.isPlaying = !this.isPlaying;
    console.log(
      `${this.isPlaying ? 'Reproduciendo' : 'Pausando'}: ${this.song?.title}`,
    );
  }

  toggleLike(): void {
    this.isLiked = !this.isLiked;
    console.log(
      `${this.isLiked ? 'Agregado a' : 'Removido de'} favoritos: ${this.song?.title}`,
    );
  }

  addToPlaylist(): void {
    console.log(`Agregando a playlist: ${this.song?.title}`);
  }

  downloadSong(): void {
    console.log(`Descargando: ${this.song?.title}`);
  }

  shareSong(): void {
    console.log(`Compartiendo: ${this.song?.title}`);
  }

  toggleLyrics(): void {
    this.showLyrics = !this.showLyrics;
  }

  goToArtist(): void {
    if (this.song) {
      this.router.navigate(['/artist', this.song.artist]);
    }
  }

  goToAlbum(): void {
    if (this.song) {
      this.router.navigate(['/album', this.song.album]);
    }
  }

  playSimilarSong(songId: number): void {
    this.router.navigate(['/song', songId]);
  }

  goBack(): void {
    window.history.back();
  }
}
