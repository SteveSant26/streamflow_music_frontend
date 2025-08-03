import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: "app-greeting",
  imports: [TranslateModule],
  templateUrl: "./greeting.html",
  styleUrl: "./greeting.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Greeting implements OnInit {
  greetingKey = "";
  greetingParams = { name: 'Justin' };

  ngOnInit(): void {
    this.setGreeting();
  }

  private setGreeting(): void {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();

    if (currentHour < 12) {
      this.greetingKey = 'GREETING.GOOD_MORNING';
    } else if (currentHour < 18) {
      this.greetingKey = 'GREETING.GOOD_AFTERNOON';
    } else {
      this.greetingKey = 'GREETING.GOOD_EVENING';
    }
  }
}
