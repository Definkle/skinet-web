import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { lastValueFrom } from 'rxjs';

import { routes } from '@app/app.routes';

import { errorInterceptor } from '@core/interceptors/error/error.interceptor';
import { loadingInterceptor } from '@core/interceptors/loading/loading.interceptor';
import { InitService } from '@core/services/init/init.service';

async function initializeApp() {
  const initService = inject(InitService);
  return lastValueFrom(initService.init$()).finally(() => {
    const splash = document.getElementById('initial-splash');
    if (splash) {
      splash.remove();
    }
  });
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([errorInterceptor, loadingInterceptor])),
    provideAppInitializer(initializeApp),
  ],
};
