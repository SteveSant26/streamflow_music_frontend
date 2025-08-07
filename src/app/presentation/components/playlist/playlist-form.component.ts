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
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      max-width: 28rem;
      margin: 0 auto;
    }

    .form-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.5rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .form-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #111827;
      margin: 0;
    }

    .close-btn {
      padding: 0.5rem;
      color: #9ca3af;
      border: none;
      background: none;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .close-btn:hover {
      color: #4b5563;
      background-color: #f3f4f6;
    }

    .form-content {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .field-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .field-label {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      color: #374151;
    }

    .field-input, .field-textarea {
      width: 100%;
      padding: 0.5rem 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      background-color: white;
      color: #111827;
      font-size: 0.875rem;
      transition: all 0.2s;
      box-sizing: border-box;
    }

    .field-input:focus, .field-textarea:focus {
      outline: none;
      ring: 2px solid #3b82f6;
      border-color: transparent;
    }

    .field-input.error, .field-textarea.error {
      border-color: #ef4444;
      ring: 2px solid rgba(239, 68, 68, 0.2);
    }

    .field-input::placeholder, .field-textarea::placeholder {
      color: #9ca3af;
    }

    .field-error {
      font-size: 0.875rem;
      color: #dc2626;
    }

    .field-hint {
      font-size: 0.75rem;
      color: #6b7280;
    }

    .checkbox-group {
      display: flex;
      align-items: flex-start;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      cursor: pointer;
    }

    .checkbox-input {
      margin-right: 0.75rem;
      height: 1rem;
      width: 1rem;
      color: #3b82f6;
      border: 1px solid #d1d5db;
      border-radius: 3px;
    }

    .checkbox-input:focus {
      ring: 2px solid #3b82f6;
    }

    .checkbox-text {
      font-size: 0.875rem;
      color: #374151;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      padding-top: 1rem;
      border-top: 1px solid #e5e7eb;
    }

    .btn {
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-weight: 500;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      border: none;
      cursor: pointer;
      font-size: 0.875rem;
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-primary {
      background-color: #3b82f6;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #2563eb;
    }

    .btn-secondary {
      background-color: #e5e7eb;
      color: #374151;
    }

    .btn-secondary:hover:not(:disabled) {
      background-color: #d1d5db;
    }

    .error-banner {
      margin: 0 1.5rem 1.5rem;
      padding: 1rem;
      background-color: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 6px;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: #b91c1c;
    }

    .error-close {
      margin-left: auto;
      color: #f87171;
      background: none;
      border: none;
      cursor: pointer;
    }

    .error-close:hover {
      color: #dc2626;
    }

    /* Dark mode styles */
    @media (prefers-color-scheme: dark) {
      .playlist-form {
        background-color: #1f2937;
      }

      .form-header {
        border-bottom-color: #374151;
      }

      .form-title {
        color: white;
      }

      .close-btn:hover {
        color: #e5e7eb;
        background-color: #374151;
      }

      .field-label {
        color: #d1d5db;
      }

      .field-input, .field-textarea {
        background-color: #374151;
        border-color: #4b5563;
        color: white;
      }

      .field-input::placeholder, .field-textarea::placeholder {
        color: #6b7280;
      }

      .checkbox-text {
        color: #d1d5db;
      }

      .form-actions {
        border-top-color: #374151;
      }

      .btn-secondary {
        background-color: #4b5563;
        color: #e5e7eb;
      }

      .btn-secondary:hover:not(:disabled) {
        background-color: #6b7280;
      }

      .error-banner {
        background-color: rgba(127, 29, 29, 0.2);
        border-color: rgba(239, 68, 68, 0.8);
        color: #fca5a5;
      }
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
