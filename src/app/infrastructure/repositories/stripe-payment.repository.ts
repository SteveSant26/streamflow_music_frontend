import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { IPaymentRepository } from '@app/domain/repositories/i-payment.repository';
import {
  Subscription,
  SubscriptionPlan,
  PaymentMethod,
  Invoice,
  Payment,
} from '@app/domain/entities/payment.entity';
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
} from '@app/domain/entities/payment-dtos';
import { environment } from '@environments/environment';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class StripePaymentRepository implements IPaymentRepository {
  private readonly baseUrl = environment.apiUrl + '/payments';

  constructor(private readonly http: HttpClient) {}

  // Gestión de suscripciones
  getSubscription(userId: string): Observable<Subscription | null> {
    return this.http
      .get<
        ApiResponse<Subscription | null>
      >(`${this.baseUrl}/subscription/${userId}`)
      .pipe(map((response) => response.data));
  }

  createSubscription(dto: CreateSubscriptionDto): Observable<Subscription> {
    return this.http
      .post<ApiResponse<Subscription>>(`${this.baseUrl}/subscription`, dto)
      .pipe(map((response) => response.data));
  }

  updateSubscription(
    subscriptionId: string,
    dto: UpdateSubscriptionDto,
  ): Observable<Subscription> {
    return this.http
      .put<
        ApiResponse<Subscription>
      >(`${this.baseUrl}/subscription/${subscriptionId}`, dto)
      .pipe(map((response) => response.data));
  }

  cancelSubscription(subscriptionId: string): Observable<void> {
    return this.http
      .post<
        ApiResponse<void>
      >(`${this.baseUrl}/subscription/${subscriptionId}/cancel`, {})
      .pipe(map(() => undefined));
  }

  reactivateSubscription(subscriptionId: string): Observable<Subscription> {
    return this.http
      .post<
        ApiResponse<Subscription>
      >(`${this.baseUrl}/subscription/${subscriptionId}/reactivate`, {})
      .pipe(map((response) => response.data));
  }

  // Planes de suscripción
  getSubscriptionPlans(): Observable<SubscriptionPlan[]> {
    return this.http
      .get<ApiResponse<SubscriptionPlan[]>>(`${this.baseUrl}/plans`)
      .pipe(map((response) => response.data));
  }

  getSubscriptionPlan(planId: string): Observable<SubscriptionPlan> {
    return this.http
      .get<ApiResponse<SubscriptionPlan>>(`${this.baseUrl}/plans/${planId}`)
      .pipe(map((response) => response.data));
  }

  // Métodos de pago
  getPaymentMethods(userId: string): Observable<PaymentMethod[]> {
    return this.http
      .get<
        ApiResponse<PaymentMethod[]>
      >(`${this.baseUrl}/payment-methods/${userId}`)
      .pipe(map((response) => response.data));
  }

  addPaymentMethod(
    userId: string,
    dto: AddPaymentMethodDto,
  ): Observable<PaymentMethod> {
    return this.http
      .post<
        ApiResponse<PaymentMethod>
      >(`${this.baseUrl}/payment-methods/${userId}`, dto)
      .pipe(map((response) => response.data));
  }

  removePaymentMethod(paymentMethodId: string): Observable<void> {
    return this.http
      .delete<
        ApiResponse<void>
      >(`${this.baseUrl}/payment-methods/${paymentMethodId}`)
      .pipe(map(() => undefined));
  }

  setDefaultPaymentMethod(
    userId: string,
    paymentMethodId: string,
  ): Observable<void> {
    return this.http
      .post<
        ApiResponse<void>
      >(`${this.baseUrl}/payment-methods/${userId}/default`, { paymentMethodId })
      .pipe(map(() => undefined));
  }

  // Facturas
  getInvoices(userId: string): Observable<Invoice[]> {
    return this.http
      .get<ApiResponse<Invoice[]>>(`${this.baseUrl}/invoices/${userId}`)
      .pipe(map((response) => response.data));
  }

  getInvoice(invoiceId: string): Observable<Invoice> {
    return this.http
      .get<ApiResponse<Invoice>>(`${this.baseUrl}/invoices/detail/${invoiceId}`)
      .pipe(map((response) => response.data));
  }

  downloadInvoice(invoiceId: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/invoices/${invoiceId}/download`, {
      responseType: 'blob',
    });
  }

  // Pagos
  createPaymentIntent(
    dto: CreatePaymentIntentDto,
  ): Observable<{ clientSecret: string; paymentIntentId: string }> {
    return this.http
      .post<
        ApiResponse<{ clientSecret: string; paymentIntentId: string }>
      >(`${this.baseUrl}/payment-intent`, dto)
      .pipe(map((response) => response.data));
  }

  confirmPayment(paymentIntentId: string): Observable<Payment> {
    return this.http
      .post<
        ApiResponse<Payment>
      >(`${this.baseUrl}/payment-intent/${paymentIntentId}/confirm`, {})
      .pipe(map((response) => response.data));
  }

  getPaymentHistory(userId: string): Observable<Payment[]> {
    return this.http
      .get<ApiResponse<Payment[]>>(`${this.baseUrl}/payments/${userId}`)
      .pipe(map((response) => response.data));
  }

  // Customer de Stripe
  createCustomer(dto: CreateCustomerDto): Observable<{ customerId: string }> {
    return this.http
      .post<
        ApiResponse<{ customerId: string }>
      >(`${this.baseUrl}/customer`, dto)
      .pipe(map((response) => response.data));
  }

  updateCustomer(
    customerId: string,
    data: Partial<CreateCustomerDto>,
  ): Observable<void> {
    return this.http
      .put<ApiResponse<void>>(`${this.baseUrl}/customer/${customerId}`, data)
      .pipe(map(() => undefined));
  }

  // Cupones y descuentos
  validateCoupon(
    couponCode: string,
  ): Observable<{ valid: boolean; discount?: number; description?: string }> {
    const params = new HttpParams().set('code', couponCode);
    return this.http
      .get<
        ApiResponse<{ valid: boolean; discount?: number; description?: string }>
      >(`${this.baseUrl}/coupons/validate`, { params })
      .pipe(map((response) => response.data));
  }

  applyCoupon(dto: ApplyCouponDto): Observable<Subscription> {
    return this.http
      .post<ApiResponse<Subscription>>(`${this.baseUrl}/coupons/apply`, dto)
      .pipe(map((response) => response.data));
  }

  // Checkout y billing portal
  createCheckoutSession(
    dto: StripeCheckoutSessionDto,
  ): Observable<{ url: string; sessionId: string }> {
    return this.http
      .post<
        ApiResponse<{ url: string; sessionId: string }>
      >(`${this.baseUrl}/checkout/session`, dto)
      .pipe(map((response) => response.data));
  }

  createBillingPortalSession(
    customerId: string,
    dto: BillingPortalDto,
  ): Observable<{ url: string }> {
    return this.http
      .post<
        ApiResponse<{ url: string }>
      >(`${this.baseUrl}/billing-portal/${customerId}`, dto)
      .pipe(map((response) => response.data));
  }

  // Preview y cálculos
  previewSubscription(dto: SubscriptionPreviewDto): Observable<{
    amount: number;
    currency: string;
    discount?: number;
    total: number;
    nextBillingDate: Date;
  }> {
    return this.http
      .post<
        ApiResponse<{
          amount: number;
          currency: string;
          discount?: number;
          total: number;
          nextBillingDate: Date;
        }>
      >(`${this.baseUrl}/subscription/preview`, dto)
      .pipe(map((response) => response.data));
  }

  // Webhooks
  handleWebhook(signature: string, payload: string): Observable<void> {
    return this.http
      .post<
        ApiResponse<void>
      >(`${this.baseUrl}/webhook`, { signature, payload })
      .pipe(map(() => undefined));
  }

  // Configuración de Stripe
  getStripePublicKey(): Observable<string> {
    return this.http
      .get<ApiResponse<{ publicKey: string }>>(`${this.baseUrl}/config`)
      .pipe(map((response) => response.data.publicKey));
  }
}
