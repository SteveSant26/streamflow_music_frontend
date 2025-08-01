import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
} from '@angular/common/http';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { authProviders } from './infrastructure/providers/auth.providers';
import { playerProviders } from './infrastructure/providers/player.providers';
import { paymentProviders } from './infrastructure/providers/payment.providers';
import { AuthTokenInterceptor } from './infrastructure/interceptors/auth-token.interceptor';
import { HttpErrorInterceptor } from './infrastructure/interceptors/http-error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthTokenInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true,
    },
    ...authProviders,
    ...playerProviders,
    ...paymentProviders,
  ],
};
