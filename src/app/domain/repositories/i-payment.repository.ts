import { Observable } from 'rxjs';
import {
  Subscription,
  SubscriptionPlan,
  PaymentMethod,
  Invoice,
  Payment,
} from '../entities/payment.entity';
import {
  CreateSubscriptionDto,
  UpdateSubscriptionDto,
  CreatePaymentIntentDto,
  AddPaymentMethodDto,
  CreateCustomerDto,
  ApplyCouponDto,
  BillingPortalDto,
  StripeCheckoutSessionDto,
  SubscriptionPreviewDto,
} from '../entities/payment-dtos';

export abstract class IPaymentRepository {
  // Gestión de suscripciones
  abstract getSubscription(userId: string): Observable<Subscription | null>;
  abstract createSubscription(
    dto: CreateSubscriptionDto,
  ): Observable<Subscription>;
  abstract updateSubscription(
    subscriptionId: string,
    dto: UpdateSubscriptionDto,
  ): Observable<Subscription>;
  abstract cancelSubscription(subscriptionId: string): Observable<void>;
  abstract reactivateSubscription(
    subscriptionId: string,
  ): Observable<Subscription>;

  // Planes de suscripción
  abstract getSubscriptionPlans(): Observable<SubscriptionPlan[]>;
  abstract getSubscriptionPlan(planId: string): Observable<SubscriptionPlan>;

  // Métodos de pago
  abstract getPaymentMethods(userId: string): Observable<PaymentMethod[]>;
  abstract addPaymentMethod(
    userId: string,
    dto: AddPaymentMethodDto,
  ): Observable<PaymentMethod>;
  abstract removePaymentMethod(paymentMethodId: string): Observable<void>;
  abstract setDefaultPaymentMethod(
    userId: string,
    paymentMethodId: string,
  ): Observable<void>;

  // Facturas
  abstract getInvoices(userId: string): Observable<Invoice[]>;
  abstract getInvoice(invoiceId: string): Observable<Invoice>;
  abstract downloadInvoice(invoiceId: string): Observable<Blob>;

  // Pagos
  abstract createPaymentIntent(
    dto: CreatePaymentIntentDto,
  ): Observable<{ clientSecret: string; paymentIntentId: string }>;
  abstract confirmPayment(paymentIntentId: string): Observable<Payment>;
  abstract getPaymentHistory(userId: string): Observable<Payment[]>;

  // Customer de Stripe
  abstract createCustomer(
    dto: CreateCustomerDto,
  ): Observable<{ customerId: string }>;
  abstract updateCustomer(
    customerId: string,
    data: Partial<CreateCustomerDto>,
  ): Observable<void>;

  // Cupones y descuentos
  abstract validateCoupon(
    couponCode: string,
  ): Observable<{ valid: boolean; discount?: number; description?: string }>;
  abstract applyCoupon(dto: ApplyCouponDto): Observable<Subscription>;

  // Checkout y billing portal
  abstract createCheckoutSession(
    dto: StripeCheckoutSessionDto,
  ): Observable<{ url: string; sessionId: string }>;
  abstract createBillingPortalSession(
    customerId: string,
    dto: BillingPortalDto,
  ): Observable<{ url: string }>;

  // Preview y cálculos
  abstract previewSubscription(dto: SubscriptionPreviewDto): Observable<{
    amount: number;
    currency: string;
    discount?: number;
    total: number;
    nextBillingDate: Date;
  }>;

  // Webhooks
  abstract handleWebhook(signature: string, payload: string): Observable<void>;

  // Configuración de Stripe
  abstract getStripePublicKey(): Observable<string>;
}
