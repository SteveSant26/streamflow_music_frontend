import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ResumePlaybackData {
  song: string;
  time: string;
  playlist?: string;
}

@Component({
  selector: 'app-resume-playback-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="resume-dialog">
      <div class="dialog-header">
        <mat-icon class="dialog-icon">play_circle_outline</mat-icon>
        <h2>Continuar Reproducción</h2>
      </div>
      
      <div class="dialog-content">
        <p class="main-message">¿Quieres continuar desde donde lo dejaste?</p>
        
        <div class="session-info">
          <div class="song-info">
            <mat-icon>music_note</mat-icon>
            <span>{{ data.song }}</span>
          </div>
          
          <div class="time-info">
            <mat-icon>schedule</mat-icon>
            <span>En {{ data.time }}</span>
          </div>
          
          <div class="playlist-info" *ngIf="data.playlist">
            <mat-icon>queue_music</mat-icon>
            <span>Playlist: {{ data.playlist }}</span>
          </div>
        </div>
      </div>
      
      <div class="dialog-actions">
        <button 
          mat-button 
          (click)="onStartFresh()"
          class="start-fresh-btn">
          <mat-icon>refresh</mat-icon>
          Empezar de Nuevo
        </button>
        
        <button 
          mat-raised-button 
          color="primary"
          (click)="onResume()"
          class="resume-btn">
          <mat-icon>play_arrow</mat-icon>
          Continuar
        </button>
      </div>
    </div>
  `,
  styles: [`
    .resume-dialog {
      padding: 24px;
      min-width: 400px;
      max-width: 500px;
    }

    .dialog-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
    }

    .dialog-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: var(--primary-color, #1976d2);
    }

    .dialog-header h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 500;
      color: var(--text-primary);
    }

    .dialog-content {
      margin-bottom: 24px;
    }

    .main-message {
      font-size: 16px;
      color: var(--text-primary);
      margin-bottom: 16px;
    }

    .session-info {
      background: var(--surface-variant, #f5f5f5);
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .song-info,
    .time-info,
    .playlist-info {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 14px;
      color: var(--text-secondary);
    }

    .song-info {
      font-weight: 500;
      color: var(--text-primary);
    }

    .song-info mat-icon {
      color: var(--primary-color, #1976d2);
    }

    .time-info mat-icon {
      color: var(--accent-color, #ff4081);
    }

    .playlist-info mat-icon {
      color: var(--secondary-color, #9c27b0);
    }

    .dialog-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }

    .start-fresh-btn {
      color: var(--text-secondary);
    }

    .resume-btn {
      background: var(--primary-color, #1976d2) !important;
      color: white !important;
    }

    .resume-btn mat-icon {
      margin-right: 8px;
    }

    .start-fresh-btn mat-icon {
      margin-right: 8px;
    }

    /* Tema oscuro */
    [data-theme="dark"] .session-info {
      background: var(--surface-variant, #2e2e2e);
    }

    [data-theme="dark"] .dialog-header h2,
    [data-theme="dark"] .main-message {
      color: var(--text-primary, #ffffff);
    }

    [data-theme="dark"] .song-info {
      color: var(--text-primary, #ffffff);
    }

    [data-theme="dark"] .time-info,
    [data-theme="dark"] .playlist-info {
      color: var(--text-secondary, #b0b0b0);
    }
  `]
})
export class ResumePlaybackDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ResumePlaybackDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ResumePlaybackData
  ) {}

  onResume(): void {
    this.dialogRef.close({ action: 'resume' });
  }

  onStartFresh(): void {
    this.dialogRef.close({ action: 'start_fresh' });
  }
}
