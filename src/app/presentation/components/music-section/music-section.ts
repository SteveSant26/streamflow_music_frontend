import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { Song } from '@app/domain/entities/song.entity';
import { MusicsTable } from '@app/presentation/components/music/musics-table/musics-table';
import { ImageFallbackDirective } from '@app/presentation/shared/directives/image-fallback.directive';

export type MusicSectionType = 'grid' | 'table' | 'list';

export interface MusicSectionButton {
  icon?: string;
  text?: string;
  action: () => void;
  ariaLabel?: string;
}

@Component({
  selector: 'app-music-section',
  standalone: true,
  imports: [CommonModule, MatIconModule, TranslateModule, MusicsTable, ImageFallbackDirective],
  templateUrl: './music-section.html',
  styleUrls: ['./music-section.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MusicSectionComponent {
  @Input() title = '';
  @Input() titleIcon = '';
  @Input() songs: Song[] = [];
  @Input() loading = false;
  
  private _type: MusicSectionType = 'grid';
  @Input() 
  set type(value: MusicSectionType) {
    console.log('🎯 MusicSection: Type changed from', this._type, 'to:', value);
    
    let displayMode: string;
    switch (value) {
      case 'grid':
        displayMode = 'GRID/CARDS';
        break;
      case 'table':
        displayMode = 'TABLE';
        break;
      case 'list':
        displayMode = 'LIST';
        break;
      default:
        displayMode = 'UNKNOWN';
    }
    
    console.log('🎯 MusicSection: Will show', displayMode);
    this._type = value;
  }
  get type(): MusicSectionType {
    return this._type;
  }
  
  @Input() primaryButton?: MusicSectionButton;
  @Input() actionButtons: MusicSectionButton[] = [];
  @Input() showPlayCount = true;
  @Input() emptyMessage = 'No se pudieron cargar las canciones';
  @Input() loadingMessage = 'Cargando música...';
  
  @Output() songSelected = new EventEmitter<Song>();
  @Output() retryLoad = new EventEmitter<void>();

  onSongClick(song: Song): void {
    console.log('🎵 MusicSection: Song clicked, current type is:', this.type);
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
