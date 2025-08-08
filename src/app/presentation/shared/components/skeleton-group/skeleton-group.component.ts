import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonComponent } from '../skeleton/skeleton.component';

export interface SkeletonGroupConfig {
  type: 'album' | 'artist' | 'song' | 'genre' | 'playlist';
  count: number;
  layout?: 'grid' | 'list' | 'chips';
  size?: 'small' | 'medium' | 'large';
}

@Component({
  selector: 'app-skeleton-group',
  standalone: true,
  imports: [CommonModule, SkeletonComponent],
  template: `
    <div [class]="getContainerClasses()">
      <!-- Album Skeleton -->
      <ng-container *ngIf="config.type === 'album'">
        <div class="skeleton-album-item" *ngFor="let item of getItemsArray()">
          <app-skeleton type="image" [size]="config.size || 'medium'" height="200px"></app-skeleton>
          <div class="skeleton-content">
            <app-skeleton type="text" [size]="config.size || 'medium'" width="70%"></app-skeleton>
            <app-skeleton type="text" size="small" width="50%"></app-skeleton>
            <app-skeleton type="text" size="small" width="60%"></app-skeleton>
            <app-skeleton type="text" size="small" width="40%"></app-skeleton>
            <app-skeleton type="button" [size]="config.size || 'medium'"></app-skeleton>
          </div>
        </div>
      </ng-container>

      <!-- Artist Skeleton -->
      <ng-container *ngIf="config.type === 'artist'">
        <div class="skeleton-artist-item" *ngFor="let item of getItemsArray()">
          <div class="skeleton-artist-avatar-container">
            <app-skeleton type="avatar" [size]="getAvatarSize()" width="150px" height="150px"></app-skeleton>
          </div>
          <div class="skeleton-content">
            <app-skeleton type="text" [size]="config.size || 'medium'" width="60%"></app-skeleton>
            <app-skeleton type="text" size="small" width="45%"></app-skeleton>
          </div>
        </div>
      </ng-container>

      <!-- Song Skeleton -->
      <ng-container *ngIf="config.type === 'song'">
        <div class="skeleton-song-item" *ngFor="let item of getItemsArray()">
          <app-skeleton type="image" size="small" width="50px" height="50px"></app-skeleton>
          <div class="skeleton-song-info">
            <app-skeleton type="text" [size]="config.size || 'medium'" width="70%"></app-skeleton>
            <app-skeleton type="text" size="small" width="50%"></app-skeleton>
          </div>
          <app-skeleton type="text" size="small" width="40px"></app-skeleton>
        </div>
      </ng-container>

      <!-- Genre Chips Skeleton -->
      <ng-container *ngIf="config.type === 'genre'">
        <div class="skeleton-genre-item" *ngFor="let item of getItemsArray()">
          <app-skeleton type="chip" [size]="config.size || 'medium'"></app-skeleton>
        </div>
      </ng-container>

      <!-- Playlist Skeleton -->
      <ng-container *ngIf="config.type === 'playlist'">
        <div class="skeleton-playlist-item" *ngFor="let item of getItemsArray()">
          <app-skeleton type="image" [size]="config.size || 'medium'" height="180px"></app-skeleton>
          <div class="skeleton-content">
            <app-skeleton type="text" [size]="config.size || 'medium'" width="80%"></app-skeleton>
            <app-skeleton type="text" size="small" width="60%"></app-skeleton>
            <app-skeleton type="text" size="small" width="50%"></app-skeleton>
          </div>
        </div>
      </ng-container>
    </div>
  `,
  styleUrls: ['./skeleton-group.component.css']
})
export class SkeletonGroupComponent {
  @Input() config: SkeletonGroupConfig = {
    type: 'album',
    count: 6,
    layout: 'grid',
    size: 'medium'
  };

  getItemsArray(): number[] {
    return Array(this.config.count).fill(0).map((_, i) => i);
  }

  getContainerClasses(): string {
    const baseClass = 'skeleton-group';
    const layoutClass = `skeleton-${this.config.layout || 'grid'}`;
    const typeClass = `skeleton-${this.config.type}`;
    
    return `${baseClass} ${layoutClass} ${typeClass}`;
  }

  getAvatarSize(): 'small' | 'medium' | 'large' {
    switch (this.config.size) {
      case 'small': return 'medium';
      case 'large': return 'large';
      default: return 'large';
    }
  }
}
