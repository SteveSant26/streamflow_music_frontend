import { MatIcon } from '@angular/material/icon';
import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { Song } from '@app/domain/entities/song.entity';
import { PlaySongUseCase } from '@app/domain/usecases/song/song.usecases';
import { MaterialThemeService } from '../../../../shared/services/material-theme.service';

interface Playlist {
  id: string;
  name?: string;
  description?: string;
}

interface CurrentMusic {
  song: Song | null;
  playlist: Playlist | null;
  songs: Song[];
}

@Component({
  selector: 'app-musics-table-play',
  imports: [MatIcon, TranslateModule, CommonModule],
  templateUrl: './musics-table-play.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MusicsTablePlay {
  @Input() song!: Song;
  @Input() isCurrentSong = false;

  private readonly playSongUseCase = inject(PlaySongUseCase);

  constructor(private readonly materialTheme: MaterialThemeService) {}

  get isDarkTheme() {
    return this.materialTheme._isDarkMode();
  }

  // Mock state para el reproductor
  currentMusic: CurrentMusic = {
    song: null,
    playlist: null,
    songs: [],
  };
  isPlaying = false;

  isNewSongOfAnotherPlaylist(song: Song): boolean {
    return this.currentMusic.playlist?.id !== song.id;
  }

  isCurrentSongRunning(song: Song): boolean {
    return (
      this.currentMusic.song?.id === song.id &&
      this.currentMusic.playlist?.id === song.id &&
      this.isPlaying
    );
  }

  setNewCurrentMusic(song: Song): void {
    this.playSongUseCase.executeSimple(song.id, true).subscribe({
      next: (loadedSong) => {
        this.currentMusic = {
          song: loadedSong,
          playlist: {
            id: loadedSong.id,
            name: `Album ${loadedSong.album_name || 'Desconocido'}`,
            description: `Playlist for ${loadedSong.album_name || 'Album desconocido'}`,
          },
          songs: [loadedSong],
        };
        this.isPlaying = true;
        console.log(`Reproduciendo: ${loadedSong.title} - ${loadedSong.artist_name || 'Artista desconocido'}`);
      },
      error: (error) => {
        console.error('Error al reproducir canción:', error);
        this.isPlaying = false;
      }
    });
  }

  handleClick(song: Song): void {
    if (this.isCurrentSongRunning(song)) {
      this.isPlaying = false;
      return;
    }

    if (this.isNewSongOfAnotherPlaylist(song)) {
      this.setNewCurrentMusic(song);
      return;
    }

    // La playlist es la misma, pero la canción es diferente
    if (this.currentMusic.song?.id !== song.id) {
      this.currentMusic = {
        ...this.currentMusic,
        song: song,
      };
    }
    this.isPlaying = true;
  }
}
