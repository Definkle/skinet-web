import { TestBed } from '@angular/core/testing';

import { ErrorHandler } from './error-handler.service';

describe('ErrorHandler', () => {
  let service: ErrorHandler;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorHandler);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
