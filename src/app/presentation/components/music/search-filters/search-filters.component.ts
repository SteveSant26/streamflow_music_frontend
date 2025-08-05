import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatBadgeModule } from '@angular/material/badge';
import { TranslateModule } from '@ngx-translate/core';

import { SearchFiltersService, FilterGroup, SearchFilter } from '@app/infrastructure/services/search-filters.service';

@Component({
  selector: 'app-search-filters',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatBadgeModule,
    TranslateModule
  ],
  template: `
    <div class="search-filters">
      <div class="filters-header">
        <h3 class="filters-title">
          <mat-icon>tune</mat-icon>
          Filtros Avanzados
          <span 
            *ngIf="hasActiveFilters()" 
            class="active-count"
            [matBadge]="getActiveFiltersCount()"
            matBadgeColor="primary"
            matBadgeSize="small"
          ></span>
        </h3>
        
        <button 
          mat-button 
          color="warn" 
          (click)="clearFilters()"
          *ngIf="hasActiveFilters()"
          class="clear-button"
        >
          <mat-icon>clear_all</mat-icon>
          Limpiar Filtros
        </button>
      </div>

      <mat-accordion class="filters-accordion">
        <mat-expansion-panel 
          *ngFor="let group of filterGroups(); trackBy: trackByGroupId"
          [expanded]="group.expanded"
          (opened)="toggleGroup(group.id, true)"
          (closed)="toggleGroup(group.id, false)"
          class="filter-group"
        >
          <mat-expansion-panel-header>
            <mat-panel-title>
              <mat-icon>{{ group.icon }}</mat-icon>
              {{ group.name }}
              <span 
                *ngIf="getGroupActiveFiltersCount(group) > 0" 
                class="group-badge"
                [matBadge]="getGroupActiveFiltersCount(group)"
                matBadgeColor="accent"
                matBadgeSize="small"
              ></span>
            </mat-panel-title>
          </mat-expansion-panel-header>

          <div class="filter-content">
            <div 
              *ngFor="let filter of group.filters; trackBy: trackByFilterId" 
              class="filter-item"
            >
              <!-- Text Input -->
              <mat-form-field 
                *ngIf="filter.type === 'text'" 
                appearance="outline"
                class="full-width"
              >
                <mat-label>{{ filter.name }}</mat-label>
                <input 
                  matInput 
                  [placeholder]="filter.placeholder || ''"
                  [value]="filter.value || ''"
                  (input)="updateFilter(group.id, filter.id, $event)"
                >
                <mat-icon matSuffix>search</mat-icon>
              </mat-form-field>

              <!-- Select -->
              <mat-form-field 
                *ngIf="filter.type === 'select'" 
                appearance="outline"
                class="full-width"
              >
                <mat-label>{{ filter.name }}</mat-label>
                <mat-select 
                  [value]="filter.value || ''"
                  (valueChange)="updateFilterValue(group.id, filter.id, $event)"
                >
                  <mat-option 
                    *ngFor="let option of filter.options" 
                    [value]="option.value"
                  >
                    {{ option.label }}
                  </mat-option>
                </mat-select>
              </mat-form-field>

              <!-- Range -->
              <div *ngIf="filter.type === 'range'" class="range-filter">
                <label class="range-label">{{ filter.name }}</label>
                <input 
                  type="range" 
                  [min]="filter.min || 0" 
                  [max]="filter.max || 100"
                  [step]="1"
                  [value]="filter.value || filter.min || 0"
                  (input)="updateFilter(group.id, filter.id, $event)"
                  class="range-input"
                >
                <div class="range-value">
                  Valor: {{ filter.value || filter.min || 0 }}
                  <span *ngIf="filter.id.includes('duration')">
                    ({{ formatDuration(filter.value || 0) }})
                  </span>
                </div>
              </div>

              <!-- Boolean -->
              <div *ngIf="filter.type === 'boolean'" class="boolean-filter">
                <mat-checkbox 
                  [checked]="filter.value || false"
                  (change)="updateFilterValue(group.id, filter.id, $event.checked)"
                >
                  {{ filter.name }}
                </mat-checkbox>
              </div>
            </div>
          </div>
        </mat-expansion-panel>
      </mat-accordion>
    </div>
  `,
  styles: [`
    .search-filters {
      background: var(--surface-color);
      border-radius: 12px;
      padding: 1rem;
      margin-bottom: 1rem;
    }

    .filters-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .filters-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 0;
      font-size: 1.1rem;
      font-weight: 600;
    }

    .active-count {
      margin-left: 0.5rem;
    }

    .clear-button {
      font-size: 0.875rem;
    }

    .filters-accordion {
      box-shadow: none;
    }

    .filter-group {
      margin-bottom: 0.5rem;
      border-radius: 8px !important;
    }

    .filter-content {
      padding: 1rem 0;
    }

    .filter-item {
      margin-bottom: 1rem;
    }

    .full-width {
      width: 100%;
    }

    .range-filter {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .range-label {
      font-weight: 500;
      font-size: 0.875rem;
      color: var(--text-secondary);
    }

    .range-input {
      width: 100%;
      height: 4px;
      border-radius: 2px;
      background: var(--surface-variant);
      outline: none;
      appearance: none;
      cursor: pointer;
    }

    .range-input::-webkit-slider-thumb {
      appearance: none;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: var(--primary-color);
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }

    .range-input::-moz-range-thumb {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: var(--primary-color);
      cursor: pointer;
      border: none;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }

    .range-value {
      font-size: 0.75rem;
      color: var(--text-secondary);
      text-align: center;
    }

    .boolean-filter {
      display: flex;
      align-items: center;
      padding: 0.5rem 0;
    }

    .group-badge {
      margin-left: 0.5rem;
    }

    mat-panel-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchFiltersComponent {
  private readonly searchFiltersService = inject(SearchFiltersService);

  filterGroups = this.searchFiltersService.getFilterGroups();

  updateFilter(groupId: string, filterId: string, event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchFiltersService.updateFilter(groupId, filterId, target.value);
  }

  updateFilterValue(groupId: string, filterId: string, value: any) {
    this.searchFiltersService.updateFilter(groupId, filterId, value);
  }

  toggleGroup(groupId: string, expanded: boolean) {
    // No necesitamos llamar al service aquí porque mat-expansion-panel maneja el estado
  }

  clearFilters() {
    this.searchFiltersService.clearAllFilters();
  }

  hasActiveFilters(): boolean {
    return this.searchFiltersService.hasActiveFilters();
  }

  getActiveFiltersCount(): number {
    return this.searchFiltersService.getActiveFiltersCount();
  }

  getGroupActiveFiltersCount(group: FilterGroup): number {
    return group.filters.filter(filter => 
      filter.value !== undefined && filter.value !== null && filter.value !== ''
    ).length;
  }

  formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  trackByGroupId(index: number, group: FilterGroup): string {
    return group.id;
  }

  trackByFilterId(index: number, filter: SearchFilter): string {
    return filter.id;
  }
}
