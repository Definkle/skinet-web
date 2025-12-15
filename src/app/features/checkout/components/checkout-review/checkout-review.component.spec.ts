import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { CheckoutReview } from './checkout-review.component';

describe('CheckoutReview', () => {
  let component: CheckoutReview;
  let fixture: ComponentFixture<CheckoutReview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutReview],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckoutReview);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
