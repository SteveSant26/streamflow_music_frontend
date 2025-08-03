import {
  ChangeDetectionStrategy,
  Component,
  Output,
  EventEmitter,
  input,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-side-menu-item',
  imports: [RouterLink, TranslateModule],
  templateUrl: './side-menu-item.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideMenuItem {
  href = input.required<string>();
  @Output() click = new EventEmitter<void>();

  onClick(event: Event): void {
    if (this.href() === '#' || !this.href) {
      event.preventDefault();
      this.click.emit();
    }
  }
}
