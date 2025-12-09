import { HttpErrorResponse, type HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router, type NavigationExtras } from '@angular/router';
import { catchError } from 'rxjs';

import { SnackbarService } from '@core/services/snackbar/snackbar.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const snackbar = inject(SnackbarService);
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      switch (err.status) {
        case 400:
          if (err.error.errors) {
            handleModelStateErrors(err.error.errors);
          }
          snackbar.error(err.error.title || err.error);
          break;
        case 401:
          snackbar.error(err.error.title || err.error);
          break;
        case 404:
          void router.navigateByUrl('/not-found');
          break;
        case 500: {
          const navigationExtras: NavigationExtras = { state: { error: err.error } };
          void router.navigateByUrl('/server-error', navigationExtras);
          break;
        }
      }

      throw err;
    })
  );
};

const handleModelStateErrors = (errors: Record<string, string>) => {
  const modelStateErrors = [];
  for (const key in errors) {
    if (errors[key]) {
      modelStateErrors.push(errors[key]);
    }
  }
  throw modelStateErrors.flat();
};
