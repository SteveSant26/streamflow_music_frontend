import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-side-menu-item',
  imports: [],
  templateUrl: './side-menu-item.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideMenuItem {
  @Input() href: string = '#';
  @Output() click = new EventEmitter<void>();

  onClick(event: Event): void {
    if (this.href === '#' || !this.href) {
      event.preventDefault();
      this.click.emit();
    }
  }
}
