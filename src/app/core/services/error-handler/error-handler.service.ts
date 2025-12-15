import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { StripeError } from '@stripe/stripe-js';

import { LoggerService } from '@core/services/logger/logger.service';
import { SnackbarService } from '@core/services/snackbar/snackbar.service';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  private readonly _logger = inject(LoggerService);
  private readonly _snackbar = inject(SnackbarService);

  handleError(context: string, error: unknown, showNotification = true): void {
    this._logger.error(context, error);
    if (showNotification) {
      const message = this.getErrorMessage(error);
      this._snackbar.error(message);
    }
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      if (error.error?.message) {
        return error.error.message;
      }
      if (error.status === 0) {
        return 'Network error. Please check your connection.';
      }
      return `Error: ${error.message}`;
    }

    if (error instanceof Error) {
      return error.message;
    }

    const stripeError = error as StripeError;

    if (stripeError.message) {
      return stripeError.message;
    }

    return 'An unexpected error occurred.';
  }
}
