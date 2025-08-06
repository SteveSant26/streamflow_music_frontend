import { Component, Inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Song } from '../../../domain/entities/song.entity';
import { SongLyricsComponent } from '../song-lyrics/song-lyrics.component';

export interface LyricsDialogData {
  song: Song;
}

@Component({
  selector: 'app-lyrics-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    SongLyricsComponent
  ],
  template: `
    <div class="lyrics-dialog-header">
      <h2 mat-dialog-title>Letras</h2>
      <button 
        mat-icon-button 
        (click)="close()"
        aria-label="Cerrar">
        <mat-icon>close</mat-icon>
      </button>
    </div>
    
    <mat-dialog-content class="lyrics-dialog-content">
      <app-song-lyrics 
        [song]="songSignal"
        [autoLoad]="true">
      </app-song-lyrics>
    </mat-dialog-content>
  `,
  styles: [`
    .lyrics-dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px 0 24px;
      margin: 0;
    }
    
    .lyrics-dialog-header h2 {
      margin: 0;
      flex: 1;
    }
    
    .lyrics-dialog-content {
      padding: 16px;
      max-height: none;
      overflow: visible;
    }
    
    :host ::ng-deep .lyrics-card {
      box-shadow: none;
      border: none;
    }
    
    :host ::ng-deep .lyrics-card mat-card-header {
      padding-bottom: 16px;
    }
  `]
})
export class LyricsDialogComponent implements OnInit {
  songSignal = signal<Song | null>(null);

  constructor(
    public dialogRef: MatDialogRef<LyricsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LyricsDialogData
  ) {}

  ngOnInit() {
    this.songSignal.set(this.data.song);
  }

  close() {
    this.dialogRef.close();
  }
}
