import { Routes } from '@angular/router';
import { productDetailResolver } from './core/resolvers/product-detail/product-detail.resolver';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
    title: 'Skinet Web',
  },
  {
    path: 'shop',
    loadComponent: () => import('./features/shop/shop.component').then((m) => m.ShopComponent),
    title: 'Skinet Web',
  },
  {
    path: 'shop/:id',
    loadComponent: () =>
      import('./features/shop/product-detail/product-detail.component').then(
        (m) => m.ProductDetailComponent,
      ),
    title: 'Product Detail',
    resolve: {
      product: productDetailResolver,
    },
  },
  {
    path: 'cart',
    loadComponent: () => import('./features/cart/cart.component').then((m) => m.CartComponent),
    title: 'Skinet Web',
  },
  {
    path: 'checkout',
    loadComponent: () => import('./features/checkout/checkout.component').then((m) => m.CheckoutComponent),
    title: 'Skinet Web',
  },
  {
    path: 'not-found',
    loadComponent: () =>
      import('./shared/components/not-found/not-found.component').then((m) => m.NotFoundComponent),
    title: 'Not Found',
  },
  {
    path: 'server-error',
    loadComponent: () =>
      import('./shared/components/server-error/server-error.component').then((m) => m.ServerErrorComponent),
    title: 'Server Error',
  },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then((m) => m.LoginComponent),
    title: 'Skinet Web',
  },
  { path: '**', redirectTo: 'not-found', pathMatch: 'full' },
];
