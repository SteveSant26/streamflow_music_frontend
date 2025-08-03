import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  features: string[];
  duration: 'monthly' | 'yearly';
}

export interface UserSubscription {
  id: string;
  planId: string;
  status: 'active' | 'cancelled' | 'expired';
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal';
  last4?: string;
  brand?: string;
  isDefault: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class GetSubscriptionPlansUseCase {
  execute(): Observable<SubscriptionPlan[]> {
    // This is a placeholder implementation
    const plans: SubscriptionPlan[] = [
      {
        id: 'basic-monthly',
        name: 'Basic Monthly',
        price: 9.99,
        currency: 'USD',
        features: ['Unlimited music streaming', 'High quality audio', 'Offline downloads'],
        duration: 'monthly'
      },
      {
        id: 'premium-monthly',
        name: 'Premium Monthly',
        price: 14.99,
        currency: 'USD',
        features: ['Everything in Basic', 'Lossless audio', 'Early access to new releases'],
        duration: 'monthly'
      },
      {
        id: 'premium-yearly',
        name: 'Premium Yearly',
        price: 149.99,
        currency: 'USD',
        features: ['Everything in Premium', '2 months free', 'Exclusive content'],
        duration: 'yearly'
      }
    ];
    return of(plans);
  }
}

@Injectable({
  providedIn: 'root'
})
export class GetUserSubscriptionUseCase {
  execute(userId?: string): Observable<UserSubscription | null> {
    // This is a placeholder implementation
    console.log('Getting user subscription for userId:', userId);
    return of(null);
  }
}

@Injectable({
  providedIn: 'root'
})
export class CreateCheckoutSessionUseCase {
  execute(checkoutData: { planId: string; successUrl?: string; cancelUrl?: string; allowPromotionCodes?: boolean }): Observable<{ url: string }> {
    return new Observable(observer => {
      // This is a placeholder implementation
      // In a real app, this would create a Stripe checkout session
      const checkoutUrl = `https://checkout.stripe.com/pay/${checkoutData.planId}`;
      observer.next({ url: checkoutUrl });
      observer.complete();
    });
  }
}

@Injectable({
  providedIn: 'root'
})
export class CreateSubscriptionUseCase {
  execute(planId: string, paymentMethodId?: string): Observable<UserSubscription> {
    return new Observable(observer => {
      // This is a placeholder implementation
      const subscription: UserSubscription = {
        id: 'sub_' + Date.now(),
        planId,
        status: 'active',
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        cancelAtPeriodEnd: false
      };
      observer.next(subscription);
      observer.complete();
    });
  }
}

@Injectable({
  providedIn: 'root'
})
export class CancelSubscriptionUseCase {
  execute(subscriptionId: string): Observable<UserSubscription> {
    return new Observable(observer => {
      // This is a placeholder implementation
      const subscription: UserSubscription = {
        id: subscriptionId,
        planId: 'basic-monthly',
        status: 'active',
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        cancelAtPeriodEnd: true
      };
      observer.next(subscription);
      observer.complete();
    });
  }
}

@Injectable({
  providedIn: 'root'
})
export class GetPaymentMethodsUseCase {
  execute(userId?: string): Observable<PaymentMethod[]> {
    // This is a placeholder implementation
    console.log('Getting payment methods for userId:', userId);
    return of([]);
  }
}

@Injectable({
  providedIn: 'root'
})
export class CreateBillingPortalUseCase {
  execute(customerId?: string, options?: any): Observable<{ url: string }> {
    return new Observable(observer => {
      // This is a placeholder implementation
      console.log('Creating billing portal for customerId:', customerId, 'with options:', options);
      const portalUrl = 'https://billing.stripe.com/session/portal';
      observer.next({ url: portalUrl });
      observer.complete();
    });
  }
}
