import { TestBed } from '@angular/core/testing';

import { LoginApiService } from './login-api.service';

describe('LoginApi', () => {
  let service: LoginApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
