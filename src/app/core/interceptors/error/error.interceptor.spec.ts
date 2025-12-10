import { HttpErrorResponse, HttpRequest, type HttpInterceptorFn } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';

import { SnackbarService } from '@core/services/snackbar/snackbar.service';

import { errorInterceptor } from './error.interceptor';

interface MockRouter {
  navigateByUrl: Mock;
}

interface MockSnackbarService {
  error: Mock;
}

describe('errorInterceptor', () => {
  let mockRouter: MockRouter;
  let mockSnackbar: MockSnackbarService;

  beforeEach(() => {
    mockRouter = {
      navigateByUrl: vi.fn().mockResolvedValue(true),
    };

    mockSnackbar = {
      error: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClientTesting(),
        { provide: Router, useValue: mockRouter },
        { provide: SnackbarService, useValue: mockSnackbar },
      ],
    });
  });

  it('should be created', () => {
    const interceptor: HttpInterceptorFn = (req, next) => TestBed.runInInjectionContext(() => errorInterceptor(req, next));
    expect(interceptor).toBeTruthy();
  });

  describe('400 Bad Request', () => {
    it('should show error message for simple 400 error', async () => {
      const testUrl = '/api/test';
      const errorMessage = 'Bad request error message';

      await TestBed.runInInjectionContext(() => {
        const request = new HttpRequest('GET', testUrl);
        const handler = {
          handle: () => {
            return throwError(
              () =>
                new HttpErrorResponse({
                  error: { title: errorMessage },
                  status: 400,
                  statusText: 'Bad Request',
                  url: testUrl,
                })
            );
          },
        };

        return new Promise<void>((resolve) => {
          errorInterceptor(request, handler.handle).subscribe({
            error: () => {
              expect(mockSnackbar.error).toHaveBeenCalledWith(errorMessage);
              resolve();
            },
          });
        });
      });
    });

    it('should show error message when title is missing', async () => {
      const testUrl = '/api/test';
      const errorMessage = 'Generic error';

      await TestBed.runInInjectionContext(() => {
        const request = new HttpRequest('GET', testUrl);
        const handler = {
          handle: () => {
            return throwError(
              () =>
                new HttpErrorResponse({
                  error: errorMessage,
                  status: 400,
                  statusText: 'Bad Request',
                  url: testUrl,
                })
            );
          },
        };

        return new Promise<void>((resolve) => {
          errorInterceptor(request, handler.handle).subscribe({
            error: () => {
              expect(mockSnackbar.error).toHaveBeenCalledWith(errorMessage);
              resolve();
            },
          });
        });
      });
    });

    it('should handle model state errors', async () => {
      const testUrl = '/api/test';
      const modelStateErrors = {
        Email: 'Email is required',
        Password: 'Password must be at least 8 characters',
      };

      await TestBed.runInInjectionContext(() => {
        const request = new HttpRequest('POST', testUrl, {});
        const handler = {
          handle: () => {
            return throwError(
              () =>
                new HttpErrorResponse({
                  error: {
                    title: 'Validation failed',
                    errors: modelStateErrors,
                  },
                  status: 400,
                  statusText: 'Bad Request',
                  url: testUrl,
                })
            );
          },
        };

        return new Promise<void>((resolve) => {
          errorInterceptor(request, handler.handle).subscribe({
            error: (error) => {
              expect(mockSnackbar.error).toHaveBeenCalledWith('Validation failed');
              expect(error).toEqual(['Email is required', 'Password must be at least 8 characters']);
              resolve();
            },
          });
        });
      });
    });
  });

  describe('401 Unauthorized', () => {
    it('should show error message for 401 error', async () => {
      const testUrl = '/api/test';
      const errorMessage = 'Unauthorized access';

      await TestBed.runInInjectionContext(() => {
        const request = new HttpRequest('GET', testUrl);
        const handler = {
          handle: () => {
            return throwError(
              () =>
                new HttpErrorResponse({
                  error: { title: errorMessage },
                  status: 401,
                  statusText: 'Unauthorized',
                  url: testUrl,
                })
            );
          },
        };

        return new Promise<void>((resolve) => {
          errorInterceptor(request, handler.handle).subscribe({
            error: () => {
              expect(mockSnackbar.error).toHaveBeenCalledWith(errorMessage);
              resolve();
            },
          });
        });
      });
    });

    it('should show error message when title is missing for 401', async () => {
      const testUrl = '/api/test';
      const errorMessage = 'Not authorized';

      TestBed.runInInjectionContext(() => {
        const request = new HttpRequest('GET', testUrl);
        const handler = {
          handle: () => {
            return throwError(
              () =>
                new HttpErrorResponse({
                  error: errorMessage,
                  status: 401,
                  statusText: 'Unauthorized',
                  url: testUrl,
                })
            );
          },
        };

        errorInterceptor(request, handler.handle).subscribe({
          error: () => {
            expect(mockSnackbar.error).toHaveBeenCalledWith(errorMessage);
          },
        });
      });
    });
  });

  describe('404 Not Found', () => {
    it('should navigate to /not-found for 404 error', async () => {
      const testUrl = '/api/test';

      TestBed.runInInjectionContext(() => {
        const request = new HttpRequest('GET', testUrl);
        const handler = {
          handle: () => {
            return throwError(
              () =>
                new HttpErrorResponse({
                  error: 'Not found',
                  status: 404,
                  statusText: 'Not Found',
                  url: testUrl,
                })
            );
          },
        };

        errorInterceptor(request, handler.handle).subscribe({
          error: () => {
            expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/not-found');
          },
        });
      });
    });

    it('should not show snackbar for 404 error', async () => {
      const testUrl = '/api/test';

      TestBed.runInInjectionContext(() => {
        const request = new HttpRequest('GET', testUrl);
        const handler = {
          handle: () => {
            return throwError(
              () =>
                new HttpErrorResponse({
                  error: 'Not found',
                  status: 404,
                  statusText: 'Not Found',
                  url: testUrl,
                })
            );
          },
        };

        errorInterceptor(request, handler.handle).subscribe({
          error: () => {
            expect(mockSnackbar.error).not.toHaveBeenCalled();
          },
        });
      });
    });
  });

  describe('500 Server Error', () => {
    it('should navigate to /server-error with error state', async () => {
      const testUrl = '/api/test';
      const serverError = {
        message: 'Internal server error',
        details: 'Database connection failed',
      };

      TestBed.runInInjectionContext(() => {
        const request = new HttpRequest('GET', testUrl);
        const handler = {
          handle: () => {
            return throwError(
              () =>
                new HttpErrorResponse({
                  error: serverError,
                  status: 500,
                  statusText: 'Internal Server Error',
                  url: testUrl,
                })
            );
          },
        };

        errorInterceptor(request, handler.handle).subscribe({
          error: () => {
            expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/server-error', {
              state: { error: serverError },
            });
          },
        });
      });
    });

    it('should not show snackbar for 500 error', async () => {
      const testUrl = '/api/test';

      TestBed.runInInjectionContext(() => {
        const request = new HttpRequest('GET', testUrl);
        const handler = {
          handle: () => {
            return throwError(
              () =>
                new HttpErrorResponse({
                  error: 'Server error',
                  status: 500,
                  statusText: 'Internal Server Error',
                  url: testUrl,
                })
            );
          },
        };

        errorInterceptor(request, handler.handle).subscribe({
          error: () => {
            expect(mockSnackbar.error).not.toHaveBeenCalled();
          },
        });
      });
    });
  });

  describe('Other Error Codes', () => {
    it('should rethrow 403 error without handling', async () => {
      const testUrl = '/api/test';

      TestBed.runInInjectionContext(() => {
        const request = new HttpRequest('GET', testUrl);
        const handler = {
          handle: () => {
            return throwError(
              () =>
                new HttpErrorResponse({
                  error: 'Forbidden',
                  status: 403,
                  statusText: 'Forbidden',
                  url: testUrl,
                })
            );
          },
        };

        errorInterceptor(request, handler.handle).subscribe({
          error: (error) => {
            expect(mockSnackbar.error).not.toHaveBeenCalled();
            expect(mockRouter.navigateByUrl).not.toHaveBeenCalled();
            expect(error).toBeInstanceOf(HttpErrorResponse);
          },
        });
      });
    });

    it('should rethrow 503 error without handling', async () => {
      const testUrl = '/api/test';

      TestBed.runInInjectionContext(() => {
        const request = new HttpRequest('GET', testUrl);
        const handler = {
          handle: () => {
            return throwError(
              () =>
                new HttpErrorResponse({
                  error: 'Service unavailable',
                  status: 503,
                  statusText: 'Service Unavailable',
                  url: testUrl,
                })
            );
          },
        };

        errorInterceptor(request, handler.handle).subscribe({
          error: (error) => {
            expect(mockSnackbar.error).not.toHaveBeenCalled();
            expect(mockRouter.navigateByUrl).not.toHaveBeenCalled();
            expect(error).toBeInstanceOf(HttpErrorResponse);
          },
        });
      });
    });
  });

  describe('Error Rethrowing', () => {
    it('should always rethrow error after handling', async () => {
      const testUrl = '/api/test';

      TestBed.runInInjectionContext(() => {
        const request = new HttpRequest('GET', testUrl);
        const handler = {
          handle: () => {
            return throwError(
              () =>
                new HttpErrorResponse({
                  error: { title: 'Bad request' },
                  status: 400,
                  statusText: 'Bad Request',
                  url: testUrl,
                })
            );
          },
        };

        errorInterceptor(request, handler.handle).subscribe({
          error: (error) => {
            expect(error).toBeInstanceOf(HttpErrorResponse);
          },
        });
      });
    });
  });
});
