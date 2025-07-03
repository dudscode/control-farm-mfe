import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'vendas',
    pathMatch: 'full',
  },
  {
    path: 'vendas',
    loadComponent: () =>
      import('./core/pages/vendas/vendas.component').then(
        (m) => m.VendasComponent
      ),
  },
  {
    path: 'producao',
    loadComponent: () =>
      import('./core/pages/producao/producao.component').then(
        (m) => m.ProducaoComponent
      ),
  },
  {
    path: 'metas',
    loadComponent: () =>
      import('./core/pages/metas/metas.component').then(
        (m) => m.MetasComponent
      ),
  },
];
