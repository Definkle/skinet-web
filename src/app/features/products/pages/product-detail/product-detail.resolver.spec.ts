import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { productDetailResolver } from './product-detail.resolver';

describe('productDetailResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => productDetailResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
