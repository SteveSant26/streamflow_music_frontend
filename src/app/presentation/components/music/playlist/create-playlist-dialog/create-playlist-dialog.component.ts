import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
  templateUrl: './create-playlist-dialog.component.html',
  styleUrl: './create-playlist-dialog.component.css'
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
          // Show error to user through form validation
          this.playlistForm.setErrors({ 'createError': 'Error creating playlist. Please try again.' });
        }
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
