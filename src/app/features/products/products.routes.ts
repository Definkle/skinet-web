import { Routes } from '@angular/router';

import { productDetailResolver } from './pages/product-detail/product-detail.resolver';

export const productsRoutes: Routes = [
  {
    path: 'shop',
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/product-list/product-list.component').then((m) => m.ProductListComponent),
        title: 'Skinet Web',
      },
      {
        path: ':id',
        loadComponent: () => import('./pages/product-detail/product-detail.component').then((m) => m.ProductDetailComponent),
        title: 'Product Detail',
        resolve: {
          product: productDetailResolver,
        },
      },
    ],
  },
];
