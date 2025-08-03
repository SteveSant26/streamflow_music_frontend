import { Injectable, inject } from '@angular/core';
import { ApiService } from '../../../infrastructure/services/api.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiGetUseCase {
  private readonly apiService = inject(ApiService);
  execute<T>(endpoint: string, params?: any): Observable<T> {
    return this.apiService.get<T>(endpoint, params);
  }
}

@Injectable({ providedIn: 'root' })
export class ApiGetPaginatedUseCase {
  private readonly apiService = inject(ApiService);
  execute<T>(endpoint: string, params?: any) {
    return this.apiService.getPaginated<T>(endpoint, params);
  }
}

@Injectable({ providedIn: 'root' })
export class ApiPostUseCase {
  private readonly apiService = inject(ApiService);
  execute<T>(endpoint: string, data: any): Observable<T> {
    return this.apiService.post<T>(endpoint, data);
  }
}

@Injectable({ providedIn: 'root' })
export class ApiPutUseCase {
  private readonly apiService = inject(ApiService);
  execute<T>(endpoint: string, data: any): Observable<T> {
    return this.apiService.put<T>(endpoint, data);
  }
}

@Injectable({ providedIn: 'root' })
export class ApiPatchUseCase {
  private readonly apiService = inject(ApiService);
  execute<T>(endpoint: string, data: any): Observable<T> {
    return this.apiService.patch<T>(endpoint, data);
  }
}

@Injectable({ providedIn: 'root' })
export class ApiDeleteUseCase {
  private readonly apiService = inject(ApiService);
  execute<T>(endpoint: string): Observable<T> {
    return this.apiService.delete<T>(endpoint);
  }
}

@Injectable({ providedIn: 'root' })
export class ApiUploadUseCase {
  private readonly apiService = inject(ApiService);
  execute<T>(
    endpoint: string,
    file: File,
    key: string = 'profile_picture',
    additionalData?: any,
  ): Observable<T> {
    return this.apiService.upload<T>(
      endpoint,
      [
        {
          key,
          value: file,
        },
      ],
      additionalData,
    );
  }
}
