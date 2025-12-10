import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';

import { ErrorHandlerService } from '@core/services/error-handler/error-handler.service';

import { AuthStore } from '@state/auth';
import { CartStore } from '@state/cart';

import { GlobalStore } from './global.store';

const wait = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));

interface MockAuthStore {
  initAuth: Mock;
}

interface MockCartStore {
  initCart: Mock;
}

interface MockErrorHandlerService {
  handleError: Mock;
}

describe('GlobalStore', () => {
  let store: InstanceType<typeof GlobalStore>;
  let mockAuthStore: MockAuthStore;
  let mockCartStore: MockCartStore;
  let mockErrorHandler: MockErrorHandlerService;

  beforeEach(() => {
    const existingSplash = document.getElementById('initial-splash');
    if (existingSplash) {
      existingSplash.remove();
    }

    mockAuthStore = {
      initAuth: vi.fn(),
    };

    mockCartStore = {
      initCart: vi.fn(),
    };

    mockErrorHandler = {
      handleError: vi.fn(),
    };

    const mockSplash = document.createElement('div');
    mockSplash.id = 'initial-splash';
    document.body.appendChild(mockSplash);

    TestBed.configureTestingModule({
      providers: [
        GlobalStore,
        { provide: AuthStore, useValue: mockAuthStore },
        { provide: CartStore, useValue: mockCartStore },
        { provide: ErrorHandlerService, useValue: mockErrorHandler },
      ],
    });

    store = TestBed.inject(GlobalStore);
  });

  describe('Initial State', () => {
    it('should initialize with default state', () => {
      expect(store.isLoading()).toBe(false);
      expect(store.ongoingRequestsCount()).toBe(0);
      expect(store.isInitialized()).toBe(false);
    });
  });

  describe('initApp', () => {
    it('should initialize auth and cart stores', async () => {
      store.initApp();

      await wait(600);
      expect(mockAuthStore.initAuth).toHaveBeenCalled();
      expect(mockCartStore.initCart).toHaveBeenCalled();
      expect(store.isLoading()).toBe(false);
      expect(store.isInitialized()).toBe(true);
    });

    it('should set loading state during initialization', () => {
      store.initApp();

      expect(store.isLoading()).toBe(true);
    });

    it('should remove splash screen after initialization', async () => {
      const splash = document.getElementById('initial-splash');
      expect(splash).toBeTruthy();

      store.initApp();

      await wait(600);
      const splashAfter = document.getElementById('initial-splash');
      expect(splashAfter).toBeNull();
    });

    it('should handle missing splash screen gracefully', async () => {
      const splash = document.getElementById('initial-splash');
      if (splash) {
        splash.remove();
      }

      store.initApp();

      await wait(600);
      expect(store.isInitialized()).toBe(true);
    });
  });

  describe('incrementOngoingRequestsCount', () => {
    it('should increment counter and set loading to true', async () => {
      store.incrementOngoingRequestsCount();

      await wait(20);
      expect(store.ongoingRequestsCount()).toBe(1);
      expect(store.isLoading()).toBe(true);
    });

    it('should increment counter multiple times', async () => {
      store.incrementOngoingRequestsCount();

      await wait(20);
      store.incrementOngoingRequestsCount();

      await wait(20);
      store.incrementOngoingRequestsCount();

      await wait(20);
      expect(store.ongoingRequestsCount()).toBe(3);
      expect(store.isLoading()).toBe(true);
    });
  });

  describe('decrementOngoingRequestsCount', () => {
    it('should decrement counter', async () => {
      store.incrementOngoingRequestsCount();

      await wait(20);
      store.incrementOngoingRequestsCount();

      await wait(20);
      store.decrementOngoingRequestsCount();

      await wait(20);
      expect(store.ongoingRequestsCount()).toBe(1);
      expect(store.isLoading()).toBe(true);
    });

    it('should set loading to false when counter reaches zero', async () => {
      store.incrementOngoingRequestsCount();

      await wait(20);
      store.decrementOngoingRequestsCount();

      await wait(20);
      expect(store.ongoingRequestsCount()).toBe(0);
      expect(store.isLoading()).toBe(false);
    });

    it('should not go below zero', async () => {
      store.decrementOngoingRequestsCount();

      await wait(20);
      store.decrementOngoingRequestsCount();

      await wait(20);
      expect(store.ongoingRequestsCount()).toBe(0);
      expect(store.isLoading()).toBe(false);
    });

    it('should handle multiple increments and decrements', async () => {
      store.incrementOngoingRequestsCount();

      await wait(20);
      store.incrementOngoingRequestsCount();

      await wait(20);
      store.incrementOngoingRequestsCount();

      await wait(20);
      expect(store.ongoingRequestsCount()).toBe(3);

      store.decrementOngoingRequestsCount();

      await wait(20);
      expect(store.ongoingRequestsCount()).toBe(2);
      expect(store.isLoading()).toBe(true);

      store.decrementOngoingRequestsCount();

      await wait(20);
      expect(store.ongoingRequestsCount()).toBe(1);
      expect(store.isLoading()).toBe(true);

      store.decrementOngoingRequestsCount();

      await wait(20);
      expect(store.ongoingRequestsCount()).toBe(0);
      expect(store.isLoading()).toBe(false);
    });
  });
});
