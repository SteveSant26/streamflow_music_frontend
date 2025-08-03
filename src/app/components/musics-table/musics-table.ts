import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';
import { MusicsTablePlay } from '../musics-table-play/musics-table-play';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Song } from '../../domain/entities/song.entity';
import { PlaySongUseCase } from '../../domain/usecases/song/song.usecases';

@Component({
  selector: 'app-musics-table',
  imports: [MusicsTablePlay, MatIcon, TranslateModule],
  templateUrl: './musics-table.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MusicsTable {
  @Input() songs: Song[] = [];

  private readonly router = inject(Router);
  private readonly playSongUseCase = inject(PlaySongUseCase);

  // Estado del reproductor actual
  currentSong: Song | null = null;

  isCurrentSong(song: Song): boolean {
    return this.currentSong?.id === song.id;
  }

  goToSongDescription(songId: string): void {
    this.router.navigate(['/song', songId]);
  }

  playSong(song: Song): void {
    this.playSongUseCase.execute(song.id, true).subscribe({
      next: () => {
        this.currentSong = song;
        console.log(`Reproduciendo: ${song.title} - ${song.artist}`);
      },
      error: (error) => {
        console.error('Error al reproducir canción:', error);
      }
    });
  }

  formatPlayCount(plays: number): string {
    if (plays >= 1000000) {
      return `${(plays / 1000000).toFixed(1)}M`;
    }
    if (plays >= 1000) {
      return `${(plays / 1000).toFixed(1)}K`;
    }
    return plays.toString();
  }
}
