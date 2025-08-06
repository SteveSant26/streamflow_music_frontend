import { Component, ChangeDetectionStrategy, inject, signal, Output, EventEmitter } from '@angular/core';
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
  templateUrl: './search-filters.component.html',
  styleUrl: './search-filters.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchFiltersComponent {
  private readonly searchFiltersService = inject(SearchFiltersService);

  @Output() filtersChanged = new EventEmitter<void>();

  filterGroups = this.searchFiltersService.getFilterGroups();

  updateFilter(groupId: string, filterId: string, event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchFiltersService.updateFilter(groupId, filterId, target.value);
    this.filtersChanged.emit();
  }

  updateFilterValue(groupId: string, filterId: string, value: any) {
    this.searchFiltersService.updateFilter(groupId, filterId, value);
    this.filtersChanged.emit();
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
