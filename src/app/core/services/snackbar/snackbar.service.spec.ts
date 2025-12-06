import { TestBed } from '@angular/core/testing';

import { Snackbar } from './snackbar.service';

describe('Snackbar', () => {
  let service: Snackbar;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Snackbar);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
