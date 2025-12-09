import { Component, inject, type OnInit } from '@angular/core';
import { MatError } from '@angular/material/input';

import { CartStore } from '@state/cart';
import { StripeStore } from '@state/stripe';

@Component({
  selector: 'app-stripe-container',
  imports: [MatError],
  templateUrl: './stripe-container.component.html',
  styleUrl: './stripe-container.component.scss',
})
export class StripeContainerComponent implements OnInit {
  protected readonly CartStore = inject(CartStore);
  protected readonly StripeStore = inject(StripeStore);

  protected readonly isLoading = this.StripeStore.isLoading;
  protected readonly error = this.StripeStore.error;

  ngOnInit() {
    this.StripeStore.initializeStripe();
  }
}
