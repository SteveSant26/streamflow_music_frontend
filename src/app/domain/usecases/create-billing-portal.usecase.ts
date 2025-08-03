import { Injectable } from '@angular/core';
import { Observable, tap, catchError, of } from 'rxjs';
import { IPaymentRepository } from '../repositories/i-payment.repository';
import { PaymentStateService } from '../services/payment-state.service';
import { BillingPortalDto } from '../entities/payment-dtos';

@Injectable({ providedIn: 'root' })
export class CreateBillingPortalUseCase {
  constructor(
    private readonly paymentRepository: IPaymentRepository,
    private readonly paymentStateService: PaymentStateService,
  ) {}

  execute(
    customerId: string,
    dto: BillingPortalDto,
  ): Observable<{ url: string }> {
    console.log(
      '🎯 CreateBillingPortalUseCase: Creando portal de facturación para customer:',
      customerId,
    );

    this.paymentStateService.setLoading(true);
    this.paymentStateService.setError(null);

    return this.paymentRepository
      .createBillingPortalSession(customerId, dto)
      .pipe(
        tap((result) => {
          console.log(
            '✅ CreateBillingPortalUseCase: Portal de facturación creado:',
            result,
          );
          this.paymentStateService.setLoading(false);
        }),
        catchError((error) => {
          console.error('❌ CreateBillingPortalUseCase: Error:', error);
          this.paymentStateService.setError(
            'Error al crear portal de facturación',
          );
          this.paymentStateService.setLoading(false);
          throw error;
        }),
      );
  }
}
