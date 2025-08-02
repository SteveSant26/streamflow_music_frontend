export interface CreateSubscriptionDto {
  planId: string;
  paymentMethodId?: string;
  couponCode?: string;
}

export interface UpdateSubscriptionDto {
  planId?: string;
  paymentMethodId?: string;
}

export interface CreatePaymentIntentDto {
  amount: number;
  currency: string;
  description?: string;
  metadata?: Record<string, string>;
}

export interface AddPaymentMethodDto {
  paymentMethodId: string;
  setAsDefault?: boolean;
}

export interface CreateCustomerDto {
  email: string;
  name?: string;
  phone?: string;
}

export interface ApplyCouponDto {
  couponCode: string;
  subscriptionId: string;
}

export interface BillingPortalDto {
  returnUrl: string;
}

export interface WebhookDto {
  id: string;
  object: string;
  data: {
    object: any;
  };
  type: string;
}

export interface StripeCheckoutSessionDto {
  planId: string;
  successUrl: string;
  cancelUrl: string;
  couponCode?: string;
  allowPromotionCodes?: boolean;
}

export interface SubscriptionPreviewDto {
  planId: string;
  couponCode?: string;
  paymentMethodId?: string;
}
