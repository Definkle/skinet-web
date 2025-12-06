import { inject, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Logger } from '../logger/logger.service';
import { Snackbar } from '../snackbar/snackbar.service';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandler {
  private readonly _logger = inject(Logger);
  private readonly _snackbar = inject(Snackbar);

  handleError(context: string, error: unknown, showNotification = true): void {
    this._logger.error(context, error);

    if (showNotification) {
      const message = this.getErrorMessage(error);
      this._snackbar.error(message);
    }
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      // Server-side error
      if (error.error?.message) {
        return error.error.message;
      }
      // Client-side or network error
      if (error.status === 0) {
        return 'Network error. Please check your connection.';
      }
      return `Error: ${error.message}`;
    }

    if (error instanceof Error) {
      return error.message;
    }

    return 'An unexpected error occurred.';
  }
}
