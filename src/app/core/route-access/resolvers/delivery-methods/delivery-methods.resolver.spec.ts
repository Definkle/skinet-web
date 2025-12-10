import { TestBed } from '@angular/core/testing';
import type { ResolveFn } from '@angular/router';

import { deliveryMethodsResolver } from './delivery-methods.resolver';

describe('deliveryMethodsResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => deliveryMethodsResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
