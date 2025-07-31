import { ApplicationConfig, provideZoneChangeDetection } from "@angular/core";
import { provideRouter } from "@angular/router";
<<<<<<< HEAD
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptors,
} from "@angular/common/http";
import { routes } from "./app.routes";
import { provideClientHydration } from "@angular/platform-browser";
import { authInterceptor } from "./shared/utils/auth-interceptor";
import { authProviders } from "./shared/providers/auth.providers";
import { HttpErrorInterceptor } from "./interceptors/http-error.interceptor";
=======
import {
  provideHttpClient,
  withInterceptorsFromDi,
  HTTP_INTERCEPTORS,
  withFetch,
} from "@angular/common/http";

import { routes } from "./app.routes";
import {
  provideClientHydration,
  withEventReplay,
} from "@angular/platform-browser";
import { HttpErrorInterceptor } from "./interceptors/http-error.interceptor";
import { AuthTokenInterceptor } from "./interceptors/auth-token.interceptor";
>>>>>>> 37441a955f49179a98bd6eac8335e82c15203441

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
<<<<<<< HEAD
    provideClientHydration(),
    provideHttpClient(withInterceptors([authInterceptor])),
    ...authProviders,
=======
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthTokenInterceptor,
      multi: true,
    },
>>>>>>> 37441a955f49179a98bd6eac8335e82c15203441
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true,
    },
  ],
};
