import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: "app-greeting",
  imports: [],
  templateUrl: './greeting.html',
  styleUrl: './greeting.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Greeting implements OnInit {
  greeting: string = '';

  ngOnInit(): void {
    this.setGreeting();
  }

  private setGreeting(): void {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();

    if (currentHour < 12) {
      this.greeting = "Buenos días, Justin";
    } else if (currentHour < 18) {
      this.greeting = "Buenas tardes, Justin";
    } else {
      this.greeting = "Buenas noches, Justin";
    }
  }
}
