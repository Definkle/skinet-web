import { type Routes } from '@angular/router';

import { preventLoginAccess } from '@guards/auth/auth.guard';

export const authRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent),
    title: 'Skinet Web',
    canActivate: [preventLoginAccess],
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then((m) => m.RegisterComponent),
    title: 'Skinet Web',
  },
];
