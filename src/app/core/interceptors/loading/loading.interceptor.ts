import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { delay, finalize } from 'rxjs';

import { GlobalStore } from '@state/global/global.store';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const globalStore$ = inject(GlobalStore);

  globalStore$.incrementOngoingRequestsCount();

  return next(req).pipe(
    delay(500),
    finalize(() => {
      globalStore$.decrementOngoingRequestsCount();
    })
  );
};
