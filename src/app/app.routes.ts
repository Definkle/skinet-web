import { Routes } from '@angular/router';
import { productDetailResolver } from './core/resolvers/product-detail/product-detail.resolver';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then((m) => m.Home),
    title: 'Skinet Web',
  },
  {
    path: 'shop',
    loadComponent: () => import('./features/shop/shop.component').then((m) => m.Shop),
    title: 'Skinet Web',
  },
  {
    path: 'shop/:id',
    loadComponent: () =>
      import('./features/shop/product-detail/product-detail.component').then(
        (m) => m.ProductDetail,
      ),
    title: 'Product Detail',
    resolve: {
      product: productDetailResolver,
    },
  },
  {
    path: 'cart',
    loadComponent: () => import('./features/cart/cart.component').then((m) => m.Cart),
    title: 'Skinet Web',
  },
  {
    path: 'checkout',
    loadComponent: () => import('./features/checkout/checkout.component').then((m) => m.Checkout),
    title: 'Skinet Web',
  },
  {
    path: 'not-found',
    loadComponent: () =>
      import('./shared/components/not-found/not-found.component').then((m) => m.NotFound),
    title: 'Not Found',
  },
  {
    path: 'server-error',
    loadComponent: () =>
      import('./shared/components/server-error/server-error.component').then((m) => m.ServerError),
    title: 'Server Error',
  },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then((m) => m.Login),
    title: 'Skinet Web',
  },
  { path: '**', redirectTo: 'not-found', pathMatch: 'full' },
];
