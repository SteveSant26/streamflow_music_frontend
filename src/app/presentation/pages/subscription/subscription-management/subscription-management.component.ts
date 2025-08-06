import { Component, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ROUTES_CONFIG_SUBSCRIPTION } from '@app/config';
import { 
  GetUserSubscriptionUseCase, 
  GetPaymentMethodsUseCase, 
  CancelSubscriptionUseCase, 
  CreateBillingPortalUseCase 
} from '@app/domain/usecases';
import { PaymentStateService, AuthStateService } from '@app/shared/services';

@Component({
  selector: 'app-subscription-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subscription-management.component.html',
  styleUrl: './subscription-management.component.css'
})
export class SubscriptionManagementComponent implements OnInit {
  // Computed properties
  readonly subscription = computed(() =>
    this.paymentStateService.subscription(),
  );
  readonly currentPlan = computed(() => this.paymentStateService.currentPlan());
  readonly paymentMethods = computed(() =>
    this.paymentStateService.paymentMethods(),
  );
  readonly loading = computed(() => this.paymentStateService.loading());
  readonly error = computed(() => this.paymentStateService.error());
  readonly isOnTrial = computed(() => this.paymentStateService.isOnTrial());
  readonly upcomingInvoice = computed(() =>
    this.paymentStateService.upcomingInvoice(),
  );

  constructor(
    private readonly getUserSubscriptionUseCase: GetUserSubscriptionUseCase,
    private readonly getPaymentMethodsUseCase: GetPaymentMethodsUseCase,
    private readonly cancelSubscriptionUseCase: CancelSubscriptionUseCase,
    private readonly createBillingPortalUseCase: CreateBillingPortalUseCase,
    private readonly paymentStateService: PaymentStateService,
    private readonly authStateService: AuthStateService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    const user = this.authStateService.user();
    if (user?.id) {
      this.getUserSubscriptionUseCase.execute(user.id).subscribe();
      this.getPaymentMethodsUseCase.execute(user.id).subscribe();
    }
  }

  changePlan(): void {
    this.router.navigate([ROUTES_CONFIG_SUBSCRIPTION.PLANS.link]);
  }

  async cancelSubscription(): Promise<void> {
    const subscription = this.subscription();
    if (!subscription) return;

    const confirmed = confirm(
      '¿Estás seguro de que deseas cancelar tu suscripción? Tu acceso premium continuará hasta el final del período de facturación actual.',
    );

    if (confirmed) {
      this.cancelSubscriptionUseCase.execute(subscription.id).subscribe({
        next: () => {
          alert(
            'Tu suscripción ha sido cancelada. Seguirás teniendo acceso premium hasta el final del período actual.',
          );
        },
        error: (error) => {
          console.error('Error al cancelar suscripción:', error);
          alert(
            'Hubo un error al cancelar tu suscripción. Por favor, inténtalo de nuevo.',
          );
        },
      });
    }
  }

  async openBillingPortal(): Promise<void> {
    const subscription = this.subscription();
    if (!subscription) return;

    try {
      const result = await this.createBillingPortalUseCase
        .execute(subscription.stripeCustomerId, {
          returnUrl: window.location.href,
        })
        .toPromise();

      if (result?.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      console.error('Error al abrir portal de facturación:', error);
      alert(
        'Hubo un error al abrir el portal de facturación. Por favor, inténtalo de nuevo.',
      );
    }
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(price / 100);
  }

  formatDate(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  formatCardBrand(brand: string): string {
    const brandMap: Record<string, string> = {
      visa: 'Visa',
      mastercard: 'Mastercard',
      amex: 'American Express',
      discover: 'Discover',
      diners: 'Diners Club',
      jcb: 'JCB',
      unionpay: 'UnionPay',
    };

    return brandMap[brand] || 'Tarjeta';
  }

  getStatusText(status: string): string {
    const statusMap: Record<string, string> = {
      active: 'Activa',
      canceled: 'Cancelada',
      incomplete: 'Incompleta',
      incomplete_expired: 'Expirada',
      past_due: 'Vencida',
      unpaid: 'Sin pagar',
      trialing: 'En prueba',
    };

    return statusMap[status] || status;
  }
}
