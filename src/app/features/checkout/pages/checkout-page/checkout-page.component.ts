import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-checkout',
  imports: [],
  templateUrl: './checkout-page.component.html',
  styleUrl: './checkout-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutPageComponent {}
