import { Injectable } from '@angular/core';

import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
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
