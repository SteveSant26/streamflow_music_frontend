import { MatIcon } from '@angular/material/icon';
import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Song } from '../../domain/entities/song.entity';
import { PlaySongUseCase } from '../../domain/usecases/song/song.usecases';

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
  imports: [MatIcon, TranslateModule],
  templateUrl: './musics-table-play.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MusicsTablePlay {
  @Input() song!: Song;
  @Input() isCurrentSong = false;

  private readonly playSongUseCase = inject(PlaySongUseCase);

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
    this.playSongUseCase.execute(song.id, true).subscribe({
      next: () => {
        this.currentMusic = {
          song: song,
          playlist: {
            id: song.id,
            name: `Album ${song.album || 'Desconocido'}`,
            description: `Playlist for ${song.album || 'Album desconocido'}`,
          },
          songs: [song],
        };
        this.isPlaying = true;
        console.log(`Reproduciendo: ${song.title} - ${song.artist?.name || 'Artista desconocido'}`);
      },
      error: (error) => {
        console.error('Error al reproducir canción:', error);
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
