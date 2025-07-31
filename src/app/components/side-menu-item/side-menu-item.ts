import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-side-menu-item",
  imports: [RouterLink],
  templateUrl: "./side-menu-item.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideMenuItem {
  @Input() href = "#";
  @Output() click = new EventEmitter<void>();

  onClick(event: Event): void {
    if (this.href === "#" || !this.href) {
      event.preventDefault();
      this.click.emit();
    }
  }
}
