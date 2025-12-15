import { type Routes } from '@angular/router';

import { deliveryMethodsResolver } from '@resolvers/delivery-methods/delivery-methods.resolver';

import { authGuard } from '@core/route-access/guards/auth/auth.guard';
import { cartGuard } from '@core/route-access/guards/cart/cart.guard';

export const checkoutRoutes: Routes = [
  {
    path: 'checkout',
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/checkout-page/checkout-page.component').then((m) => m.CheckoutPageComponent),
      },
      {
        path: 'success',
        loadComponent: () => import('./pages/checkout-success/checkout-success.component').then((m) => m.CheckoutSuccessComponent),
      },
    ],
    title: 'Skinet Web',
    canActivate: [authGuard, cartGuard],
    resolve: [deliveryMethodsResolver],
  },
];
