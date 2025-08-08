import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MusicsTable } from '@app/presentation/components/music';
import { ThemeDirective } from '@app/shared/directives/theme.directive';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [CommonModule, MusicsTable, ThemeDirective],
  templateUrl: './explore.html',
  styleUrl: './explore.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExploreComponent {
  genres = ['Rock', 'Pop', 'Jazz', 'Electronic', 'Hip Hop', 'Classical'];

  constructor() {}
}
