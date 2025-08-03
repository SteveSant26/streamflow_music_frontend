import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { 
  GetSubscriptionPlansUseCase, 
  GetUserSubscriptionUseCase, 
  CreateCheckoutSessionUseCase 
} from '@app/domain/usecases';
import { PaymentStateService } from '@app/domain/services/payment-state.service';
import { AuthStateService } from '@app/domain/services/auth-state-service';
import { SubscriptionPlan } from '@app/domain/entities/payment.entity';

@Component({
  selector: 'app-subscription-plans',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="subscription-plans-container">
      <div class="plans-header">
        <h1>Elige tu plan</h1>
        <p>Disfruta de música sin límites con nuestros planes premium</p>
      </div>

      <div class="billing-toggle" *ngIf="plans().length > 0">
        <button
          [class.active]="billingPeriod() === 'month'"
          (click)="setBillingPeriod('month')"
        >
          Mensual
        </button>
        <button
          [class.active]="billingPeriod() === 'year'"
          (click)="setBillingPeriod('year')"
        >
          Anual
          <span class="discount-badge">Ahorra 20%</span>
        </button>
      </div>

      <div class="plans-grid" *ngIf="!loading(); else loadingTemplate">
        <div
          *ngFor="let plan of filteredPlans()"
          class="plan-card"
          [class.current-plan]="isCurrentPlan(plan.id)"
          [class.recommended]="plan.name.toLowerCase().includes('premium')"
        >
          <div class="plan-header">
            <h3>{{ plan.name }}</h3>
            <div class="plan-price">
              <span class="amount">{{ formatPrice(plan.price) }}</span>
              <span class="period"
                >/{{ plan.interval === 'month' ? 'mes' : 'año' }}</span
              >
            </div>
            <p class="plan-description">{{ plan.description }}</p>
          </div>

          <div class="plan-features">
            <ul>
              <li *ngFor="let feature of plan.features">
                <svg class="check-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                {{ feature }}
              </li>
            </ul>
          </div>

          <div class="plan-action">
            <button
              *ngIf="!isCurrentPlan(plan.id)"
              class="subscribe-btn"
              [class.loading]="loading()"
              [disabled]="loading()"
              (click)="selectPlan(plan)"
            >
              {{
                hasActiveSubscription() ? 'Cambiar plan' : 'Seleccionar plan'
              }}
            </button>

            <button
              *ngIf="isCurrentPlan(plan.id)"
              class="current-plan-btn"
              disabled
            >
              Plan actual
            </button>
          </div>
        </div>
      </div>

      <ng-template #loadingTemplate>
        <div class="loading-state">
          <div class="loading-spinner"></div>
          <p>Cargando planes...</p>
        </div>
      </ng-template>

      <div class="error-state" *ngIf="error()">
        <p>{{ error() }}</p>
        <button (click)="loadPlans()">Reintentar</button>
      </div>
    </div>
  `,
  styles: [
    `
      .subscription-plans-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
      }

      .plans-header {
        text-align: center;
        margin-bottom: 3rem;
      }

      .plans-header h1 {
        font-size: 2.5rem;
        margin-bottom: 1rem;
        color: #fff;
      }

      .plans-header p {
        font-size: 1.2rem;
        color: #b3b3b3;
      }

      .billing-toggle {
        display: flex;
        justify-content: center;
        margin-bottom: 3rem;
        background: #2a2a2a;
        border-radius: 8px;
        padding: 4px;
        width: fit-content;
        margin-left: auto;
        margin-right: auto;
      }

      .billing-toggle button {
        padding: 12px 24px;
        border: none;
        background: transparent;
        color: #b3b3b3;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        transition: all 0.2s;
      }

      .billing-toggle button.active {
        background: #1db954;
        color: white;
      }

      .discount-badge {
        position: absolute;
        top: -8px;
        right: -8px;
        background: #ff6b6b;
        color: white;
        font-size: 0.7rem;
        padding: 2px 6px;
        border-radius: 10px;
      }

      .plans-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
        margin-bottom: 3rem;
      }

      .plan-card {
        background: #1a1a1a;
        border: 2px solid #333;
        border-radius: 12px;
        padding: 2rem;
        position: relative;
        transition: all 0.3s;
      }

      .plan-card:hover {
        border-color: #1db954;
        transform: translateY(-4px);
      }

      .plan-card.recommended::before {
        content: 'Recomendado';
        position: absolute;
        top: -12px;
        left: 50%;
        transform: translateX(-50%);
        background: #1db954;
        color: white;
        padding: 6px 16px;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
      }

      .plan-card.current-plan {
        border-color: #1db954;
        background: linear-gradient(135deg, #1a1a1a 0%, #1db954/10% 100%);
      }

      .plan-header h3 {
        font-size: 1.5rem;
        margin-bottom: 1rem;
        color: #fff;
      }

      .plan-price {
        margin-bottom: 1rem;
      }

      .plan-price .amount {
        font-size: 2.5rem;
        font-weight: 700;
        color: #1db954;
      }

      .plan-price .period {
        font-size: 1rem;
        color: #b3b3b3;
      }

      .plan-description {
        color: #b3b3b3;
        margin-bottom: 2rem;
      }

      .plan-features ul {
        list-style: none;
        padding: 0;
        margin: 0 0 2rem 0;
      }

      .plan-features li {
        display: flex;
        align-items: center;
        margin-bottom: 0.75rem;
        color: #e0e0e0;
      }

      .check-icon {
        width: 20px;
        height: 20px;
        color: #1db954;
        margin-right: 12px;
        flex-shrink: 0;
      }

      .subscribe-btn {
        width: 100%;
        padding: 16px;
        background: #1db954;
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      }

      .subscribe-btn:hover:not(:disabled) {
        background: #1ed760;
        transform: translateY(-2px);
      }

      .subscribe-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .current-plan-btn {
        width: 100%;
        padding: 16px;
        background: transparent;
        color: #1db954;
        border: 2px solid #1db954;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: 600;
      }

      .loading-state {
        text-align: center;
        padding: 3rem;
      }

      .loading-spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #333;
        border-top: 4px solid #1db954;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 1rem;
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      .error-state {
        text-align: center;
        padding: 3rem;
        color: #ff6b6b;
      }

      .error-state button {
        margin-top: 1rem;
        padding: 12px 24px;
        background: #1db954;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
      }
    `,
  ],
})
export class SubscriptionPlansComponent implements OnInit {
  readonly billingPeriod = signal<'month' | 'year'>('month');

  constructor(
    private readonly getSubscriptionPlansUseCase: GetSubscriptionPlansUseCase,
    private readonly getUserSubscriptionUseCase: GetUserSubscriptionUseCase,
    private readonly createCheckoutSessionUseCase: CreateCheckoutSessionUseCase,
    private readonly paymentStateService: PaymentStateService,
    private readonly authStateService: AuthStateService,
    private readonly router: Router,
  ) {}

  // Computed properties
  readonly plans = computed(() => this.paymentStateService.plans());
  readonly loading = computed(() => this.paymentStateService.loading());
  readonly error = computed(() => this.paymentStateService.error());
  readonly currentSubscription = computed(() =>
    this.paymentStateService.subscription(),
  );
  readonly hasActiveSubscription = computed(() =>
    this.paymentStateService.hasActiveSubscription(),
  );

  readonly filteredPlans = computed(() => {
    const allPlans = this.plans();
    const period = this.billingPeriod();
    return allPlans.filter((plan) => plan.interval === period);
  });

  ngOnInit(): void {
    this.loadPlans();
    this.loadUserSubscription();
  }

  setBillingPeriod(period: 'month' | 'year'): void {
    this.billingPeriod.set(period);
  }

  loadPlans(): void {
    this.getSubscriptionPlansUseCase.execute().subscribe();
  }

  loadUserSubscription(): void {
    const user = this.authStateService.user();
    if (user?.id) {
      this.getUserSubscriptionUseCase.execute(user.id).subscribe();
    }
  }

  isCurrentPlan(planId: string): boolean {
    return this.paymentStateService.isPlanActive(planId);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(price / 100);
  }

  async selectPlan(plan: SubscriptionPlan): Promise<void> {
    try {
      const currentUrl = window.location.origin;
      const checkoutData = {
        planId: plan.id,
        successUrl: `${currentUrl}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${currentUrl}/subscription/plans`,
        allowPromotionCodes: true,
      };

      const result = await firstValueFrom(
        this.createCheckoutSessionUseCase.execute(checkoutData),
      );

      if (result?.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      console.error('Error al crear sesión de checkout:', error);
    }
  }
}
