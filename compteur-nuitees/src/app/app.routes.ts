import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home').then((m) => m.Home) },
  {
    path: 'plafond/:slug',
    loadComponent: () => import('./pages/commune/commune-page').then((m) => m.CommunePage),
  },
  {
    path: 'mentions-legales',
    loadComponent: () => import('./pages/legal/mentions-legales').then((m) => m.MentionsLegales),
  },
  {
    path: 'confidentialite',
    loadComponent: () => import('./pages/legal/confidentialite').then((m) => m.Confidentialite),
  },
  { path: '**', loadComponent: () => import('./pages/not-found').then((m) => m.NotFound) },
];
