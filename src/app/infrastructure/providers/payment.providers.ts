import { Provider } from '@angular/core';
import { IPaymentRepository } from '@app/domain/repositories/i-payment.repository';
import { StripePaymentRepository } from '../repositories/stripe-payment.repository';

export const paymentProviders: Provider[] = [
  {
    provide: IPaymentRepository,
    useClass: StripePaymentRepository
  }
];
