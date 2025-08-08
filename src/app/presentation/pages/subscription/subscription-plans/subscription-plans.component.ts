import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { TranslateModule } from '@ngx-translate/core';
import { 
  GetSubscriptionPlansUseCase, 
  GetUserSubscriptionUseCase, 
  CreateCheckoutSessionUseCase 
} from '@app/domain/usecases';
import { PaymentStateService, AuthStateService } from '@app/shared/services';
import { SubscriptionPlan } from '@app/domain/entities/payment.entity';
import { ThemeDirective } from '@app/shared/directives/theme.directive';

@Component({
  selector: 'app-subscription-plans',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    TranslateModule,
    ThemeDirective
  ],
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

  getPlanIcon(planName: string): string {
    const name = planName.toLowerCase();
    if (name.includes('free') || name.includes('gratis')) {
      return 'music_note';
    } else if (name.includes('premium') || name.includes('pro')) {
      return 'star';
    } else if (name.includes('family') || name.includes('familia')) {
      return 'group';
    } else if (name.includes('student') || name.includes('estudiante')) {
      return 'school';
    }
    return 'music_video';
  }

  getActionIcon(plan: SubscriptionPlan): string {
    if (this.hasActiveSubscription()) {
      return 'swap_horiz';
    } else {
      return 'rocket_launch';
    }
  }

  selectMonthlyPlan(): void {
    console.log('Monthly plan selected');
    // Aquí puedes agregar la lógica para crear un plan mensual
    // Por ejemplo, crear un plan mock o redirigir a Stripe
    this.createMockCheckoutSession('monthly');
  }

  selectYearlyPlan(): void {
    console.log('Yearly plan selected');
    // Aquí puedes agregar la lógica para crear un plan anual
    // Por ejemplo, crear un plan mock o redirigir a Stripe
    this.createMockCheckoutSession('yearly');
  }

  private createMockCheckoutSession(planType: string): void {
    console.log(`Processing ${planType} plan selection...`);
    
    setTimeout(() => {
      let mockCheckoutUrl: string;
      let planName: string;
      
      switch(planType) {
        case 'yearly':
          mockCheckoutUrl = 'https://checkout.stripe.com/c/pay/cs_test_yearly_plan';
          planName = 'anual';
          break;
        case 'monthly':
          mockCheckoutUrl = 'https://checkout.stripe.com/c/pay/cs_test_monthly_plan';
          planName = 'mensual';
          break;
        case 'duo':
          mockCheckoutUrl = 'https://checkout.stripe.com/c/pay/cs_test_duo_plan';
          planName = 'Duo';
          break;
        case 'family':
          mockCheckoutUrl = 'https://checkout.stripe.com/c/pay/cs_test_family_plan';
          planName = 'Familiar';
          break;
        default:
          mockCheckoutUrl = 'https://checkout.stripe.com/c/pay/cs_test_plan';
          planName = planType;
      }
      
      console.log(`Redirecting to: ${mockCheckoutUrl}`);
      alert(`Redirigiendo al checkout para el plan ${planName}...`);
      
      // En producción, descomenta esta línea:
      // window.location.href = mockCheckoutUrl;
    }, 1000);
  }

  async selectPlan(planType: string): Promise<void> {
    try {
      console.log(`Plan selected: ${planType}`);
      
      switch(planType) {
        case 'free':
          console.log('Plan gratuito seleccionado');
          break;
        case 'premium-individual':
          this.createMockCheckoutSession('monthly');
          break;
        case 'premium-yearly':
          this.createMockCheckoutSession('yearly');
          break;
        default:
          console.warn('Unknown plan type:', planType);
      }
    } catch (error) {
      console.error('Error al seleccionar plan:', error);
    }
  }
}
