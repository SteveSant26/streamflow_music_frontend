import { Injectable } from '@angular/core';
import { Observable, map, tap, catchError, of } from 'rxjs';
import { IPaymentRepository } from '../repositories/i-payment.repository';
import { PaymentStateService } from '../services/payment-state.service';
import { SubscriptionPlan } from '../entities/payment.entity';

@Injectable({ providedIn: 'root' })
export class GetSubscriptionPlansUseCase {
  constructor(
    private readonly paymentRepository: IPaymentRepository,
    private readonly paymentStateService: PaymentStateService
  ) {}

  execute(): Observable<SubscriptionPlan[]> {
    console.log('🎯 GetSubscriptionPlansUseCase: Obteniendo planes de suscripción');
    
    this.paymentStateService.setLoading(true);
    this.paymentStateService.setError(null);

    return this.paymentRepository.getSubscriptionPlans().pipe(
      tap(plans => {
        console.log('✅ GetSubscriptionPlansUseCase: Planes obtenidos:', plans);
        this.paymentStateService.setPlans(plans);
        this.paymentStateService.setLoading(false);
      }),
      catchError(error => {
        console.error('❌ GetSubscriptionPlansUseCase: Error:', error);
        this.paymentStateService.setError('Error al cargar planes de suscripción');
        this.paymentStateService.setLoading(false);
        return of([]);
      })
    );
  }
}
