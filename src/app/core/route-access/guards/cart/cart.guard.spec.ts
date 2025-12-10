import { TestBed } from '@angular/core/testing';
import type { CanActivateFn } from '@angular/router';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';

import { SnackbarService } from '@core/services/snackbar/snackbar.service';

import { CartStore } from '@state/cart';
import { GlobalStore } from '@state/global';

import { cartGuard } from './cart.guard';

describe('cartGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => TestBed.runInInjectionContext(() => cartGuard(...guardParameters));

  let mockSnackbar: { error: ReturnType<typeof vi.fn> };
  let mockCartStore: { isEmpty: ReturnType<typeof vi.fn> };
  let mockGlobalStore: { isInitialized: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mockSnackbar = { error: vi.fn() };
    mockCartStore = { isEmpty: vi.fn(() => false) };
    mockGlobalStore = { isInitialized: vi.fn(() => true) };

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: SnackbarService, useValue: mockSnackbar },
        { provide: CartStore, useValue: mockCartStore },
        { provide: GlobalStore, useValue: mockGlobalStore },
      ],
    });
    vi.clearAllMocks();
  });

  it('allows navigation when cart is not empty', () => {
    mockCartStore.isEmpty.mockReturnValue(false);

    const route = {} as Parameters<CanActivateFn>[0];
    const state = {} as Parameters<CanActivateFn>[1];

    const result = executeGuard(route, state);
    expect(result).toBe(true);
    expect(mockSnackbar.error).not.toHaveBeenCalled();
  });

  it('blocks navigation and shows error when cart is empty', () => {
    mockCartStore.isEmpty.mockReturnValue(true);

    const route = {} as Parameters<CanActivateFn>[0];
    const state = {} as Parameters<CanActivateFn>[1];

    const result = executeGuard(route, state);
    expect(result).toBe(false);
    expect(mockSnackbar.error).toHaveBeenCalledWith('Your cart is empty!');
  });
});
