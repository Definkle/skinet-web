import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Logger {
  error(context: string, error: unknown): void {
    if (!environment.production) {
      console.error(`[${context}] Error:`, error);
    }
  }

  warn(context: string, message: string, data?: unknown): void {
    if (!environment.production) {
      console.warn(`[${context}] ${message}`, data || '');
    }
  }

  info(context: string, message: string, data?: unknown): void {
    if (!environment.production) {
      console.info(`[${context}] ${message}`, data || '');
    }
  }

  debug(context: string, message: string, data?: unknown): void {
    if (!environment.production) {
      console.debug(`[${context}] ${message}`, data || '');
    }
  }
}
