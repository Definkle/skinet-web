import { ChangeDetectionStrategy, Component, inject, signal, type OnDestroy } from '@angular/core';
import { Field, form } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatStep, MatStepContent, MatStepLabel, MatStepper, MatStepperNext, MatStepperPrevious } from '@angular/material/stepper';
import { RouterLink } from '@angular/router';

import type { AddressDto } from '@api-models';

import { SnackbarService } from '@core/services/snackbar/snackbar.service';

import { CartSummaryComponent } from '@features/cart/components/cart-summary/cart-summary.component';
import { StripeContainerComponent } from '@features/checkout/components/stripe-container/stripe-container.component';
import { StripeStore } from '@features/checkout/state/stripe';

import { AuthStore } from '@state/auth';
import { CartStore } from '@state/cart';

@Component({
  selector: 'app-checkout',
  imports: [
    CartSummaryComponent,
    MatStepper,
    MatStep,
    MatStepLabel,
    MatStepContent,
    MatStepperNext,
    MatButton,
    MatStepperPrevious,
    RouterLink,
    StripeContainerComponent,
    MatCheckbox,
    Field,
  ],
  templateUrl: './checkout-page.component.html',
  styleUrl: './checkout-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutPageComponent implements OnDestroy {
  protected readonly CartStore = inject(CartStore);
  private readonly _AuthStore = inject(AuthStore);
  private readonly _Snackbar = inject(SnackbarService);
  private readonly _StripeStore = inject(StripeStore);

  protected readonly checkbox = form(signal({ field: false }));

  ngOnDestroy(): void {
    this._StripeStore.resetStore();
  }

  onClickNextStep() {
    if (this.checkbox.field().value()) {
      const stripeAddress = this._StripeStore.addressValue();

      if (!stripeAddress) {
        this._Snackbar.error('Address is incomplete!');
        return;
      }

      const address: AddressDto = {
        line1: stripeAddress.line1,
        line2: stripeAddress.line2 ?? '',
        city: stripeAddress.city,
        state: stripeAddress.state,
        country: stripeAddress.country,
        postalCode: stripeAddress.postal_code,
      };
      this._AuthStore.updateAddress(address);
    }
  }
}
