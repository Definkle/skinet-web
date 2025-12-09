import type { ErrorHandlerService } from '@core/services/error-handler/error-handler.service';

export const createStoreErrorHandler = (storeName: string, errorHandler: ErrorHandlerService) => (error: unknown) =>
  errorHandler.handleError(storeName, error);
