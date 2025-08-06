import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ViewModeService } from '../../services/view-mode.service';

@Component({
  selector: 'app-view-mode-toggle',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="view-toggle bg-gray-100 rounded-lg p-1 flex">
      <button
        (click)="viewModeService.setViewMode('list')"
        [class.active]="viewModeService.viewMode() === 'list'"
        class="view-btn px-3 py-2 rounded-md text-sm font-medium transition-all"
        title="Vista de lista"
      >
        <mat-icon class="w-4 h-4">view_list</mat-icon>
      </button>
      <button
        (click)="viewModeService.setViewMode('table')"
        [class.active]="viewModeService.viewMode() === 'table'"
        class="view-btn px-3 py-2 rounded-md text-sm font-medium transition-all"
        title="Vista de tabla"
      >
        <mat-icon class="w-4 h-4">table_chart</mat-icon>
      </button>
    </div>
  `,
  styles: [`
    .view-btn {
      color: #6b7280;
      border: none;
      background: transparent;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .view-btn:hover {
      color: #3b82f6;
      background: rgba(59, 130, 246, 0.1);
    }

    .view-btn.active {
      color: #3b82f6;
      background: white;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
  `]
})
export class ViewModeToggleComponent {
  readonly viewModeService = inject(ViewModeService);
}
