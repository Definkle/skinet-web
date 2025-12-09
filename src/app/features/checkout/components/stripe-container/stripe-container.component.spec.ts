import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { StripeContainerComponent } from './stripe-container.component';

describe('StripeContainerComponent', () => {
  let component: StripeContainerComponent;
  let fixture: ComponentFixture<StripeContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StripeContainerComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(StripeContainerComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
