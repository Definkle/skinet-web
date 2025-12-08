import { Routes } from '@angular/router';

import { authGuard } from '@core/guards/auth/auth.guard';

export const cartRoutes: Routes = [
  {
    path: 'cart',
    loadComponent: () => import('./pages/cart-page/cart-page.component').then((m) => m.CartPageComponent),
    title: 'Skinet Web',
    canActivate: [authGuard],
  },
];
