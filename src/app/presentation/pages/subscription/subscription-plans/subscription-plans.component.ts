import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { 
  GetSubscriptionPlansUseCase, 
  GetUserSubscriptionUseCase, 
  CreateCheckoutSessionUseCase 
} from '@app/domain/usecases';
import { PaymentStateService, AuthStateService } from '@app/shared/services';
import { SubscriptionPlan } from '@app/domain/entities/payment.entity';

@Component({
  selector: 'app-subscription-plans',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './subscription-plans.component.html',
  styleUrl: './subscription-plans.component.css'
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
