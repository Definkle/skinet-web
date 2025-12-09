import { type Routes } from '@angular/router';

import { authGuard } from '@guards/auth/auth.guard';
import { cartGuard } from '@guards/cart/cart.guard';

export const checkoutRoutes: Routes = [
  {
    path: 'checkout',
    loadComponent: () => import('./pages/checkout-page/checkout-page.component').then((m) => m.CheckoutPageComponent),
    title: 'Skinet Web',
    canActivate: [authGuard, cartGuard],
  },
];
