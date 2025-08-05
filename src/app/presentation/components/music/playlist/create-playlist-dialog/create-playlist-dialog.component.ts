import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { signal } from '@angular/core';

import { CreatePlaylistUseCase } from '../../../../../domain/usecases/playlist/playlist.usecases';
import { CreatePlaylistDto } from '../../../../../domain/entities/playlist.entity';

@Component({
  selector: 'app-create-playlist-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="create-playlist-dialog">
      <h2 mat-dialog-title>
        <mat-icon>playlist_add</mat-icon>
        Crear Nueva Playlist
      </h2>
      
      <form [formGroup]="playlistForm" (ngSubmit)="onSubmit()" mat-dialog-content>
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Nombre de la playlist</mat-label>
          <input 
            matInput 
            formControlName="name"
            placeholder="Mi nueva playlist..."
            maxlength="100"
            required>
          <mat-hint align="end">{{playlistForm.get('name')?.value?.length || 0}}/100</mat-hint>
          <mat-error *ngIf="playlistForm.get('name')?.hasError('required')">
            El nombre es requerido
          </mat-error>
          <mat-error *ngIf="playlistForm.get('name')?.hasError('minlength')">
            El nombre debe tener al menos 2 caracteres
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Descripción (opcional)</mat-label>
          <textarea 
            matInput 
            formControlName="description"
            placeholder="Describe tu playlist..."
            rows="3"
            maxlength="500"></textarea>
          <mat-hint align="end">{{playlistForm.get('description')?.value?.length || 0}}/500</mat-hint>
        </mat-form-field>

        <div class="privacy-section">
          <mat-checkbox formControlName="is_public" class="privacy-checkbox">
            <span class="checkbox-label">
              <mat-icon>{{playlistForm.get('is_public')?.value ? 'public' : 'lock'}}</mat-icon>
              {{playlistForm.get('is_public')?.value ? 'Playlist pública' : 'Playlist privada'}}
            </span>
          </mat-checkbox>
          <p class="privacy-description">
            {{playlistForm.get('is_public')?.value 
              ? 'Cualquier usuario podrá ver y reproducir esta playlist.' 
              : 'Solo tú podrás ver y reproducir esta playlist.'}}
          </p>
        </div>
      </form>

      <div mat-dialog-actions class="actions">
        <button 
          mat-button 
          type="button"
          (click)="onCancel()"
          [disabled]="isLoading()">
          Cancelar
        </button>
        
        <button 
          mat-raised-button 
          color="primary"
          type="submit"
          (click)="onSubmit()"
          [disabled]="playlistForm.invalid || isLoading()">
          <mat-spinner diameter="20" *ngIf="isLoading()"></mat-spinner>
          <mat-icon *ngIf="!isLoading()">add</mat-icon>
          {{isLoading() ? 'Creando...' : 'Crear Playlist'}}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .create-playlist-dialog {
      min-width: 400px;
      max-width: 500px;
    }

    h2 {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 0 0 1rem 0;
      font-weight: 600;
      color: var(--primary-color, #1976d2);
    }

    mat-dialog-content {
      padding: 0 1.5rem;
    }

    .w-full {
      width: 100%;
      margin-bottom: 1rem;
    }

    .privacy-section {
      margin: 1.5rem 0;
      padding: 1rem;
      background: var(--surface-variant, #f5f5f5);
      border-radius: 8px;
      border: 1px solid var(--outline-variant, #e0e0e0);
    }

    .privacy-checkbox {
      margin-bottom: 0.5rem;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 500;
    }

    .privacy-description {
      margin: 0.5rem 0 0 0;
      font-size: 0.875rem;
      color: var(--on-surface-variant, #666);
      line-height: 1.4;
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
      padding: 1rem 1.5rem 0;
      margin: 0;
    }

    button[mat-raised-button] {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      min-width: 140px;
      justify-content: center;
    }

    mat-spinner {
      margin-right: 0.5rem;
    }

    /* Dark mode support */
    :host-context(.dark-theme) .privacy-section {
      background: var(--surface-variant-dark, #2c2c2c);
      border-color: var(--outline-variant-dark, #404040);
    }

    :host-context(.dark-theme) .privacy-description {
      color: var(--on-surface-variant-dark, #b3b3b3);
    }
  `]
})
export class CreatePlaylistDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<CreatePlaylistDialogComponent>);
  private readonly createPlaylistUseCase = inject(CreatePlaylistUseCase);

  isLoading = signal(false);

  playlistForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    description: ['', [Validators.maxLength(500)]],
    is_public: [false]
  });

  onSubmit() {
    if (this.playlistForm.valid && !this.isLoading()) {
      this.isLoading.set(true);
      
      const formValue = this.playlistForm.value;
      const playlistData: CreatePlaylistDto = {
        name: formValue.name!.trim(),
        description: formValue.description?.trim() || undefined,
        is_public: formValue.is_public || false
      };

      this.createPlaylistUseCase.execute(playlistData).subscribe({
        next: (playlist) => {
          this.isLoading.set(false);
          this.dialogRef.close(playlist);
        },
        error: (error) => {
          this.isLoading.set(false);
          console.error('Error creating playlist:', error);
          // TODO: Show error message using a toast service
        }
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
