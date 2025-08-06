import { Component, inject, input, output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Playlist, CreatePlaylistDto, UpdatePlaylistDto } from '../../../domain/entities/playlist.entity';
import { PlaylistFacadeService } from '../../../domain/services/playlist-facade.service';
import { PlaylistMapper } from '../../../domain/mappers/playlist.mapper';

@Component({
  selector: 'app-playlist-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="playlist-form">
      <!-- Header -->
      <div class="form-header">
        <h2 class="form-title">
          {{ isEditMode() ? 'Editar Playlist' : 'Nueva Playlist' }}
        </h2>
        <button 
          class="close-btn"
          (click)="onCancel()"
          type="button">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- Form -->
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form-content">
        <!-- Name field -->
        <div class="field-group">
          <label for="name" class="field-label">
            Nombre *
          </label>
          <input
            id="name"
            type="text"
            formControlName="name"
            class="field-input"
            [class.error]="isFieldInvalid('name')"
            placeholder="Ingresa el nombre de la playlist"
            maxlength="255"
          />
          <div class="field-error" *ngIf="isFieldInvalid('name')">
            <span *ngIf="form.get('name')?.errors?.['required']">
              El nombre es requerido
            </span>
            <span *ngIf="form.get('name')?.errors?.['maxlength']">
              El nombre no puede exceder 255 caracteres
            </span>
          </div>
          <div class="field-hint">
            {{ form.get('name')?.value?.length || 0 }}/255 caracteres
          </div>
        </div>

        <!-- Description field -->
        <div class="field-group">
          <label for="description" class="field-label">
            Descripción
          </label>
          <textarea
            id="description"
            formControlName="description"
            class="field-textarea"
            [class.error]="isFieldInvalid('description')"
            placeholder="Descripción opcional de la playlist"
            rows="3"
            maxlength="1000"
          ></textarea>
          <div class="field-error" *ngIf="isFieldInvalid('description')">
            <span *ngIf="form.get('description')?.errors?.['maxlength']">
              La descripción no puede exceder 1000 caracteres
            </span>
          </div>
          <div class="field-hint">
            {{ form.get('description')?.value?.length || 0 }}/1000 caracteres
          </div>
        </div>

        <!-- Visibility field -->
        <div class="field-group">
          <div class="checkbox-group">
            <label class="checkbox-label">
              <input
                type="checkbox"
                formControlName="is_public"
                class="checkbox-input"
              />
              <span class="checkbox-text">
                <i class="fas" [class.fa-globe]="form.get('is_public')?.value" [class.fa-lock]="!form.get('is_public')?.value"></i>
                Hacer pública esta playlist
              </span>
            </label>
          </div>
          <div class="field-hint">
            {{ form.get('is_public')?.value ? 'Otros usuarios podrán ver esta playlist' : 'Solo tú podrás ver esta playlist' }}
          </div>
        </div>

        <!-- Action buttons -->
        <div class="form-actions">
          <button 
            type="button"
            class="btn btn-secondary"
            (click)="onCancel()"
            [disabled]="isSubmitting()">
            Cancelar
          </button>
          <button 
            type="submit"
            class="btn btn-primary"
            [disabled]="form.invalid || isSubmitting()">
            <i class="fas fa-sync fa-spin" *ngIf="isSubmitting()"></i>
            <i class="fas fa-save" *ngIf="!isSubmitting()"></i>
            {{ isEditMode() ? 'Guardar Cambios' : 'Crear Playlist' }}
          </button>
        </div>
      </form>

      <!-- Error message -->
      <div class="error-banner" *ngIf="error() && !isSubmitting()">
        <i class="fas fa-exclamation-triangle"></i>
        <span>{{ error() }}</span>
        <button class="error-close" (click)="clearError()">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .playlist-form {
      @apply bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md mx-auto;
    }

    .form-header {
      @apply flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700;
    }

    .form-title {
      @apply text-xl font-semibold text-gray-900 dark:text-white;
    }

    .close-btn {
      @apply p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-md;
      @apply hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors;
    }

    .form-content {
      @apply p-6 space-y-6;
    }

    .field-group {
      @apply space-y-2;
    }

    .field-label {
      @apply block text-sm font-medium text-gray-700 dark:text-gray-300;
    }

    .field-input, .field-textarea {
      @apply w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md;
      @apply bg-white dark:bg-gray-700 text-gray-900 dark:text-white;
      @apply focus:ring-2 focus:ring-blue-500 focus:border-transparent;
      @apply placeholder-gray-400 dark:placeholder-gray-500;
    }

    .field-input.error, .field-textarea.error {
      @apply border-red-500 ring-2 ring-red-200 dark:ring-red-800;
    }

    .field-error {
      @apply text-sm text-red-600 dark:text-red-400;
    }

    .field-hint {
      @apply text-xs text-gray-500 dark:text-gray-400;
    }

    .checkbox-group {
      @apply flex items-start;
    }

    .checkbox-label {
      @apply flex items-center cursor-pointer;
    }

    .checkbox-input {
      @apply mr-3 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500;
    }

    .checkbox-text {
      @apply text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2;
    }

    .form-actions {
      @apply flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700;
    }

    .btn {
      @apply px-4 py-2 rounded-md font-medium transition-colors duration-200;
      @apply flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed;
    }

    .btn-primary {
      @apply bg-blue-600 text-white hover:bg-blue-700 disabled:hover:bg-blue-600;
    }

    .btn-secondary {
      @apply bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200;
      @apply hover:bg-gray-400 dark:hover:bg-gray-500 disabled:hover:bg-gray-300 dark:disabled:hover:bg-gray-600;
    }

    .error-banner {
      @apply mx-6 mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md;
      @apply flex items-center gap-3 text-red-700 dark:text-red-300;
    }

    .error-close {
      @apply ml-auto text-red-400 hover:text-red-600 dark:hover:text-red-200;
    }
  `]
})
export class PlaylistFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly playlistFacade = inject(PlaylistFacadeService);

  // Inputs
  readonly playlist = input<Playlist | null>(null);
  readonly isVisible = input<boolean>(false);

  // Outputs
  readonly playlistSaved = output<Playlist>();
  readonly formCancelled = output<void>();

  // Form
  form!: FormGroup;

  // State
  readonly error = this.playlistFacade.error;
  isSubmitting = input<boolean>(false);

  // Computed
  isEditMode(): boolean {
    return this.playlist() !== null;
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.markAllFieldsAsTouched();
      return;
    }

    if (this.isEditMode()) {
      this.updatePlaylist();
    } else {
      this.createPlaylist();
    }
  }

  onCancel(): void {
    this.resetForm();
    this.formCancelled.emit();
  }

  clearError(): void {
    this.playlistFacade.clearError();
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  private initializeForm(): void {
    const playlist = this.playlist();

    this.form = this.fb.group({
      name: [
        playlist?.name || '',
        [Validators.required, Validators.maxLength(255)]
      ],
      description: [
        playlist?.description || '',
        [Validators.maxLength(1000)]
      ],
      is_public: [playlist?.is_public || false]
    });

    // Validate form data
    if (playlist) {
      const errors = PlaylistMapper.validateUpdatePlaylist(this.form.value);
      if (errors.length > 0) {
        console.warn('Validation errors in playlist data:', errors);
      }
    }
  }

  private async createPlaylist(): Promise<void> {
    const formValue = this.form.value;
    const createData: CreatePlaylistDto = {
      name: formValue.name.trim(),
      description: formValue.description?.trim() || undefined,
      is_public: formValue.is_public || false
    };

    try {
      const result = await this.playlistFacade.createPlaylist(createData);
      if (result) {
        this.playlistSaved.emit(result);
        this.resetForm();
      }
    } catch (error) {
      console.error('Error creating playlist:', error);
    }
  }

  private async updatePlaylist(): Promise<void> {
    const playlist = this.playlist();
    if (!playlist) return;

    const formValue = this.form.value;
    const updateData: UpdatePlaylistDto = {
      name: formValue.name.trim(),
      description: formValue.description?.trim() || undefined,
      is_public: formValue.is_public || false
    };

    try {
      const result = await this.playlistFacade.updatePlaylist(playlist.id, updateData);
      if (result) {
        this.playlistSaved.emit(result);
        this.resetForm();
      }
    } catch (error) {
      console.error('Error updating playlist:', error);
    }
  }

  private resetForm(): void {
    this.form.reset();
    this.clearError();
  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.form.controls).forEach(key => {
      this.form.get(key)?.markAsTouched();
    });
  }
}
