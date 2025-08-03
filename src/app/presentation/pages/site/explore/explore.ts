import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MusicsTable } from '@app/presentation/components/music';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [CommonModule, MusicsTable],
  templateUrl: './explore.html',
  styleUrl: './explore.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExploreComponent {
  genres = ['Rock', 'Pop', 'Jazz', 'Electronic', 'Hip Hop', 'Classical'];

  constructor() {}
}
