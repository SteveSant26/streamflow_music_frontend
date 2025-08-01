import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-subscription-success',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="success-container">
      <div class="success-content">
        <div class="success-icon">
          <svg viewBox="0 0 52 52">
            <circle class="success-circle" cx="26" cy="26" r="25" fill="none"/>
            <path class="success-check" fill="none" d="m14.1 27.2l7.1 7.2 16.7-16.8"/>
          </svg>
        </div>
        
        <h1>¡Suscripción exitosa!</h1>
        <p>Tu suscripción se ha activado correctamente. Ahora puedes disfrutar de todas las funciones premium.</p>
        
        <div class="success-actions">
          <button class="primary-btn" (click)="goToHome()">
            Comenzar a explorar
          </button>
          <button class="secondary-btn" (click)="manageSubscription()">
            Gestionar suscripción
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .success-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    }

    .success-content {
      text-align: center;
      max-width: 500px;
    }

    .success-icon {
      width: 80px;
      height: 80px;
      margin: 0 auto 2rem;
    }

    .success-icon svg {
      width: 100%;
      height: 100%;
    }

    .success-circle {
      stroke: #1db954;
      stroke-width: 2;
      stroke-dasharray: 158;
      stroke-dashoffset: 158;
      animation: circle 1s ease-in-out forwards;
    }

    .success-check {
      stroke: #1db954;
      stroke-width: 3;
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-dasharray: 23;
      stroke-dashoffset: 23;
      animation: check 0.5s ease-in-out 1s forwards;
    }

    @keyframes circle {
      to {
        stroke-dashoffset: 0;
      }
    }

    @keyframes check {
      to {
        stroke-dashoffset: 0;
      }
    }

    h1 {
      font-size: 2.5rem;
      color: #fff;
      margin-bottom: 1rem;
    }

    p {
      font-size: 1.2rem;
      color: #b3b3b3;
      margin-bottom: 3rem;
      line-height: 1.6;
    }

    .success-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .primary-btn {
      padding: 16px 32px;
      background: #1db954;
      color: white;
      border: none;
      border-radius: 25px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .primary-btn:hover {
      background: #1ed760;
      transform: translateY(-2px);
    }

    .secondary-btn {
      padding: 16px 32px;
      background: transparent;
      color: #1db954;
      border: 2px solid #1db954;
      border-radius: 25px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .secondary-btn:hover {
      background: #1db954;
      color: white;
    }
  `]
})
export class SubscriptionSuccessComponent implements OnInit {
  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router
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
    this.router.navigate(['/home']);
  }

  manageSubscription(): void {
    this.router.navigate(['/subscription/manage']);
  }
}
