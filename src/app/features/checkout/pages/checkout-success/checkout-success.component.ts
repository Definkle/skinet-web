import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-checkout-success',
  imports: [RouterLink, MatButton],
  templateUrl: './checkout-success.component.html',
  styleUrl: './checkout-success.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutSuccessComponent {}
