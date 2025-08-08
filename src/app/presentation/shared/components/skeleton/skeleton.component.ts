import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

export type SkeletonType = 'card' | 'text' | 'avatar' | 'button' | 'chip' | 'image';
export type SkeletonSize = 'small' | 'medium' | 'large';
export type SkeletonTheme = 'light' | 'dark' | 'auto';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatChipsModule],
  template: `
    <div 
      class="skeleton-element"
      [class]="getSkeletonClasses()"
      [style.width]="width"
      [style.height]="height"
      [style.border-radius]="borderRadius">
    </div>
  `,
  styleUrls: ['./skeleton.component.css']
})
export class SkeletonComponent {
  @Input() type: SkeletonType = 'text';
  @Input() size: SkeletonSize = 'medium';
  @Input() theme: SkeletonTheme = 'auto';
  @Input() width?: string;
  @Input() height?: string;
  @Input() borderRadius?: string;
  @Input() animated: boolean = true;
  @Input() count: number = 1;

  getSkeletonClasses(): string {
    const classes = [
      'skeleton',
      `skeleton-${this.type}`,
      `skeleton-${this.size}`,
      `skeleton-${this.theme}`
    ];

    if (this.animated) {
      classes.push('skeleton-animated');
    }

    return classes.join(' ');
  }
}
