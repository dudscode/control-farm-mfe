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
      ],
      productsData: [
        {
          id: 1,
          productName: 'Morango',
          locationLotes: '6096 Marjolaine Landing',
          dateTime: new Date('2019-09-12T12:53:00'),
          piece: 423,
          lucros: 34295,
        },
        {
          id: 2,
          productName: 'Milho',
          locationLotes: '6096 Marjolaine Landing',
          dateTime: new Date('2019-09-12T12:53:00'),
          piece: 423,
          lucros: 34295,
        },
        {
          id: 3,
          productName: 'Batata',
          locationLotes: '4721 Farming Heights',
          dateTime: new Date('2019-09-15T09:30:00'),
          piece: 612,
          lucros: 28750,
        },
        {
          id: 4,
          productName: 'Tomate',
          locationLotes: '8233 Harvest Valley',
          dateTime: new Date('2019-09-18T14:15:00'),
          piece: 527,
          lucros: 42180,
        },
        {
          id: 5,
          productName: 'Alface',
          locationLotes: '3118 Green Fields',
          dateTime: new Date('2019-09-21T11:45:00'),
          piece: 348,
          lucros: 18640,
        },
      ],
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
