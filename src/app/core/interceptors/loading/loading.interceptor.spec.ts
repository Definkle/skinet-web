import { HttpRequest, HttpResponse, type HttpInterceptorFn } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';

import { GlobalStore } from '@state/global/global.store';

import { loadingInterceptor } from './loading.interceptor';

interface MockGlobalStore {
  incrementOngoingRequestsCount: Mock;
  decrementOngoingRequestsCount: Mock;
}

describe('loadingInterceptor', () => {
  let mockGlobalStore: MockGlobalStore;

  beforeEach(() => {
    mockGlobalStore = {
      incrementOngoingRequestsCount: vi.fn(),
      decrementOngoingRequestsCount: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: GlobalStore, useValue: mockGlobalStore }],
    });
  });

  it('should be created', () => {
    const interceptor: HttpInterceptorFn = (req, next) => TestBed.runInInjectionContext(() => loadingInterceptor(req, next));
    expect(interceptor).toBeTruthy();
  });

  describe('Request Counter Management', () => {
    it('should increment counter when request starts', () => {
      TestBed.runInInjectionContext(() => {
        const request = new HttpRequest('GET', '/api/test');
        const handler = {
          handle: () => of(new HttpResponse({ body: { data: 'test' } })),
        };

        loadingInterceptor(request, handler.handle).subscribe();

        expect(mockGlobalStore.incrementOngoingRequestsCount).toHaveBeenCalledTimes(1);
      });
    });

    it('should decrement counter when request completes successfully', async () => {
      TestBed.runInInjectionContext(async () => {
        const request = new HttpRequest('GET', '/api/test');
        const handler = {
          handle: () => of(new HttpResponse({ body: { data: 'test' } })),
        };

        loadingInterceptor(request, handler.handle).subscribe();

        await new Promise((resolve) => setTimeout(resolve, 100));

        expect(mockGlobalStore.incrementOngoingRequestsCount).toHaveBeenCalledTimes(1);
        expect(mockGlobalStore.decrementOngoingRequestsCount).toHaveBeenCalledTimes(1);
      });
    });

    it('should decrement counter when request fails', async () => {
      TestBed.runInInjectionContext(async () => {
        const request = new HttpRequest('GET', '/api/test');
        const handler = {
          handle: () => throwError(() => new Error('Request failed')),
        };

        loadingInterceptor(request, handler.handle).subscribe({
          error: () => {
            // Expected error
          },
        });

        await new Promise((resolve) => setTimeout(resolve, 100));

        expect(mockGlobalStore.incrementOngoingRequestsCount).toHaveBeenCalledTimes(1);
        expect(mockGlobalStore.decrementOngoingRequestsCount).toHaveBeenCalledTimes(1);
      });
    });

    it('should handle multiple concurrent requests', () => {
      TestBed.runInInjectionContext(() => {
        const request1 = new HttpRequest('GET', '/api/test1');
        const request2 = new HttpRequest('GET', '/api/test2');
        const request3 = new HttpRequest('POST', '/api/test3', {});

        const handler1 = { handle: () => of(new HttpResponse({ body: { data: 'test1' } })) };
        const handler2 = { handle: () => of(new HttpResponse({ body: { data: 'test2' } })) };
        const handler3 = { handle: () => of(new HttpResponse({ body: { data: 'test3' } })) };

        loadingInterceptor(request1, handler1.handle).subscribe();
        loadingInterceptor(request2, handler2.handle).subscribe();
        loadingInterceptor(request3, handler3.handle).subscribe();

        expect(mockGlobalStore.incrementOngoingRequestsCount).toHaveBeenCalledTimes(3);
      });
    });

    it('should decrement counter for each completed request in concurrent scenario', async () => {
      TestBed.runInInjectionContext(() => {
        const request1 = new HttpRequest('GET', '/api/test1');
        const request2 = new HttpRequest('GET', '/api/test2');

        const handler1 = { handle: () => of(new HttpResponse({ body: { data: 'test1' } })) };
        const handler2 = { handle: () => of(new HttpResponse({ body: { data: 'test2' } })) };

        loadingInterceptor(request1, handler1.handle).subscribe();
        loadingInterceptor(request2, handler2.handle).subscribe();

        return new Promise((resolve) => {
          setTimeout(() => {
            expect(mockGlobalStore.incrementOngoingRequestsCount).toHaveBeenCalledTimes(1);
            resolve(undefined);
          }, 100);
        });
      });
    });
  });

  describe('Request Lifecycle', () => {
    it('should call increment before next handler', () => {
      TestBed.runInInjectionContext(() => {
        const request = new HttpRequest('GET', '/api/test');
        let nextCalled = false;

        const handler = {
          handle: () => {
            nextCalled = true;
            expect(mockGlobalStore.incrementOngoingRequestsCount).toHaveBeenCalled();
            return of(new HttpResponse({ body: { data: 'test' } }));
          },
        };

        loadingInterceptor(request, handler.handle).subscribe();

        expect(nextCalled).toBe(true);
      });
    });

    it('should call decrement in finalize regardless of success or failure', async () => {
      TestBed.runInInjectionContext(() => {
        const successRequest = new HttpRequest('GET', '/api/success');
        const failureRequest = new HttpRequest('GET', '/api/failure');

        const successHandler = {
          handle: () => of(new HttpResponse({ body: { data: 'success' } })),
        };

        const failureHandler = {
          handle: () => throwError(() => new Error('Failure')),
        };

        loadingInterceptor(successRequest, successHandler.handle).subscribe();

        loadingInterceptor(failureRequest, failureHandler.handle).subscribe({
          error: () => {
            // Expected error
          },
        });

        return new Promise((resolve) => {
          setTimeout(() => {
            expect(mockGlobalStore.incrementOngoingRequestsCount).toHaveBeenCalledTimes(1);
            resolve(undefined);
          }, 100);
        });
      });
    });
  });

  describe('Different Request Types', () => {
    it('should handle GET requests', () => {
      TestBed.runInInjectionContext(() => {
        const request = new HttpRequest('GET', '/api/test');
        const handler = { handle: () => of(new HttpResponse({ body: { data: 'test' } })) };

        loadingInterceptor(request, handler.handle).subscribe();

        expect(mockGlobalStore.incrementOngoingRequestsCount).toHaveBeenCalled();
      });
    });

    it('should handle POST requests', () => {
      TestBed.runInInjectionContext(() => {
        const request = new HttpRequest('POST', '/api/test', { data: 'test' });
        const handler = { handle: () => of(new HttpResponse({ body: { data: 'created' } })) };

        loadingInterceptor(request, handler.handle).subscribe();

        expect(mockGlobalStore.incrementOngoingRequestsCount).toHaveBeenCalled();
      });
    });

    it('should handle PUT requests', () => {
      TestBed.runInInjectionContext(() => {
        const request = new HttpRequest('PUT', '/api/test/1', { data: 'updated' });
        const handler = { handle: () => of(new HttpResponse({ body: { data: 'updated' } })) };

        loadingInterceptor(request, handler.handle).subscribe();

        expect(mockGlobalStore.incrementOngoingRequestsCount).toHaveBeenCalled();
      });
    });

    it('should handle DELETE requests', () => {
      TestBed.runInInjectionContext(() => {
        const request = new HttpRequest('DELETE', '/api/test/1');
        const handler = { handle: () => of(new HttpResponse({ body: null })) };

        loadingInterceptor(request, handler.handle).subscribe();

        expect(mockGlobalStore.incrementOngoingRequestsCount).toHaveBeenCalled();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty response', async () => {
      TestBed.runInInjectionContext(() => {
        const request = new HttpRequest('GET', '/api/test');
        const handler = { handle: () => of(new HttpResponse({ body: null })) };

        loadingInterceptor(request, handler.handle).subscribe();

        return new Promise((resolve) => {
          setTimeout(() => {
            expect(mockGlobalStore.incrementOngoingRequestsCount).toHaveBeenCalled();
            expect(mockGlobalStore.decrementOngoingRequestsCount).toHaveBeenCalled();
            resolve(undefined);
          }, 100);
        });
      });
    });

    it('should handle unsubscribe before completion', () => {
      TestBed.runInInjectionContext(() => {
        const request = new HttpRequest('GET', '/api/test');
        const handler = { handle: () => of(new HttpResponse({ body: { data: 'test' } })) };

        const subscription = loadingInterceptor(request, handler.handle).subscribe();

        expect(mockGlobalStore.incrementOngoingRequestsCount).toHaveBeenCalledTimes(1);

        subscription.unsubscribe();

        return new Promise((resolve) => {
          setTimeout(() => {
            expect(mockGlobalStore.decrementOngoingRequestsCount).toHaveBeenCalled();
            resolve(undefined);
          }, 100);
        });
      });
    });
  });
});
