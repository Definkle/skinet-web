import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';

import { ErrorHandlerService } from '@core/services/error-handler/error-handler.service';
import { SnackbarService } from '@core/services/snackbar/snackbar.service';

import { AccountApiService } from '@features/auth/services/account-api/account-api.service';
import { LoginApiService } from '@features/auth/services/login-api/login-api.service';

import { AuthStore } from './auth.store';

const wait = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));

interface MockAccountApiService {
  getUserInfo$: Mock;
  register$: Mock;
  logout$: Mock;
  updateAddress$: Mock;
}

interface MockLoginApiService {
  login$: Mock;
}

interface MockErrorHandlerService {
  handleError: Mock;
}

interface MockRouter {
  navigateByUrl: Mock;
}

interface MockActivatedRoute {
  snapshot: {
    queryParams: Record<string, string>;
  };
}

interface MockSnackbarService {
  success: Mock;
}

const mockUser = {
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  address: {
    line1: '123 Test St',
    line2: 'Apt 4',
    city: 'Test City',
    state: 'TS',
    postalCode: '12345',
    country: 'US',
  },
};

describe('AuthStore', () => {
  let store: InstanceType<typeof AuthStore>;
  let mockAccountApi: MockAccountApiService;
  let mockLoginApi: MockLoginApiService;
  let mockErrorHandler: MockErrorHandlerService;
  let mockRouter: MockRouter;
  let mockActivatedRoute: MockActivatedRoute;
  let mockSnackbar: MockSnackbarService;

  beforeEach(() => {
    mockAccountApi = {
      getUserInfo$: vi.fn().mockReturnValue(of(mockUser)),
      register$: vi.fn().mockReturnValue(of(undefined)),
      logout$: vi.fn().mockReturnValue(of(undefined)),
      updateAddress$: vi.fn().mockReturnValue(of(undefined)),
    };

    mockLoginApi = {
      login$: vi.fn().mockReturnValue(of(undefined)),
    };

    mockErrorHandler = {
      handleError: vi.fn(),
    };

    mockRouter = {
      navigateByUrl: vi.fn().mockResolvedValue(true),
    };

    mockActivatedRoute = {
      snapshot: {
        queryParams: {},
      },
    };

    mockSnackbar = {
      success: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        AuthStore,
        { provide: AccountApiService, useValue: mockAccountApi },
        { provide: LoginApiService, useValue: mockLoginApi },
        { provide: ErrorHandlerService, useValue: mockErrorHandler },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: SnackbarService, useValue: mockSnackbar },
      ],
    });

    store = TestBed.inject(AuthStore);
  });

  describe('Initial State', () => {
    it('should initialize with default state', () => {
      expect(store.user()).toBeNull();
      expect(store.isLoading()).toBe(false);
      expect(store.isLoggedIn()).toBe(false);
    });
  });

  describe('initAuth', () => {
    it('should load user info successfully when authenticated', async () => {
      store.initAuth();

      await wait(50);
      expect(store.user()).toEqual(mockUser);
      expect(store.isLoggedIn()).toBe(true);
      expect(store.isLoading()).toBe(false);
      expect(mockAccountApi.getUserInfo$).toHaveBeenCalled();
    });

    it('should handle null user when not authenticated', async () => {
      mockAccountApi.getUserInfo$.mockReturnValue(of(null));

      store.initAuth();

      await wait(50);
      expect(store.user()).toBeNull();
      expect(store.isLoggedIn()).toBe(false);
      expect(store.isLoading()).toBe(false);
    });

    it('should handle error', async () => {
      const error = new Error('Auth Error');
      mockAccountApi.getUserInfo$.mockReturnValue(throwError(() => error));

      store.initAuth();

      await wait(50);
      expect(store.isLoading()).toBe(false);
      expect(mockErrorHandler.handleError).toHaveBeenCalledWith('AuthStore', error);
    });
  });

  describe('register', () => {
    it('should register successfully and navigate to login', async () => {
      const registerParams = {
        email: 'newuser@example.com',
        firstName: 'New',
        lastName: 'User',
        password: 'password123',
      };

      store.register(registerParams);

      await wait(50);
      expect(mockAccountApi.register$).toHaveBeenCalledWith(registerParams);
      expect(mockSnackbar.success).toHaveBeenCalledWith('Registration successful - you can now login!');
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/login');
      expect(store.isLoading()).toBe(false);
    });

    it('should handle registration error', async () => {
      const error = new Error('Registration Error');
      mockAccountApi.register$.mockReturnValue(throwError(() => error));

      store.register({
        email: 'newuser@example.com',
        firstName: 'New',
        lastName: 'User',
        password: 'password123',
      });

      await wait(50);
      expect(mockErrorHandler.handleError).toHaveBeenCalledWith('AuthStore', error);
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/login');
    });
  });

  describe('login', () => {
    it('should login successfully and navigate to shop', async () => {
      const loginParams = {
        email: 'test@example.com',
        password: 'password123',
      };

      store.login(loginParams);

      await wait(50);
      expect(mockLoginApi.login$).toHaveBeenCalledWith(loginParams);
      expect(mockAccountApi.getUserInfo$).toHaveBeenCalled();
      expect(store.user()).toEqual(mockUser);
      expect(store.isLoggedIn()).toBe(true);
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/shop');
      expect(store.isLoading()).toBe(false);
    });

    it('should redirect to returnUrl when provided', async () => {
      mockActivatedRoute.snapshot.queryParams['returnUrl'] = '/checkout';

      const loginParams = {
        email: 'test@example.com',
        password: 'password123',
      };

      store.login(loginParams);

      await wait(50);
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/checkout');
    });

    it('should handle login error', async () => {
      const error = new Error('Login Error');
      mockLoginApi.login$.mockReturnValue(throwError(() => error));

      store.login({
        email: 'test@example.com',
        password: 'password123',
      });

      await wait(50);
      expect(mockErrorHandler.handleError).toHaveBeenCalledWith('AuthStore', error);
      expect(store.isLoading()).toBe(false);
    });

    it('should handle getUserInfo error after successful login', async () => {
      const error = new Error('GetUserInfo Error');
      mockAccountApi.getUserInfo$.mockReturnValue(throwError(() => error));

      store.login({
        email: 'test@example.com',
        password: 'password123',
      });

      await wait(50);
      expect(mockErrorHandler.handleError).toHaveBeenCalledWith('AuthStore', error);
      expect(store.isLoading()).toBe(false);
    });
  });

  describe('logout', () => {
    it('should logout successfully and navigate to login', async () => {
      store.login({
        email: 'test@example.com',
        password: 'password123',
      });

      await wait(50);
      store.logout();

      await wait(50);
      expect(mockAccountApi.logout$).toHaveBeenCalled();
      expect(store.user()).toBeNull();
      expect(store.isLoggedIn()).toBe(false);
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/login');
      expect(store.isLoading()).toBe(false);
    });

    it('should handle logout error', async () => {
      const error = new Error('Logout Error');
      mockAccountApi.logout$.mockReturnValue(throwError(() => error));

      store.logout();

      await wait(50);
      expect(mockErrorHandler.handleError).toHaveBeenCalledWith('AuthStore', error);
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/login');
      expect(store.isLoading()).toBe(false);
    });
  });

  describe('updateAddress', () => {
    const mockAddress = {
      line1: '456 New St',
      line2: 'Suite 10',
      city: 'New City',
      state: 'NC',
      postalCode: '54321',
      country: 'US',
    };

    it('should update address successfully', async () => {
      store.login({
        email: 'test@example.com',
        password: 'password123',
      });

      await wait(50);
      const newAddress = mockAddress;
      store.updateAddress(newAddress);

      await wait(50);
      expect(mockAccountApi.updateAddress$).toHaveBeenCalledWith(newAddress);
      expect(store.user()?.address).toEqual(newAddress);
      expect(store.isLoading()).toBe(false);
    });

    it('should handle update error', async () => {
      const error = new Error('Update Error');
      mockAccountApi.updateAddress$.mockReturnValue(throwError(() => error));

      store.updateAddress(mockAddress);

      await wait(50);
      expect(mockErrorHandler.handleError).toHaveBeenCalledWith('AuthStore', error);
      expect(store.isLoading()).toBe(false);
    });
  });
});
