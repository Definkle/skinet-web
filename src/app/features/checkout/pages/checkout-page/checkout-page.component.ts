import { ChangeDetectionStrategy, Component, inject, signal, type OnDestroy } from '@angular/core';
import { Field, form } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatStep, MatStepContent, MatStepLabel, MatStepper, MatStepperNext, MatStepperPrevious } from '@angular/material/stepper';
import { RouterLink } from '@angular/router';

import { SnackbarService } from '@core/services/snackbar/snackbar.service';

import { CartSummaryComponent } from '@features/cart/components/cart-summary/cart-summary.component';
import { CheckoutAddressComponent } from '@features/checkout/components/checkout-address/checkout-address.component';
import { CheckoutDeliveryComponent } from '@features/checkout/components/checkout-delivery/checkout-delivery.component';
import { CheckoutPaymentComponent } from '@features/checkout/components/checkout-payment/checkout-payment.component';
import { mapStripeAddressToAddressDto } from '@features/checkout/models/stripe.models';
import { CheckoutStore } from '@features/checkout/state/checkout';
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
    MatCheckbox,
    Field,
    CheckoutAddressComponent,
    CheckoutDeliveryComponent,
    CheckoutPaymentComponent,
  ],
  templateUrl: './checkout-page.component.html',
  styleUrl: './checkout-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutPageComponent implements OnDestroy {
  protected readonly CartStore = inject(CartStore);
  protected readonly CheckoutStore = inject(CheckoutStore);
  private readonly _AuthStore = inject(AuthStore);
  private readonly _Snackbar = inject(SnackbarService);
  private readonly _StripeStore = inject(StripeStore);

  protected readonly checkbox = form(signal({ field: false }));

  ngOnDestroy(): void {
    this._StripeStore.resetStore();
  }

  onClickNextAddress() {
    if (this.checkbox.field().value()) {
      const stripeAddress = this._StripeStore.addressValue();

      if (!stripeAddress) {
        this._Snackbar.error('Address is incomplete!');
        return;
      }

      this._AuthStore.updateAddress(mapStripeAddressToAddressDto(stripeAddress));
    }
  }

  onClickNextDelivery() {
    this._StripeStore.updatePaymentIntent(this.CartStore.id());
  }
}
