import { signalStore, withMethods, withState } from '@ngrx/signals';

const checkoutInitialState = {
  currentStep: 1,
  steps: [1, 2, 3, 4],
};

export const CheckoutStore = signalStore(
  {
    providedIn: 'root',
  },
  withState(checkoutInitialState),
  withMethods(() => ({}))
);
