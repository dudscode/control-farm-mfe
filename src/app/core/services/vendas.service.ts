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
  {
    id: 6,
    productName: 'Cenoura',
    locationLotes: '9452 Vegetable Lane',
    dateTime: new Date('2019-10-05T08:20:00'),
    piece: 756,
    lucros: 25780,
  },
  {
    id: 7,
    productName: 'Abóbora',
    locationLotes: '2374 Autumn Fields',
    dateTime: new Date('2019-10-18T15:40:00'),
    piece: 215,
    lucros: 19650,
  },
  {
    id: 8,
    productName: 'Cebola',
    locationLotes: '5680 Root Gardens',
    dateTime: new Date('2019-11-03T10:15:00'),
    piece: 894,
    lucros: 31275,
  },
  {
    id: 9,
    productName: 'Repolho',
    locationLotes: '7129 Green Valley',
    dateTime: new Date('2019-11-22T14:50:00'),
    piece: 327,
    lucros: 16430,
  },
  {
    id: 10,
    productName: 'Pepino',
    locationLotes: '4032 Fresh Meadows',
    dateTime: new Date('2019-12-08T09:25:00'),
    piece: 512,
    lucros: 23670,
  },
  {
    id: 11,
    productName: 'Abobrinha',
    locationLotes: '8745 Harvest Fields',
    dateTime: new Date('2020-01-14T11:30:00'),
    piece: 368,
    lucros: 17890,
  },
  {
    id: 12,
    productName: 'Pimentão',
    locationLotes: '3214 Sunny Acres',
    dateTime: new Date('2020-02-03T13:45:00'),
    piece: 423,
    lucros: 29450,
  },
  {
    id: 13,
    productName: 'Beterraba',
    locationLotes: '6578 Root Haven',
    dateTime: new Date('2020-02-25T10:20:00'),
    piece: 581,
    lucros: 22180,
  },
  {
    id: 14,
    productName: 'Couve',
    locationLotes: '9123 Leafy Gardens',
    dateTime: new Date('2020-03-11T16:05:00'),
    piece: 297,
    lucros: 15820,
  },
  {
    id: 15,
    productName: 'Brócolis',
    locationLotes: '5387 Green Heights',
    dateTime: new Date('2020-04-02T14:30:00'),
    piece: 345,
    lucros: 27640,
  },
  {
    id: 16,
    productName: 'Espinafre',
    locationLotes: '7694 Spinach Fields',
    dateTime: new Date('2020-04-19T08:50:00'),
    piece: 476,
    lucros: 19270,
  },
  {
    id: 17,
    productName: 'Berinjela',
    locationLotes: '3452 Purple Gardens',
    dateTime: new Date('2020-05-07T12:15:00'),
    piece: 289,
    lucros: 23580,
  },
  {
    id: 18,
    productName: 'Rúcula',
    locationLotes: '8921 Fresh Greens',
    dateTime: new Date('2020-05-24T09:40:00'),
    piece: 352,
    lucros: 16790,
  },
  {
    id: 19,
    productName: 'Melancia',
    locationLotes: '4765 Melon Valley',
    dateTime: new Date('2020-06-12T11:25:00'),
    piece: 173,
    lucros: 38650,
  },
  {
    id: 20,
    productName: 'Mandioca',
    locationLotes: '6329 Root Fields',
    dateTime: new Date('2020-06-29T10:10:00'),
    piece: 683,
    lucros: 32940,
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
