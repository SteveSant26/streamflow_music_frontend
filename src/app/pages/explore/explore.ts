import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './explore.html',
  styleUrl: './explore.css'
})
export class ExploreComponent {
  genres = ['Rock', 'Pop', 'Jazz', 'Electronic', 'Hip Hop', 'Classical'];
  
  constructor() {}
}
