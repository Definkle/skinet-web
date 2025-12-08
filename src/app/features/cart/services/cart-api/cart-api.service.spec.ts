import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect } from 'vitest';

import { CartApiService } from '@features/cart/services/cart-api/cart-api.service';

describe('CartApiService', () => {
  let service: CartApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
