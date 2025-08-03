import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { Song } from '@app/domain/entities/song.entity';
import { MusicsTable } from '@app/presentation/components/music/musics-table/musics-table';

export type MusicSectionType = 'grid' | 'table';

export interface MusicSectionButton {
  icon?: string;
  text?: string;
  action: () => void;
  ariaLabel?: string;
}

@Component({
  selector: 'app-music-section',
  standalone: true,
  imports: [CommonModule, MatIconModule, TranslateModule, MusicsTable],
  templateUrl: './music-section.html',
  styleUrls: ['./music-section.css']
})
export class MusicSectionComponent {
  @Input() title = '';
  @Input() titleIcon = '';
  @Input() songs: Song[] = [];
  @Input() loading = false;
  @Input() type: MusicSectionType = 'grid';
  @Input() primaryButton?: MusicSectionButton;
  @Input() actionButtons: MusicSectionButton[] = [];
  @Input() showPlayCount = true;
  @Input() emptyMessage = 'No se pudieron cargar las canciones';
  @Input() loadingMessage = 'Cargando música...';
  
  @Output() songSelected = new EventEmitter<Song>();
  @Output() retryLoad = new EventEmitter<void>();

  onSongClick(song: Song): void {
    this.songSelected.emit(song);
  }

  onRetryClick(): void {
    this.retryLoad.emit();
  }

  formatPlayCount(count: number): string {
    if (count >= 1000000) {
      return Math.floor(count / 1000000) + 'M';
    } else if (count >= 1000) {
      return Math.floor(count / 1000) + 'K';
    }
    return count.toString();
  }
}
