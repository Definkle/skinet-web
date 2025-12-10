import { CurrencyPipe, Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { RouterLink } from '@angular/router';

import { CardComponent } from '@components/card/card.component';

import { CartStore } from '@state/cart';

@Component({
  selector: 'app-cart-summary',
  imports: [CurrencyPipe, RouterLink, MatButton, MatFormField, MatLabel, MatInput, CardComponent],
  templateUrl: './cart-summary.component.html',
  styleUrl: './cart-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartSummaryComponent {
  protected readonly CartStore = inject(CartStore);

  location = inject(Location);
}
