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
import { CommonModule } from '@angular/common';
import { ROUTES_CONFIG_MUSIC } from '@app/config/routes-config';
import { Song } from '@app/domain/entities/song.entity';
import { PlaySongUseCase } from '@app/domain/usecases/song/song.usecases';
import { MaterialThemeService } from '@app/shared/services/material-theme.service';
import { AddToPlaylistButtonComponent } from '@app/presentation/components/add-to-playlist-button/add-to-playlist-button.component';

@Component({
  selector: 'app-musics-table',
  imports: [MusicsTablePlay, MatIcon, TranslateModule, CommonModule, AddToPlaylistButtonComponent],
  templateUrl: './musics-table.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MusicsTable {
  @Input() songs: Song[] = [];

  private readonly router = inject(Router);
  private readonly playSongUseCase = inject(PlaySongUseCase);
  private readonly materialThemeService = inject(MaterialThemeService);

  // Estado del reproductor actual
  currentSong: Song | null = null;

  // Tema observables
  isDarkTheme$ = this.materialThemeService.isDarkMode();

  isCurrentSong(song: Song): boolean {
    return this.currentSong?.id === song.id;
  }

  goToSongDescription(songId: string): void {
    this.router.navigate([ROUTES_CONFIG_MUSIC.SONG.getLinkWithId(songId)]);
  }

  playSong(song: Song): void {
    this.playSongUseCase.execute(song.id, true).subscribe({
      next: () => {
        this.currentSong = song;
        console.log(`Reproduciendo: ${song.title} - ${song.artist_name || 'Artista desconocido'}`);
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
