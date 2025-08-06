import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';

import { Song } from '../../../domain/entities/song.entity';
import { LyricsDialogComponent } from './lyrics-dialog.component';

@Component({
  selector: 'app-lyrics-button',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  template: `
    <button 
      mat-icon-button 
      (click)="openLyricsDialog()"
      [disabled]="!song"
      matTooltip="Ver letras"
      class="lyrics-button">
      <mat-icon>lyrics</mat-icon>
    </button>
  `,
  styles: [`
    .lyrics-button {
      color: #1976d2;
    }
    
    .lyrics-button:hover {
      background-color: rgba(25, 118, 210, 0.1);
    }
    
    .lyrics-button:disabled {
      color: rgba(0, 0, 0, 0.26);
    }
  `]
})
export class LyricsButtonComponent {
  @Input() song: Song | null = null;
  
  private dialog = inject(MatDialog);

  openLyricsDialog() {
    if (!this.song) return;

    this.dialog.open(LyricsDialogComponent, {
      data: { song: this.song },
      width: '90vw',
      maxWidth: '800px',
      height: '80vh',
      maxHeight: '700px',
      panelClass: 'lyrics-dialog-panel'
    });
  }
}
