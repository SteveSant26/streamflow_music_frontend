import { Injectable } from '@angular/core';
import { Observable, map, tap, catchError, of } from 'rxjs';
import { IPaymentRepository } from '../repositories/i-payment.repository';
import { PaymentStateService } from '../services/payment-state.service';
import { Subscription } from '../entities/payment.entity';

@Injectable({ providedIn: 'root' })
export class GetUserSubscriptionUseCase {
  constructor(
    private readonly paymentRepository: IPaymentRepository,
    private readonly paymentStateService: PaymentStateService
  ) {}

  execute(userId: string): Observable<Subscription | null> {
    console.log('🎯 GetUserSubscriptionUseCase: Obteniendo suscripción del usuario:', userId);
    
    this.paymentStateService.setLoading(true);
    this.paymentStateService.setError(null);

    return this.paymentRepository.getSubscription(userId).pipe(
      tap(subscription => {
        console.log('✅ GetUserSubscriptionUseCase: Suscripción obtenida:', subscription);
        this.paymentStateService.setSubscription(subscription);
        this.paymentStateService.setLoading(false);
      }),
      catchError(error => {
        console.error('❌ GetUserSubscriptionUseCase: Error:', error);
        this.paymentStateService.setError('Error al cargar suscripción');
        this.paymentStateService.setLoading(false);
        return of(null);
      })
    );
  }
}
