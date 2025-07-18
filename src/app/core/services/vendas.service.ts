import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { VendaResponse } from '../domain/vendas/venda-response.interface';

@Injectable({
  providedIn: 'root',
})
export class VendasService {
  constructor() {}

  getVendas(): Observable<VendaResponse> {
    const response: VendaResponse = {
      dashboardCardData: this.mapToDashboardCardData(),
      dashboardprofitData: [
        {
          produto: 'Milho',
          vendasPorMes: [
            { mes: 2, nome: 'Fev', valor: 20 },
            { mes: 3, nome: 'Mar', valor: 35 },
            { mes: 4, nome: 'Abr', valor: 15 },
            { mes: 5, nome: 'Mai', valor: 25 },
            { mes: 6, nome: 'Jun', valor: 10 },
            { mes: 7, nome: 'Jul', valor: 15 },
          ],
        },
        {
          produto: 'morango',
          vendasPorMes: [
            { mes: 2, nome: 'Fev', valor: 20 },
            { mes: 3, nome: 'Mar', valor: 35 },
            { mes: 4, nome: 'Abr', valor: 15 },
            { mes: 5, nome: 'Mai', valor: 25 },
            { mes: 6, nome: 'Jun', valor: 10 },
            { mes: 7, nome: 'Jul', valor: 15 },
          ],
        },
        {
          produto: 'batata',
          vendasPorMes: [
            { mes: 2, nome: 'Fev', valor: 20 },
            { mes: 3, nome: 'Mar', valor: 35 },
            { mes: 4, nome: 'Abr', valor: 15 },
            { mes: 5, nome: 'Mai', valor: 25 },
            { mes: 6, nome: 'Jun', valor: 10 },
            { mes: 7, nome: 'Jul', valor: 15 },
          ],
        },
      ]
    };
    return of(response);
  }

  private mapToDashboardCardData() {
    return [
      {
        icon: 'icon/cube-icon.svg',
        cardMetric: 10293,
        efficiencyPercentage: 1.3,
        label: 'Total de produtos',
        isCurrency: false,
        isPositive: true,
      },
      {
        icon: 'icon/finance-icon.svg',
        cardMetric: -89000,
        efficiencyPercentage: 4.2,
        label: 'Total de vendas',
        isCurrency: true,
        isPositive: false,
      },
      {
        icon: 'icon/person-icon.svg',
        cardMetric: 40689,
        efficiencyPercentage: 8.5,
        label: 'Compradores',
        isCurrency: false,
        isPositive: false,
      },
    ];
  }
}
