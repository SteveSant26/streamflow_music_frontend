import { Injectable, inject } from '@angular/core';
import { ApiService } from '../../../infrastructure/services/api-service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiGetUseCase {
  private readonly apiService = inject(ApiService);
  execute<T>(endpoint: string): Observable<T> {
    return this.apiService.get<T>(endpoint);
  }
}

@Injectable({ providedIn: 'root' })
export class ApiPostUseCase {
  private readonly apiService = inject(ApiService);
  execute<T>(endpoint: string, data: unknown): Observable<T> {
    return this.apiService.post<T>(endpoint, data);
  }
}

@Injectable({ providedIn: 'root' })
export class ApiPutUseCase {
  private readonly apiService = inject(ApiService);
  execute<T>(endpoint: string, data: unknown): Observable<T> {
    return this.apiService.put<T>(endpoint, data);
  }
}
