import { type Routes } from '@angular/router';

import { deliveryMethodsResolver } from '@resolvers/delivery-methods/delivery-methods.resolver';

import { authGuard } from '@core/route-access/guards/auth/auth.guard';
import { cartGuard } from '@core/route-access/guards/cart/cart.guard';

export const checkoutRoutes: Routes = [
  {
    path: 'checkout',
    loadComponent: () => import('./pages/checkout-page/checkout-page.component').then((m) => m.CheckoutPageComponent),
    title: 'Skinet Web',
    canActivate: [authGuard, cartGuard],
    resolve: [deliveryMethodsResolver],
  },
];
