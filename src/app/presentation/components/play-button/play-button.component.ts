import { Component, Input, Output, EventEmitter, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Song } from '@app/domain/entities/song.entity';
import { PlayerUseCase } from '@app/domain/usecases/player/player.usecases';

@Component({
  selector: 'app-play-button',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  template: `
    <button 
      mat-fab
      [color]="primary ? 'primary' : 'accent'"
      (click)="onPlay()"
      [disabled]="!song"
      [matTooltip]="tooltipText()"
      class="play-btn"
      [class.mini]="mini"
      [class.compact]="compact"
    >
      <mat-icon>{{ playIcon() }}</mat-icon>
    </button>
  `,
  styles: [`
    .play-btn {
      transition: all 0.3s ease;
    }
    
    .play-btn.mini {
      transform: scale(0.8);
    }
    
    .play-btn.compact {
      width: 40px;
      height: 40px;
      min-height: 40px;
    }
    
    .play-btn:hover {
      transform: scale(1.05);
    }
    
    .play-btn.mini:hover {
      transform: scale(0.85);
    }
  `]
})
export class PlayButtonComponent {
  @Input() song: Song | null = null;
  @Input() mini = false;
  @Input() compact = false;
  @Input() primary = false;
  @Output() playClicked = new EventEmitter<Song>();

  private readonly playerUseCase = inject(PlayerUseCase);

  readonly playIcon = computed(() => {
    return this.mini || this.compact ? 'play_arrow' : 'play_circle_filled';
  });

  readonly tooltipText = computed(() => {
    return this.song ? `Reproducir "${this.song.title}"` : 'Selecciona una canción';
  });

  onPlay(): void {
    if (!this.song) return;

    console.log(`🎵 PlayButton: Playing song "${this.song.title}"`);
    this.playClicked.emit(this.song);
    
    // También puedes usar directamente el PlayerUseCase
    this.playerUseCase.playSong(this.song);
  }
}