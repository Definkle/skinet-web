import { Routes } from '@angular/router';

export const checkoutRoutes: Routes = [
  {
    path: 'checkout',
    loadComponent: () => import('./pages/checkout-page/checkout-page.component').then((m) => m.CheckoutPageComponent),
    title: 'Skinet Web',
  },
];
