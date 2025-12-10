import { TestBed } from '@angular/core/testing';
import { Router, UrlTree, type CanActivateFn } from '@angular/router';
import { vi } from 'vitest';

import { AuthStore } from '@state/auth';
import { GlobalStore } from '@state/global';

import { authGuard, preventLoginAccess } from './auth.guard';

describe('authGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  const mockRouter = {
    createUrlTree: vi.fn((commands: string[]) => ({ mockUrlTree: commands.join('/') }) as unknown as UrlTree),
  };
  let mockAuthStore: { isLoggedIn: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mockAuthStore = { isLoggedIn: vi.fn(() => true) };
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthStore, useValue: mockAuthStore },
        { provide: GlobalStore, useValue: { isInitialized: vi.fn(() => true) } },
        { provide: Router, useValue: mockRouter },
      ],
    });
    vi.clearAllMocks();
  });

  it('allows access when logged in and initialized', () => {
    const route = {} as Parameters<CanActivateFn>[0];
    const state = { url: '/target' } as Parameters<CanActivateFn>[1];

    const result = executeGuard(route, state);
    expect(result).toBe(true);
  });

  it('redirects to login with returnUrl when not logged in', () => {
    mockAuthStore.isLoggedIn.mockReturnValue(false);

    const route = {} as Parameters<CanActivateFn>[0];
    const state = { url: '/secure' } as Parameters<CanActivateFn>[1];

    const result = executeGuard(route, state) as UrlTree;
    expect(result).toEqual({ mockUrlTree: '/login' });
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith(['/login'], { queryParams: { returnUrl: '/secure' } });
  });
});

describe('preventLoginAccess', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => TestBed.runInInjectionContext(() => preventLoginAccess(...guardParameters));

  const mockRouter = {
    createUrlTree: vi.fn((commands: string[]) => ({ mockUrlTree: commands.join('/') }) as unknown as UrlTree),
  };
  let mockAuthStore: { isLoggedIn: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mockAuthStore = { isLoggedIn: vi.fn(() => false) };
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthStore, useValue: mockAuthStore },
        { provide: GlobalStore, useValue: { isInitialized: vi.fn(() => true) } },
        { provide: Router, useValue: mockRouter },
      ],
    });
    vi.clearAllMocks();
  });

  it('redirects to shop when already logged in', () => {
    mockAuthStore.isLoggedIn.mockReturnValue(true);

    const route = {} as Parameters<CanActivateFn>[0];
    const state = { url: '/login' } as Parameters<CanActivateFn>[1];

    const result = executeGuard(route, state) as UrlTree;
    expect(result).toEqual({ mockUrlTree: '/shop' });
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith(['/shop'], { queryParams: undefined });
  });

  it('allows access when not logged in', () => {
    const route = {} as Parameters<CanActivateFn>[0];
    const state = { url: '/login' } as Parameters<CanActivateFn>[1];

    const result = executeGuard(route, state);
    expect(result).toBe(true);
  });
});
