import { Component } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./login.html",
  styleUrls: ["./login.css"],
})
export class LoginComponent {
  constructor(private readonly router: Router) {}

  onLogin() {
    // Basic login functionality - navigate to home for now
    console.log("Login attempted");
    this.router.navigate(["/home"]);
  }
}
