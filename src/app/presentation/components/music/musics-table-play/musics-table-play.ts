import { MatIcon } from '@angular/material/icon';
import { ChangeDetectionStrategy, Component, Input, inject, Output, EventEmitter } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { Song } from '@app/domain/entities/song.entity';
import { PlaySongUseCase } from '@app/domain/usecases/song/song.usecases';
import { MaterialThemeService } from '../../../../shared/services/material-theme.service';

@Component({
  selector: 'app-musics-table-play',
  imports: [MatIcon, TranslateModule, CommonModule],
  templateUrl: './musics-table-play.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MusicsTablePlay {
  @Input() song!: Song;
  @Input() isCurrentSong = false;
  @Output() playSongEvent = new EventEmitter<Song>();

  private readonly playSongUseCase = inject(PlaySongUseCase);

  constructor(private readonly materialTheme: MaterialThemeService) {}

  get isDarkTheme() {
    return this.materialTheme._isDarkMode();
  }

  handleClick(song: Song): void {
    // Emitir evento al componente padre para que maneje la reproducción con contexto
    this.playSongEvent.emit(song);
  }
}
