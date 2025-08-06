import { Injectable, signal } from '@angular/core';

export type ViewMode = 'list' | 'table';

@Injectable({
  providedIn: 'root'
})
export class ViewModeService {
  private readonly STORAGE_KEY = 'music_view_mode';
  
  // Signal para el modo de vista global
  private _viewMode = signal<ViewMode>(this.getInitialViewMode());
  
  // Getter público para el signal
  public readonly viewMode = this._viewMode.asReadonly();

  constructor() {}

  /**
   * Obtiene el modo de vista inicial desde localStorage o usa 'list' como default
   */
  private getInitialViewMode(): ViewMode {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return (stored === 'list' || stored === 'table') ? stored as ViewMode : 'list';
    } catch {
      return 'list';
    }
  }

  /**
   * Cambia el modo de vista y lo persiste en localStorage
   */
  public setViewMode(mode: ViewMode): void {
    console.log('🔄 ViewModeService: Changing view mode from', this._viewMode(), 'to', mode);
    this._viewMode.set(mode);
    try {
      localStorage.setItem(this.STORAGE_KEY, mode);
      console.log('💾 ViewModeService: Saved to localStorage:', mode);
    } catch (error) {
      console.warn('No se pudo guardar el modo de vista:', error);
    }
  }

  /**
   * Alterna entre los modos de vista
   */
  public toggleViewMode(): void {
    const currentMode = this._viewMode();
    const newMode: ViewMode = currentMode === 'list' ? 'table' : 'list';
    this.setViewMode(newMode);
  }

  /**
   * Verifica si el modo actual es 'list'
   */
  public isListMode(): boolean {
    return this._viewMode() === 'list';
  }

  /**
   * Verifica si el modo actual es 'table'
   */
  public isTableMode(): boolean {
    return this._viewMode() === 'table';
  }
}
