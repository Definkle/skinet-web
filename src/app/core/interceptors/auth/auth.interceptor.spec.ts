import { HttpRequest, HttpResponse, type HttpInterceptorFn } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';

import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    const interceptor: HttpInterceptorFn = (req, next) => TestBed.runInInjectionContext(() => authInterceptor(req, next));
    expect(interceptor).toBeTruthy();
  });

  describe('Credentials Configuration', () => {
    it('should add withCredentials: true to the request', () => {
      TestBed.runInInjectionContext(() => {
        const request = new HttpRequest('GET', '/api/test');
        const handler = {
          handle: (modifiedRequest: HttpRequest<unknown>) => {
            expect(modifiedRequest.withCredentials).toBe(true);
            return of(new HttpResponse({ body: { data: 'test' } }));
          },
        };

        authInterceptor(request, handler.handle).subscribe();
      });
    });

    it('should clone the original request', () => {
      TestBed.runInInjectionContext(() => {
        const originalRequest = new HttpRequest('GET', '/api/test');
        const handler = {
          handle: (modifiedRequest: HttpRequest<unknown>) => {
            expect(modifiedRequest).not.toBe(originalRequest);
            expect(modifiedRequest.url).toBe(originalRequest.url);
            expect(modifiedRequest.method).toBe(originalRequest.method);
            return of(new HttpResponse({ body: { data: 'test' } }));
          },
        };

        authInterceptor(originalRequest, handler.handle).subscribe();
      });
    });
  });

  describe('Request Methods', () => {
    it('should add credentials to GET requests', () => {
      TestBed.runInInjectionContext(() => {
        const request = new HttpRequest('GET', '/api/users');
        const handler = {
          handle: (modifiedRequest: HttpRequest<unknown>) => {
            expect(modifiedRequest.withCredentials).toBe(true);
            expect(modifiedRequest.method).toBe('GET');
            return of(new HttpResponse({ body: { data: [] } }));
          },
        };

        authInterceptor(request, handler.handle).subscribe();
      });
    });

    it('should add credentials to POST requests', () => {
      TestBed.runInInjectionContext(() => {
        const request = new HttpRequest('POST', '/api/users', { name: 'Test User' });
        const handler = {
          handle: (modifiedRequest: HttpRequest<unknown>) => {
            expect(modifiedRequest.withCredentials).toBe(true);
            expect(modifiedRequest.method).toBe('POST');
            expect(modifiedRequest.body).toEqual({ name: 'Test User' });
            return of(new HttpResponse({ body: { data: { id: 1, name: 'Test User' } } }));
          },
        };

        authInterceptor(request, handler.handle).subscribe();
      });
    });

    it('should add credentials to PUT requests', () => {
      TestBed.runInInjectionContext(() => {
        const request = new HttpRequest('PUT', '/api/users/1', { name: 'Updated User' });
        const handler = {
          handle: (modifiedRequest: HttpRequest<unknown>) => {
            expect(modifiedRequest.withCredentials).toBe(true);
            expect(modifiedRequest.method).toBe('PUT');
            return of(new HttpResponse({ body: { data: { id: 1, name: 'Updated User' } } }));
          },
        };

        authInterceptor(request, handler.handle).subscribe();
      });
    });

    it('should add credentials to DELETE requests', () => {
      TestBed.runInInjectionContext(() => {
        const request = new HttpRequest('DELETE', '/api/users/1');
        const handler = {
          handle: (modifiedRequest: HttpRequest<unknown>) => {
            expect(modifiedRequest.withCredentials).toBe(true);
            expect(modifiedRequest.method).toBe('DELETE');
            return of(new HttpResponse({ body: null }));
          },
        };

        authInterceptor(request, handler.handle).subscribe();
      });
    });

    it('should add credentials to PATCH requests', () => {
      TestBed.runInInjectionContext(() => {
        const request = new HttpRequest('PATCH', '/api/users/1', { name: 'Patched' });
        const handler = {
          handle: (modifiedRequest: HttpRequest<unknown>) => {
            expect(modifiedRequest.withCredentials).toBe(true);
            expect(modifiedRequest.method).toBe('PATCH');
            return of(new HttpResponse({ body: { data: { id: 1, name: 'Patched' } } }));
          },
        };

        authInterceptor(request, handler.handle).subscribe();
      });
    });
  });

  describe('Request Headers Preservation', () => {
    it('should preserve existing headers', () => {
      TestBed.runInInjectionContext(() => {
        const request = new HttpRequest('GET', '/api/test').clone({
          setHeaders: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer token123',
          },
        });

        const handler = {
          handle: (modifiedRequest: HttpRequest<unknown>) => {
            expect(modifiedRequest.headers.get('Content-Type')).toBe('application/json');
            expect(modifiedRequest.headers.get('Authorization')).toBe('Bearer token123');
            expect(modifiedRequest.withCredentials).toBe(true);
            return of(new HttpResponse({ body: { data: 'test' } }));
          },
        };

        authInterceptor(request, handler.handle).subscribe();
      });
    });

    it('should preserve custom headers', () => {
      TestBed.runInInjectionContext(() => {
        const request = new HttpRequest('POST', '/api/test', { data: 'test' }).clone({
          setHeaders: {
            'X-Custom-Header': 'custom-value',
            'X-Request-Id': '12345',
          },
        });

        const handler = {
          handle: (modifiedRequest: HttpRequest<unknown>) => {
            expect(modifiedRequest.headers.get('X-Custom-Header')).toBe('custom-value');
            expect(modifiedRequest.headers.get('X-Request-Id')).toBe('12345');
            expect(modifiedRequest.withCredentials).toBe(true);
            return of(new HttpResponse({ body: { data: 'created' } }));
          },
        };

        authInterceptor(request, handler.handle).subscribe();
      });
    });
  });

  describe('Request Body Preservation', () => {
    it('should preserve request body for POST', () => {
      TestBed.runInInjectionContext(() => {
        const requestBody = { username: 'testuser', password: 'password123' };
        const request = new HttpRequest('POST', '/api/login', requestBody);

        const handler = {
          handle: (modifiedRequest: HttpRequest<unknown>) => {
            expect(modifiedRequest.body).toEqual(requestBody);
            expect(modifiedRequest.withCredentials).toBe(true);
            return of(new HttpResponse({ body: { token: 'abc123' } }));
          },
        };

        authInterceptor(request, handler.handle).subscribe();
      });
    });

    it('should preserve request body for PUT', () => {
      TestBed.runInInjectionContext(() => {
        const requestBody = { id: 1, name: 'Updated Name', email: 'updated@test.com' };
        const request = new HttpRequest('PUT', '/api/users/1', requestBody);

        const handler = {
          handle: (modifiedRequest: HttpRequest<unknown>) => {
            expect(modifiedRequest.body).toEqual(requestBody);
            expect(modifiedRequest.withCredentials).toBe(true);
            return of(new HttpResponse({ body: requestBody }));
          },
        };

        authInterceptor(request, handler.handle).subscribe();
      });
    });
  });

  describe('Different URLs', () => {
    it('should add credentials to API requests', () => {
      TestBed.runInInjectionContext(() => {
        const request = new HttpRequest('GET', '/api/products');
        const handler = {
          handle: (modifiedRequest: HttpRequest<unknown>) => {
            expect(modifiedRequest.withCredentials).toBe(true);
            return of(new HttpResponse({ body: { data: [] } }));
          },
        };

        authInterceptor(request, handler.handle).subscribe();
      });
    });

    it('should add credentials to absolute URLs', () => {
      TestBed.runInInjectionContext(() => {
        const request = new HttpRequest('GET', 'https://localhost:5000/api/test');
        const handler = {
          handle: (modifiedRequest: HttpRequest<unknown>) => {
            expect(modifiedRequest.withCredentials).toBe(true);
            expect(modifiedRequest.url).toBe('https://localhost:5000/api/test');
            return of(new HttpResponse({ body: { data: 'test' } }));
          },
        };

        authInterceptor(request, handler.handle).subscribe();
      });
    });

    it('should add credentials to relative URLs', () => {
      TestBed.runInInjectionContext(() => {
        const request = new HttpRequest('GET', 'users/profile');
        const handler = {
          handle: (modifiedRequest: HttpRequest<unknown>) => {
            expect(modifiedRequest.withCredentials).toBe(true);
            expect(modifiedRequest.url).toBe('users/profile');
            return of(new HttpResponse({ body: { data: {} } }));
          },
        };

        authInterceptor(request, handler.handle).subscribe();
      });
    });
  });

  describe('Response Handling', () => {
    it('should pass through successful responses', async () => {
      TestBed.runInInjectionContext(() => {
        const request = new HttpRequest('GET', '/api/test');
        const expectedResponse = new HttpResponse({ body: { data: 'test data' } });

        const handler = {
          handle: () => of(expectedResponse),
        };

        return new Promise<void>((resolve) => {
          authInterceptor(request, handler.handle).subscribe({
            next: (response) => {
              expect(response).toEqual(expectedResponse);
              resolve();
            },
          });
        });
      });
    });

    it('should pass through error responses', async () => {
      TestBed.runInInjectionContext(() => {
        const request = new HttpRequest('GET', '/api/test');
        const handler = {
          handle: () => {
            throw new Error('Request failed');
          },
        };

        try {
          authInterceptor(request, handler.handle).subscribe();
        } catch (error) {
          expect(error).toBeInstanceOf(Error);
          expect((error as Error).message).toBe('Request failed');
        }
      });
    });
  });

  describe('Request Parameters Preservation', () => {
    it('should preserve query parameters', () => {
      TestBed.runInInjectionContext(() => {
        const request = new HttpRequest('GET', '/api/products').clone({
          setParams: { pageSize: '10', pageIndex: '1', search: 'test' },
        });

        const handler = {
          handle: (modifiedRequest: HttpRequest<unknown>) => {
            expect(modifiedRequest.params.get('pageSize')).toBe('10');
            expect(modifiedRequest.params.get('pageIndex')).toBe('1');
            expect(modifiedRequest.params.get('search')).toBe('test');
            expect(modifiedRequest.withCredentials).toBe(true);
            return of(new HttpResponse({ body: { data: [] } }));
          },
        };

        authInterceptor(request, handler.handle).subscribe();
      });
    });
  });
});
