import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ROUTES_CONFIG_SITE, ROUTES_CONFIG_SUBSCRIPTION } from '@app/config/routes-config';

@Component({
  selector: 'app-subscription-success',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subscription-success.component.html',
  styleUrl: './subscription-success.component.css'
})
export class SubscriptionSuccessComponent implements OnInit {
  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    // Aquí podrías manejar el session_id si necesitas verificar el pago
    const sessionId = this.route.snapshot.queryParams['session_id'];
    if (sessionId) {
      console.log('Session ID:', sessionId);
      // Podrías llamar a un servicio para verificar el estado del pago
    }
  }

  goToHome(): void {
    this.router.navigate([ROUTES_CONFIG_SITE.HOME.path]);
  }

  manageSubscription(): void {
    this.router.navigate([ROUTES_CONFIG_SUBSCRIPTION.MANAGEMENT.path]);
  }
}
