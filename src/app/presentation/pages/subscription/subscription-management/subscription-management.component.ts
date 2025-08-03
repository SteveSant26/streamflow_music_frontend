import { Component, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { 
  GetUserSubscriptionUseCase, 
  GetPaymentMethodsUseCase, 
  CancelSubscriptionUseCase, 
  CreateBillingPortalUseCase 
} from '@app/domain/usecases';
import { PaymentStateService } from '@app/domain/services/payment-state.service';
import { AuthStateService } from '@app/domain/services/auth-state-service';

@Component({
  selector: 'app-subscription-management',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="subscription-management-container">
      <div class="page-header">
        <h1>Gestionar Suscripción</h1>
        <button
          class="billing-portal-btn"
          (click)="openBillingPortal()"
          [disabled]="loading()"
        >
          Portal de Facturación
        </button>
      </div>

      <div class="content-grid" *ngIf="!loading(); else loadingTemplate">
        <!-- Información de la suscripción -->
        <div class="subscription-info-card" *ngIf="subscription()">
          <h2>Tu Plan</h2>
          <div class="plan-details">
            <div class="plan-name">
              {{ currentPlan()?.name || 'Plan Premium' }}
            </div>
            <div class="plan-price">
              {{ formatPrice(currentPlan()?.price || 0) }}/{{
                currentPlan()?.interval === 'month' ? 'mes' : 'año'
              }}
            </div>
            <div class="plan-status" [class]="subscription()?.status">
              {{ getStatusText(subscription()?.status || '') }}
            </div>
          </div>

          <div class="subscription-dates">
            <div class="date-info" *ngIf="subscription()?.currentPeriodEnd">
              <label>Próxima facturación:</label>
              <span>{{ formatDate(subscription()!.currentPeriodEnd) }}</span>
            </div>
            <div
              class="date-info"
              *ngIf="subscription()?.trialEnd && isOnTrial()"
            >
              <label>Fin del período de prueba:</label>
              <span>{{ formatDate(subscription()!.trialEnd!) }}</span>
            </div>
            <div class="date-info" *ngIf="subscription()?.canceledAt">
              <label>Cancelada el:</label>
              <span>{{ formatDate(subscription()!.canceledAt!) }}</span>
            </div>
          </div>

          <div class="subscription-actions">
            <button
              class="change-plan-btn"
              (click)="changePlan()"
              [disabled]="subscription()?.status !== 'active'"
            >
              Cambiar Plan
            </button>
            <button
              class="cancel-btn"
              (click)="cancelSubscription()"
              [disabled]="
                subscription()?.status !== 'active' ||
                subscription()?.canceledAt
              "
              *ngIf="!subscription()?.canceledAt"
            >
              Cancelar Suscripción
            </button>
          </div>
        </div>

        <!-- Métodos de pago -->
        <div class="payment-methods-card">
          <h2>Métodos de Pago</h2>
          <div
            class="payment-methods-list"
            *ngIf="paymentMethods().length > 0; else noPaymentMethods"
          >
            <div
              *ngFor="let method of paymentMethods()"
              class="payment-method-item"
              [class.default]="method.isDefault"
            >
              <div class="card-info">
                <div class="card-brand">
                  {{ formatCardBrand(method.card?.brand || '') }}
                </div>
                <div class="card-number">
                  **** **** **** {{ method.card?.last4 }}
                </div>
                <div class="card-expiry">
                  {{ method.card?.expMonth }}/{{ method.card?.expYear }}
                </div>
              </div>
              <div class="method-actions">
                <span class="default-badge" *ngIf="method.isDefault"
                  >Por defecto</span
                >
                <button class="manage-btn" (click)="openBillingPortal()">
                  Gestionar
                </button>
              </div>
            </div>
          </div>

          <ng-template #noPaymentMethods>
            <div class="no-payment-methods">
              <p>No tienes métodos de pago guardados</p>
              <button class="add-payment-btn" (click)="openBillingPortal()">
                Agregar método de pago
              </button>
            </div>
          </ng-template>
        </div>

        <!-- Estado de facturación -->
        <div class="billing-info-card" *ngIf="upcomingInvoice()">
          <h2>Próxima Factura</h2>
          <div class="invoice-info">
            <div class="amount">
              {{ formatPrice(upcomingInvoice()?.amount || 0) }}
            </div>
            <div class="due-date">
              Vence: {{ formatDate(upcomingInvoice()!.createdAt) }}
            </div>
          </div>
        </div>
      </div>

      <ng-template #loadingTemplate>
        <div class="loading-state">
          <div class="loading-spinner"></div>
          <p>Cargando información de la suscripción...</p>
        </div>
      </ng-template>

      <div class="error-state" *ngIf="error()">
        <p>{{ error() }}</p>
        <button (click)="loadData()">Reintentar</button>
      </div>
    </div>
  `,
  styles: [
    `
      .subscription-management-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
      }

      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 3rem;
      }

      .page-header h1 {
        font-size: 2.5rem;
        color: #fff;
      }

      .billing-portal-btn {
        padding: 12px 24px;
        background: #1db954;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .billing-portal-btn:hover:not(:disabled) {
        background: #1ed760;
      }

      .content-grid {
        display: grid;
        gap: 2rem;
        grid-template-columns: 1fr;

        @media (min-width: 768px) {
          grid-template-columns: 2fr 1fr;
        }
      }

      .subscription-info-card,
      .payment-methods-card,
      .billing-info-card {
        background: #1a1a1a;
        border: 1px solid #333;
        border-radius: 12px;
        padding: 2rem;
      }

      .subscription-info-card h2,
      .payment-methods-card h2,
      .billing-info-card h2 {
        font-size: 1.5rem;
        color: #fff;
        margin-bottom: 1.5rem;
      }

      .plan-details {
        margin-bottom: 2rem;
      }

      .plan-name {
        font-size: 1.25rem;
        font-weight: 600;
        color: #fff;
        margin-bottom: 0.5rem;
      }

      .plan-price {
        font-size: 1.5rem;
        color: #1db954;
        margin-bottom: 0.5rem;
      }

      .plan-status {
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 0.875rem;
        font-weight: 500;
        display: inline-block;
      }

      .plan-status.active {
        background: #1db954;
        color: white;
      }

      .plan-status.canceled {
        background: #ff6b6b;
        color: white;
      }

      .subscription-dates {
        margin-bottom: 2rem;
      }

      .date-info {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.75rem;
        padding-bottom: 0.75rem;
        border-bottom: 1px solid #333;
      }

      .date-info:last-child {
        border-bottom: none;
        margin-bottom: 0;
      }

      .date-info label {
        color: #b3b3b3;
      }

      .date-info span {
        color: #fff;
        font-weight: 500;
      }

      .subscription-actions {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
      }

      .change-plan-btn {
        padding: 12px 24px;
        background: #1db954;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .cancel-btn {
        padding: 12px 24px;
        background: transparent;
        color: #ff6b6b;
        border: 1px solid #ff6b6b;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .cancel-btn:hover:not(:disabled) {
        background: #ff6b6b;
        color: white;
      }

      .payment-method-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        border: 1px solid #333;
        border-radius: 8px;
        margin-bottom: 1rem;
      }

      .payment-method-item.default {
        border-color: #1db954;
      }

      .card-info .card-brand {
        font-weight: 600;
        color: #fff;
      }

      .card-info .card-number {
        color: #b3b3b3;
        margin: 0.25rem 0;
      }

      .card-info .card-expiry {
        font-size: 0.875rem;
        color: #888;
      }

      .method-actions {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .default-badge {
        background: #1db954;
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.75rem;
      }

      .manage-btn {
        padding: 8px 16px;
        background: transparent;
        color: #1db954;
        border: 1px solid #1db954;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.875rem;
      }

      .no-payment-methods {
        text-align: center;
        padding: 2rem;
        color: #b3b3b3;
      }

      .add-payment-btn {
        margin-top: 1rem;
        padding: 12px 24px;
        background: #1db954;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
      }

      .invoice-info .amount {
        font-size: 1.5rem;
        font-weight: 600;
        color: #1db954;
        margin-bottom: 0.5rem;
      }

      .invoice-info .due-date {
        color: #b3b3b3;
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
    `,
  ],
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
    this.router.navigate(['/subscription/plans']);
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
    const brandMap: { [key: string]: string } = {
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
    const statusMap: { [key: string]: string } = {
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
