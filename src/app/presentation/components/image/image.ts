import { NgOptimizedImage } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-image',
  imports: [NgOptimizedImage],
  templateUrl: './image.html',
  styleUrl: './image.css',
})
export class Image {
  src = input.required<string>();
  alt = input.required<string>();
  width = input.required<number>();
  height = input.required<number>();
  className = input.required<string>();
}
