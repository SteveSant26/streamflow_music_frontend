import { Injectable } from '@angular/core';
import { Observable, tap, catchError, of, switchMap } from 'rxjs';
import { IPaymentRepository } from '../repositories/i-payment.repository';
import { PaymentStateService } from '../services/payment-state.service';
import { CreateSubscriptionDto } from '../entities/payment-dtos';
import { Subscription } from '../entities/payment.entity';

@Injectable({ providedIn: 'root' })
export class CreateSubscriptionUseCase {
  constructor(
    private readonly paymentRepository: IPaymentRepository,
    private readonly paymentStateService: PaymentStateService,
  ) {}

  execute(dto: CreateSubscriptionDto): Observable<Subscription> {
    console.log('🎯 CreateSubscriptionUseCase: Creando suscripción:', dto);

    this.paymentStateService.setLoading(true);
    this.paymentStateService.setError(null);

    return this.paymentRepository.createSubscription(dto).pipe(
      tap((subscription) => {
        console.log(
          '✅ CreateSubscriptionUseCase: Suscripción creada:',
          subscription,
        );
        this.paymentStateService.setSubscription(subscription);
        this.paymentStateService.setLoading(false);
      }),
      catchError((error) => {
        console.error('❌ CreateSubscriptionUseCase: Error:', error);
        this.paymentStateService.setError('Error al crear suscripción');
        this.paymentStateService.setLoading(false);
        throw error;
      }),
    );
  }
}
