import { type Routes } from '@angular/router';

import { authRoutes } from '@features/auth/auth.routes';
import { cartRoutes } from '@features/cart/cart.routes';
import { checkoutRoutes } from '@features/checkout/checkout.routes';
import { productsRoutes } from '@features/products/products.routes';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
    title: 'Skinet Web',
  },
  ...productsRoutes,
  ...cartRoutes,
  ...checkoutRoutes,
  ...authRoutes,
  {
    path: 'not-found',
    loadComponent: () => import('@app/pages/not-found/not-found.component').then((m) => m.NotFoundComponent),
    title: 'Not Found',
  },
  {
    path: 'server-error',
    loadComponent: () => import('@app/pages/server-error/server-error.component').then((m) => m.ServerErrorComponent),
    title: 'Server Error',
  },

  { path: '**', redirectTo: 'not-found', pathMatch: 'full' },
];
