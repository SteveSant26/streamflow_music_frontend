import { Injectable, signal, computed } from '@angular/core';
import { Subscription, SubscriptionPlan, PaymentMethod, Invoice } from '../entities/payment.entity';

export interface PaymentState {
  subscription: Subscription | null;
  plans: SubscriptionPlan[];
  paymentMethods: PaymentMethod[];
  invoices: Invoice[];
  loading: boolean;
  error: string | null;
}

@Injectable({ providedIn: 'root' })
export class PaymentStateService {
  private readonly _state = signal<PaymentState>({
    subscription: null,
    plans: [],
    paymentMethods: [],
    invoices: [],
    loading: false,
    error: null
  });

  readonly state = this._state.asReadonly();

  // Computed properties
  readonly subscription = computed(() => this._state().subscription);
  readonly plans = computed(() => this._state().plans);
  readonly paymentMethods = computed(() => this._state().paymentMethods);
  readonly invoices = computed(() => this._state().invoices);
  readonly loading = computed(() => this._state().loading);
  readonly error = computed(() => this._state().error);

  // Computed derived values
  readonly hasActiveSubscription = computed(() => {
    const subscription = this.subscription();
    return subscription?.status === 'active' || subscription?.status === 'trialing';
  });

  readonly currentPlan = computed(() => {
    const subscription = this.subscription();
    const plans = this.plans();
    if (!subscription) return null;
    return plans.find(plan => plan.id === subscription.planId) || null;
  });

  readonly defaultPaymentMethod = computed(() => {
    const methods = this.paymentMethods();
    return methods.find(method => method.isDefault) || null;
  });

  readonly isOnTrial = computed(() => {
    const subscription = this.subscription();
    if (!subscription || !subscription.trialEnd) return false;
    return new Date() < new Date(subscription.trialEnd) && subscription.status === 'trialing';
  });

  readonly subscriptionStatus = computed(() => {
    const subscription = this.subscription();
    if (!subscription) return 'none';
    return subscription.status;
  });

  readonly nextBillingDate = computed(() => {
    const subscription = this.subscription();
    return subscription?.currentPeriodEnd || null;
  });

  readonly upcomingInvoice = computed(() => {
    const invoices = this.invoices();
    return invoices.find(invoice => invoice.status === 'open') || null;
  });

  // State updaters
  setLoading(loading: boolean): void {
    this._state.update(state => ({ ...state, loading }));
  }

  setError(error: string | null): void {
    this._state.update(state => ({ ...state, error }));
  }

  setSubscription(subscription: Subscription | null): void {
    this._state.update(state => ({ ...state, subscription }));
  }

  setPlans(plans: SubscriptionPlan[]): void {
    this._state.update(state => ({ ...state, plans }));
  }

  setPaymentMethods(paymentMethods: PaymentMethod[]): void {
    this._state.update(state => ({ ...state, paymentMethods }));
  }

  setInvoices(invoices: Invoice[]): void {
    this._state.update(state => ({ ...state, invoices }));
  }

  updatePaymentMethod(updatedMethod: PaymentMethod): void {
    this._state.update(state => ({
      ...state,
      paymentMethods: state.paymentMethods.map(method =>
        method.id === updatedMethod.id ? updatedMethod : method
      )
    }));
  }

  addPaymentMethod(newMethod: PaymentMethod): void {
    this._state.update(state => ({
      ...state,
      paymentMethods: [...state.paymentMethods, newMethod]
    }));
  }

  removePaymentMethod(methodId: string): void {
    this._state.update(state => ({
      ...state,
      paymentMethods: state.paymentMethods.filter(method => method.id !== methodId)
    }));
  }

  addInvoice(invoice: Invoice): void {
    this._state.update(state => ({
      ...state,
      invoices: [invoice, ...state.invoices]
    }));
  }

  clearState(): void {
    this._state.set({
      subscription: null,
      plans: [],
      paymentMethods: [],
      invoices: [],
      loading: false,
      error: null
    });
  }

  // Utility methods
  canUpgrade(targetPlanId: string): boolean {
    const currentPlan = this.currentPlan();
    const plans = this.plans();
    const targetPlan = plans.find(plan => plan.id === targetPlanId);
    
    if (!currentPlan || !targetPlan) return true;
    
    return targetPlan.price > currentPlan.price;
  }

  canDowngrade(targetPlanId: string): boolean {
    const currentPlan = this.currentPlan();
    const plans = this.plans();
    const targetPlan = plans.find(plan => plan.id === targetPlanId);
    
    if (!currentPlan || !targetPlan) return true;
    
    return targetPlan.price < currentPlan.price;
  }

  isPlanActive(planId: string): boolean {
    const subscription = this.subscription();
    return subscription?.planId === planId && this.hasActiveSubscription();
  }
}
