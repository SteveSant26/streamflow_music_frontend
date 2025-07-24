import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "app-greeting",
  imports: [],
  templateUrl: "./greeting.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Greeting {}
