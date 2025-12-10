import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';

import { ErrorHandlerService } from '@core/services/error-handler/error-handler.service';

import { PaymentsApiService } from '@features/checkout/services/payments/payments-api.service';

import { AuthStore } from '@state/auth';
import { CartStore } from '@state/cart';

import { StripeStore } from './stripe.store';

vi.mock('@stripe/stripe-js', () => ({
  loadStripe: vi.fn(),
}));

interface MockPaymentsApiService {
  createOrUpdatePaymentIntent$: Mock;
}

interface MockErrorHandlerService {
  handleError: Mock;
}

interface MockCartStore {
  id: Mock;
  updateCartState: Mock;
}

interface MockAuthStore {
  user: Mock;
}

const mockAddress = {
  line1: '123 Test St',
  line2: 'Apt 4',
  city: 'Test City',
  state: 'TS',
  postalCode: '12345',
  country: 'US',
};

const mockUser = {
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  address: mockAddress,
};

const mockCart = {
  id: 'test-cart-id',
  items: [],
  deliveryFee: 5,
  vouchers: [],
  deliveryMethodId: null,
  clientSecret: 'test_client_secret_123',
  paymentIntentId: 'pi_test_123',
};

const mockAddressElement = {
  mount: vi.fn(),
  on: vi.fn(),
  destroy: vi.fn(),
};

const mockElements = {
  create: vi.fn().mockReturnValue(mockAddressElement),
  destroy: vi.fn(),
};

const mockStripeInstance = {
  elements: vi.fn().mockReturnValue(mockElements),
};

const flushMicrotasks = async () => {
  await Promise.resolve();
  await Promise.resolve();
};

describe('StripeStore', () => {
  let store: InstanceType<typeof StripeStore>;
  let mockPaymentsApi: MockPaymentsApiService;
  let mockErrorHandler: MockErrorHandlerService;
  let mockCartStore: MockCartStore;
  let mockAuthStore: MockAuthStore;

  const initializeStripeAndWait = async () => {
    store.initializeStripe(undefined);
    await flushMicrotasks();
  };

  const initializeElementsAndWait = async (cartId = 'test-cart-id') => {
    store.initializeElements(cartId);
    await flushMicrotasks();
  };

  const createAddressElementAndWait = async () => {
    store.createAddressElement(undefined);
    await flushMicrotasks();
  };

  const setupFullStripeFlow = async () => {
    await initializeStripeAndWait();
    await initializeElementsAndWait();
    await createAddressElementAndWait();
  };

  beforeEach(async () => {
    mockPaymentsApi = {
      createOrUpdatePaymentIntent$: vi.fn().mockReturnValue(of(mockCart)),
    };

    mockErrorHandler = {
      handleError: vi.fn(),
    };

    mockCartStore = {
      id: vi.fn().mockReturnValue('test-cart-id'),
      updateCartState: vi.fn(),
    };

    mockAuthStore = {
      user: vi.fn().mockReturnValue(mockUser),
    };

    const { loadStripe } = await import('@stripe/stripe-js');
    (loadStripe as Mock).mockResolvedValue(mockStripeInstance);

    TestBed.configureTestingModule({
      providers: [
        StripeStore,
        { provide: PaymentsApiService, useValue: mockPaymentsApi },
        { provide: ErrorHandlerService, useValue: mockErrorHandler },
        { provide: CartStore, useValue: mockCartStore },
        { provide: AuthStore, useValue: mockAuthStore },
      ],
    });

    store = TestBed.inject(StripeStore);
  });

  describe('Initial State', () => {
    it('should initialize with default state', () => {
      expect(store.instance()).toBeNull();
      expect(store.elements()).toBeNull();
      expect(store.addressElement()).toBeNull();
      expect(store.addressValue()).toBeNull();
      expect(store.isAddressComplete()).toBe(false);
      expect(store.clientSecret()).toBeNull();
      expect(store.isLoading()).toBe(false);
      expect(store.isInitialized()).toBe(false);
      expect(store.error()).toBeNull();
    });
  });

  describe('initializeStripe', () => {
    it('should load Stripe and initialize elements successfully', async () => {
      store.initializeStripe(undefined);

      await flushMicrotasks();

      expect(store.instance()).toBeTruthy();
      expect(store.isInitialized()).toBe(true);
      expect(store.isLoading()).toBe(false);
      expect(store.error()).toBeNull();
      expect(mockPaymentsApi.createOrUpdatePaymentIntent$).toHaveBeenCalledWith('test-cart-id');
      expect(store.elements()).toBeTruthy();
      expect(store.clientSecret()).toBe('test_client_secret_123');
    });

    it('should set loading state during initialization', () => {
      store.initializeStripe(undefined);

      expect(store.isLoading()).toBe(true);
    });

    it('should handle Stripe load error', async () => {
      const error = new Error('Failed to load Stripe');
      const { loadStripe } = await import('@stripe/stripe-js');
      (loadStripe as Mock).mockRejectedValueOnce(error);

      store.initializeStripe(undefined);

      await flushMicrotasks();
      expect(store.isLoading()).toBe(false);
      expect(store.error()).toBe('Failed to load Stripe');
      expect(mockErrorHandler.handleError).toHaveBeenCalledWith('StripeStore', error);
    });
  });

  describe('initializeElements', () => {
    it('should initialize elements successfully when Stripe is ready', async () => {
      await initializeStripeAndWait();

      mockPaymentsApi.createOrUpdatePaymentIntent$.mockClear();
      await initializeElementsAndWait();

      expect(mockPaymentsApi.createOrUpdatePaymentIntent$).toHaveBeenCalledWith('test-cart-id');
      expect(mockCartStore.updateCartState).toHaveBeenCalledWith(mockCart);
      expect(store.elements()).toBeTruthy();
      expect(store.clientSecret()).toBe('test_client_secret_123');
      expect(store.isLoading()).toBe(false);
      expect(store.error()).toBeNull();
    });

    it('should handle error when Stripe instance not initialized', async () => {
      store.initializeElements('test-cart-id');

      await flushMicrotasks();
      expect(store.isLoading()).toBe(false);
      expect(store.error()).toBe('Stripe instance not initialized');
      expect(mockErrorHandler.handleError).toHaveBeenCalledWith('StripeStore', expect.any(Error));
    });

    it('should handle payment intent error', async () => {
      const error = new Error('Payment Intent Error');
      mockPaymentsApi.createOrUpdatePaymentIntent$.mockReturnValue(throwError(() => error));

      await initializeStripeAndWait();

      mockPaymentsApi.createOrUpdatePaymentIntent$.mockClear();
      await initializeElementsAndWait();

      expect(store.isLoading()).toBe(false);
      expect(store.error()).toBe('Payment Intent Error');
      expect(mockErrorHandler.handleError).toHaveBeenCalledWith('StripeStore', error);
    });
  });

  describe('createAddressElement', () => {
    it('should create address element with user data', async () => {
      await setupFullStripeFlow();

      expect(mockElements.create).toHaveBeenCalledWith('address', expect.objectContaining({ mode: 'shipping' }));
      expect(store.addressElement()).toBeTruthy();
      expect(store.error()).toBeNull();
    });

    it('should handle error when elements not initialized', async () => {
      store.createAddressElement(undefined);

      await flushMicrotasks();
      expect(mockErrorHandler.handleError).toHaveBeenCalledWith('StripeStore', expect.any(Error));
      expect(store.error()).toBe('Stripe elements not initialized');
    });
  });

  describe('mountAddressElement', () => {
    it('should mount address element and setup event handler', async () => {
      await setupFullStripeFlow();

      store.mountAddressElement(undefined);
      await flushMicrotasks();

      expect(mockAddressElement.mount).toHaveBeenCalledWith('#addressElement');
      expect(mockAddressElement.on).toHaveBeenCalledWith('change', expect.any(Function));
    });

    it('should update state when address is complete', async () => {
      await initializeStripeAndWait();

      mockAddressElement.on.mockClear();
      await initializeElementsAndWait();
      await createAddressElementAndWait();

      store.mountAddressElement(undefined);
      const changeHandler = mockAddressElement.on.mock.calls.at(-1)?.[1];
      expect(changeHandler).toBeDefined();

      changeHandler?.({
        complete: true,
        value: {
          name: 'Test User',
          address: {
            line1: mockAddress.line1,
            line2: mockAddress.line2,
            city: mockAddress.city,
            state: mockAddress.state,
            postal_code: mockAddress.postalCode,
            country: mockAddress.country,
          },
        },
      });

      await flushMicrotasks();
      expect(store.isAddressComplete()).toBe(true);
      expect(store.addressValue()).toEqual({
        name: 'Test User',
        line1: mockAddress.line1,
        line2: mockAddress.line2,
        city: mockAddress.city,
        state: mockAddress.state,
        postal_code: mockAddress.postalCode,
        country: mockAddress.country,
      });
    });

    it('should update state when address is incomplete', async () => {
      await initializeStripeAndWait();

      mockAddressElement.on.mockClear();
      await initializeElementsAndWait();
      await createAddressElementAndWait();

      store.mountAddressElement(undefined);
      const changeHandler = mockAddressElement.on.mock.calls.at(-1)?.[1];
      expect(changeHandler).toBeDefined();

      changeHandler?.({
        complete: false,
        value: {},
      });

      await flushMicrotasks();
      expect(store.isAddressComplete()).toBe(false);
    });

    it('should handle error when address element not initialized', async () => {
      store.mountAddressElement(undefined);

      await flushMicrotasks();
      expect(mockErrorHandler.handleError).toHaveBeenCalledWith('StripeStore', expect.any(Error));
      expect(store.error()).toBe('Stripe address element not initialized');
    });
  });

  describe('resetElements', () => {
    it('should reset elements state', async () => {
      store.initializeStripe(undefined);
      await flushMicrotasks();

      store.resetElements(undefined);
      await flushMicrotasks();

      expect(store.elements()).toBeNull();
      expect(store.addressElement()).toBeNull();
      expect(store.addressValue()).toBeNull();
      expect(store.isAddressComplete()).toBe(false);
      expect(store.clientSecret()).toBeNull();
      expect(store.error()).toBeNull();
    });
  });

  describe('resetStore', () => {
    it('should reset entire store state', async () => {
      store.initializeStripe(undefined);
      await flushMicrotasks();

      store.resetStore(undefined);
      await flushMicrotasks();

      expect(store.instance()).toBeNull();
      expect(store.elements()).toBeNull();
      expect(store.addressElement()).toBeNull();
      expect(store.addressValue()).toBeNull();
      expect(store.isAddressComplete()).toBe(false);
      expect(store.clientSecret()).toBeNull();
      expect(store.isLoading()).toBe(false);
      expect(store.isInitialized()).toBe(false);
      expect(store.error()).toBeNull();
    });
  });

  describe('clearError', () => {
    it('should clear error state', async () => {
      const error = new Error('Test Error');
      const { loadStripe } = await import('@stripe/stripe-js');
      (loadStripe as Mock).mockRejectedValueOnce(error);

      store.initializeStripe(undefined);
      await flushMicrotasks();

      expect(store.error()).toBeTruthy();

      store.clearError(undefined);
      await flushMicrotasks();

      expect(store.error()).toBeNull();
    });
  });
});
