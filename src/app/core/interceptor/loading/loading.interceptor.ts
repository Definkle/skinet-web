import { HttpInterceptorFn } from '@angular/common/http';
import { delay, finalize } from 'rxjs';
import { inject } from '@angular/core';
import { GlobalStore } from '../../state/global';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const globalStore$ = inject(GlobalStore);

  globalStore$.incrementOngoingRequestsCount();

  return next(req).pipe(
    delay(500),
    finalize(() => {
      globalStore$.decrementOngoingRequestsCount();
    }),
  );
};
