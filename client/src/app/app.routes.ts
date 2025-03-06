import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./components/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: 'history',
    loadComponent: () =>
      import('./components/url-history/url-history.component').then(
        (m) => m.UrlHistoryComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
