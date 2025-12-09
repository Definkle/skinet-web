import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';

import { type CartItem } from '@models/cart';

import { CartItemComponent } from './cart-item.component';

describe('CartItemComponent', () => {
  let component: CartItemComponent;
  let fixture: ComponentFixture<CartItemComponent>;
  const mockCartItem: CartItem = {
    productId: 1,
    type: '',
    brand: '',
    pictureUrl: '',
    productName: '',
    quantity: 1,
    productPrice: 0,
  };
  const mockIsLoading = false;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartItemComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(CartItemComponent);
    fixture.componentRef.setInput('item', mockCartItem);
    fixture.componentRef.setInput('isLoading', mockIsLoading);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
