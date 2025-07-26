import { Component } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-register",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./register.html",
  styleUrls: ["./register.css"],
})
export class RegisterComponent {
  constructor(private readonly router: Router) {}

  onRegister() {
    // Basic register functionality - navigate to home for now
    console.log("Register attempted");
    this.router.navigate(["/home"]);
  }
}
