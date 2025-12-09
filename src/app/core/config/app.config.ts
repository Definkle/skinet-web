import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { inject, provideAppInitializer, provideBrowserGlobalErrorListeners, type ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from '@app/app.routes';

import { errorInterceptor } from '@core/interceptors/error/error.interceptor';
import { loadingInterceptor } from '@core/interceptors/loading/loading.interceptor';

import { authInterceptor } from '@interceptors/auth/auth.interceptor';

import { GlobalStore } from '@state/global';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor, loadingInterceptor])),
    provideAppInitializer(() => {
      const store = inject(GlobalStore);
      store.initApp();
    }),
  ],
};
