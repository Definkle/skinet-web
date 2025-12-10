import { type Routes } from '@angular/router';

import { deliveryMethodsResolver } from '@resolvers/delivery-methods/delivery-methods.resolver';

export const cartRoutes: Routes = [
  {
    path: 'cart',
    loadComponent: () => import('./pages/cart-page/cart-page.component').then((m) => m.CartPageComponent),
    title: 'Skinet Web',
    resolve: [deliveryMethodsResolver],
  },
];
