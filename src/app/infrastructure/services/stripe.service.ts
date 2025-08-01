import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { IPaymentRepository } from '@app/domain/repositories/i-payment.repository';

declare global {
  interface Window {
    Stripe: any;
  }
}

export interface StripeCardElement {
  mount(selector: string): void;
  unmount(): void;
  clear(): void;
  focus(): void;
  blur(): void;
  update(options: any): void;
  destroy(): void;
  on(event: string, handler: Function): void;
  off(event: string, handler?: Function): void;
}

export interface StripeElements {
  create(type: string, options?: any): StripeCardElement;
  getElement(type: string): StripeCardElement | null;
}

export interface StripeInstance {
  elements(options?: any): StripeElements;
  createPaymentMethod(options: any): Promise<{ paymentMethod?: any; error?: any }>;
  confirmCardPayment(clientSecret: string, options?: any): Promise<{ paymentIntent?: any; error?: any }>;
  confirmCardSetup(clientSecret: string, options?: any): Promise<{ setupIntent?: any; error?: any }>;
  redirectToCheckout(options: { sessionId: string }): Promise<{ error?: any }>;
}

@Injectable({ providedIn: 'root' })
export class StripeService {
  private stripe: StripeInstance | null = null;
  private elements: StripeElements | null = null;
  private cardElement: StripeCardElement | null = null;
  private readonly isLoaded = new BehaviorSubject<boolean>(false);
  
  readonly isLoaded$ = this.isLoaded.asObservable();

  constructor(private readonly paymentRepository: IPaymentRepository) {}

  async initialize(): Promise<void> {
    if (this.stripe) {
      return;
    }

    try {
      // Cargar Stripe.js si no está cargado
      if (!window.Stripe) {
        await this.loadStripeScript();
      }

      // Obtener la clave pública de Stripe
      const publicKey = await firstValueFrom(this.paymentRepository.getStripePublicKey());
      
      // Inicializar Stripe
      this.stripe = window.Stripe(publicKey);
      this.isLoaded.next(true);
      
      console.log('✅ StripeService: Stripe inicializado correctamente');
    } catch (error) {
      console.error('❌ StripeService: Error al inicializar Stripe:', error);
      throw error;
    }
  }

  private loadStripeScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.getElementById('stripe-script')) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.id = 'stripe-script';
      script.src = 'https://js.stripe.com/v3/';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Stripe.js'));
      document.head.appendChild(script);
    });
  }

  createElements(options?: any): StripeElements {
    if (!this.stripe) {
      throw new Error('Stripe no está inicializado');
    }

    this.elements = this.stripe.elements(options);
    return this.elements;
  }

  createCardElement(options?: any): StripeCardElement {
    if (!this.elements) {
      this.createElements();
    }

    const defaultOptions = {
      style: {
        base: {
          fontSize: '16px',
          color: '#424770',
          '::placeholder': {
            color: '#aab7c4',
          },
        },
        invalid: {
          color: '#9e2146',
        },
      },
      hidePostalCode: true,
    };

    this.cardElement = this.elements!.create('card', { ...defaultOptions, ...options });
    return this.cardElement;
  }

  getCardElement(): StripeCardElement | null {
    return this.cardElement;
  }

  async createPaymentMethod(cardElement: StripeCardElement, billingDetails?: any): Promise<{ paymentMethod?: any; error?: any }> {
    if (!this.stripe) {
      throw new Error('Stripe no está inicializado');
    }

    return this.stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: billingDetails,
    });
  }

  async confirmCardPayment(clientSecret: string, cardElement?: StripeCardElement, paymentMethodData?: any): Promise<{ paymentIntent?: any; error?: any }> {
    if (!this.stripe) {
      throw new Error('Stripe no está inicializado');
    }

    const confirmationData: any = {};
    
    if (cardElement) {
      confirmationData.payment_method = {
        card: cardElement,
        ...paymentMethodData,
      };
    }

    return this.stripe.confirmCardPayment(clientSecret, confirmationData);
  }

  async confirmCardSetup(clientSecret: string, cardElement: StripeCardElement, paymentMethodData?: any): Promise<{ setupIntent?: any; error?: any }> {
    if (!this.stripe) {
      throw new Error('Stripe no está inicializado');
    }

    return this.stripe.confirmCardSetup(clientSecret, {
      payment_method: {
        card: cardElement,
        ...paymentMethodData,
      },
    });
  }

  async redirectToCheckout(sessionId: string): Promise<{ error?: any }> {
    if (!this.stripe) {
      throw new Error('Stripe no está inicializado');
    }

    return this.stripe.redirectToCheckout({ sessionId });
  }

  destroyElements(): void {
    if (this.cardElement) {
      this.cardElement.destroy();
      this.cardElement = null;
    }
    this.elements = null;
  }

  // Utility methods
  formatCardBrand(brand: string): string {
    const brandMap: { [key: string]: string } = {
      visa: 'Visa',
      mastercard: 'Mastercard',
      amex: 'American Express',
      discover: 'Discover',
      diners: 'Diners Club',
      jcb: 'JCB',
      unionpay: 'UnionPay',
      unknown: 'Unknown'
    };

    return brandMap[brand] || brandMap['unknown'];
  }

  formatAmount(amount: number, currency: string): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100); // Stripe amounts are in cents
  }

  validateCardNumber(cardNumber: string): boolean {
    // Basic Luhn algorithm validation
    const cleanNumber = cardNumber.replace(/\s/g, '');
    if (!/^\d+$/.test(cleanNumber)) return false;
    
    let sum = 0;
    let shouldDouble = false;
    
    for (let i = cleanNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanNumber.charAt(i), 10);
      
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    
    return sum % 10 === 0;
  }
}
